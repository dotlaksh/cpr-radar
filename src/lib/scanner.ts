import {
  Candle,
  aggregate,
  monthlyKey,
  quarterlyKey,
  yearlyKey,
  cpr,
  ema,
} from "./cpr";
import { ScanResult, CPRLevels } from "../types/scanner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Simple session-level cache for market data
const marketDataCache = new Map<string, Candle[]>();

export async function fetchMarketData(symbol: string): Promise<Candle[] | null> {
  // Check cache first
  if (marketDataCache.has(symbol)) {
    return marketDataCache.get(symbol) || null;
  }

  try {
    if (!SUPABASE_URL) throw new Error("VITE_SUPABASE_URL is not defined");
    const url = `${SUPABASE_URL}/functions/v1/market-data?symbol=${encodeURIComponent(symbol)}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    const candles = j.candles ?? null;
    
    // Store in cache if successful
    if (candles) {
      marketDataCache.set(symbol, candles);
    }
    
    return candles;
  } catch (err) {
    console.error(`Error fetching data for ${symbol}:`, err);
    return null;
  }
}

export function evaluate(
  symbol: string,
  candles: Candle[]
): ScanResult | null {
  if (!candles || candles.length < 250) return null;

  const closes = candles.map((c) => c.c);
  const e20 = ema(closes.slice(-200), 20);
  const e50 = ema(closes.slice(-300), 50);
  const e200 = ema(closes, 200);
  const price = closes[closes.length - 1];

  const monthly = aggregate(candles, monthlyKey);
  const quarterly = aggregate(candles, quarterlyKey);
  const yearly = aggregate(candles, yearlyKey);

  // targeted periods for May 2026
  const now = new Date();
  const currentMonthKey = monthlyKey(now);
  const currentQuarterKey = quarterlyKey(now);
  const currentYearKey = yearlyKey(now);

  const getPriorPeriod = (periods: Candle[], currentKey: string, keyFn: (d: Date) => string) => {
    const idx = periods.findIndex(p => keyFn(new Date(p.t)) === currentKey);
    if (idx > 0) return periods[idx - 1];
    if (idx === 0) return null;
    return periods[periods.length - 1];
  };

  const aprilData = getPriorPeriod(monthly, currentMonthKey, monthlyKey);
  const q1Data = getPriorPeriod(quarterly, currentQuarterKey, quarterlyKey);
  const y2025Data = getPriorPeriod(yearly, currentYearKey, yearlyKey);

  if (!aprilData || !q1Data || !y2025Data) return null;

  const monthlyCPR = cpr(aprilData);
  const quarterlyCPR = cpr(q1Data);
  const yearlyCPR = cpr(y2025Data);

  // CPR Cluster Logic (Multi-Timeframe Confluence)
  const mids = [monthlyCPR.pivot, quarterlyCPR.pivot, yearlyCPR.pivot];
  const clusterMin = Math.min(...mids);
  const clusterMax = Math.max(...mids);
  const clusterWidth = clusterMax - clusterMin;
  const clusterWidthPct = (clusterWidth / price) * 100;
  const isCluster = clusterWidthPct < 1.0; // Tightened to 1%

  const cprWidthPct = (monthlyCPR.width / price) * 100;
  const narrow = cprWidthPct < 0.5;

  const priceAbovePivots = price > yearlyCPR.tc && price > quarterlyCPR.tc;
  const priceBelowPivots = price < yearlyCPR.bc && price < quarterlyCPR.bc;

  const confluenceLong = priceAbovePivots && narrow;
  const confluenceShort = priceBelowPivots && narrow;

  // Watchlist logic
  const isNearCluster = price >= clusterMin * 0.9975 && price <= clusterMax * 1.0025;

  // CPR Proximity Check (CMP must be near all 3 pivots)
  const distM = Math.abs(monthlyCPR.pivot / price - 1) * 100;
  const distQ = Math.abs(quarterlyCPR.pivot / price - 1) * 100;
  const distY = Math.abs(yearlyCPR.pivot / price - 1) * 100;
  const isTradable = distM < 5.0 && distQ < 5.0 && distY < 5.0;

  // Helper for width labeling
  const getWidthLabel = (width: number, p: number) => {
    const pct = (width / p) * 100;
    if (pct < 0.1) return "Ultra Narrow";
    if (pct < 0.5) return "Narrow";
    if (pct < 1.5) return "Normal";
    return "Wide";
  };

  // Helper for relationship labeling
  const getRelationship = (c1: CPRLevels, c2: CPRLevels, p: number) => {
    let relation = "Overlap";
    if (c1.bc > c2.tc) relation = "Above";
    if (c1.tc < c2.bc) relation = "Below";
    const diff = Math.abs(c1.pivot / p - c2.pivot / p) * 100;
    let tightness = "Far";
    if (diff < 0.25) tightness = "Very Tight";
    else if (diff < 0.75) tightness = "Tight";
    else if (diff < 1.5) tightness = "Loose";
    return { relation, tightness };
  };

  const relationships = [
    { pair: "Monthly / Quarterly", ...getRelationship(monthlyCPR, quarterlyCPR, price) },
    { pair: "Quarterly / Yearly", ...getRelationship(quarterlyCPR, yearlyCPR, price) },
    { pair: "Monthly / Yearly", ...getRelationship(monthlyCPR, yearlyCPR, price) },
  ];

  let structure: "Perfect Confluence" | "Tight Cluster" | "Bullish Stack" | "Bearish Stack" | "Mixed Structure" = "Mixed Structure";
  if (clusterWidthPct < 0.25) structure = "Perfect Confluence";
  else if (clusterWidthPct < 1.0) structure = "Tight Cluster";
  else if (monthlyCPR.pivot > quarterlyCPR.pivot && quarterlyCPR.pivot > yearlyCPR.pivot) structure = "Bullish Stack";
  else if (monthlyCPR.pivot < quarterlyCPR.pivot && quarterlyCPR.pivot < yearlyCPR.pivot) structure = "Bearish Stack";

  let pricePosition: "Inside" | "Above" | "Below" = "Inside";
  if (price > clusterMax) pricePosition = "Above";
  else if (price < clusterMin) pricePosition = "Below";

  // Determine setup type
  let setupType: "A+" | "SIGNAL" | "CLUSTER" | "WATCHLIST" | null = null;
  let direction: "LONG" | "SHORT" | "NEUTRAL" = "NEUTRAL";

  if ((confluenceLong || confluenceShort) && isCluster) {
    setupType = "A+";
    direction = confluenceLong ? "LONG" : "SHORT";
  } else if (confluenceLong || confluenceShort) {
    setupType = "SIGNAL";
    direction = confluenceLong ? "LONG" : "SHORT";
  } else if (isCluster) {
    setupType = "CLUSTER";
    direction = "NEUTRAL";
  } else if (isNearCluster) {
    setupType = "WATCHLIST";
    direction = "NEUTRAL";
  }

  // Strict filters: must have a setup AND be tradable near pivots
  if (!setupType || !isTradable) return null;

  const checks = [
    { label: "CPR Cluster (< 1%)", passed: isCluster },
    { label: "Monthly CPR Narrow (< 0.5%)", passed: narrow },
    { label: "Price near all Pivots (< 5%)", passed: isTradable },
    { label: "Price Structure Alignment", passed: priceAbovePivots || priceBelowPivots },
    { label: "Near Cluster Zone (< 0.25%)", passed: isNearCluster },
  ];

  return {
    symbol,
    price,
    direction,
    cprWidthPct,
    clusterWidthPct,
    isCluster,
    setupType,
    trend:
      direction === "LONG"
        ? "Bullish Alignment"
        : direction === "SHORT"
        ? "Bearish Alignment"
        : "Neutral / Consolidating",
    ema: { e20, e50, e200 },
    monthly: { ...monthlyCPR, label: getWidthLabel(monthlyCPR.width, price) },
    quarterly: { ...quarterlyCPR, label: getWidthLabel(quarterlyCPR.width, price) },
    yearly: { ...yearlyCPR, label: getWidthLabel(yearlyCPR.width, price) },
    relationships,
    structure,
    pricePosition,
    checks,
  };
}




