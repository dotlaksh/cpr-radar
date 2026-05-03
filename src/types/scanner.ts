export type Candle = { t: number; o: number; h: number; l: number; c: number };

export type CPRLevels = { pivot: number; tc: number; bc: number; width: number };

export type SetupType = "A+" | "SIGNAL" | "CLUSTER" | "WATCHLIST";

export type ScanResult = {
  symbol: string;
  price: number;
  direction: "LONG" | "SHORT" | "NEUTRAL";
  cprWidthPct: number;
  clusterWidthPct: number;
  isCluster: boolean;
  setupType: SetupType;
  trend: string;
  ema: { e20: number; e50: number; e200: number };
  monthly: CPRLevels & { label: string };
  quarterly: CPRLevels & { label: string };
  yearly: CPRLevels & { label: string };
  relationships: { pair: string; relation: string; tightness: string }[];
  structure: "Perfect Confluence" | "Tight Cluster" | "Bullish Stack" | "Bearish Stack" | "Mixed Structure";
  pricePosition: "Inside" | "Above" | "Below";
  checks: { label: string; passed: boolean }[];
};

export interface StockSymbol {
  Symbol: string;
  Name: string;
}

export interface UniverseConfig {
  name: string;
  symbols: StockSymbol[];
}
