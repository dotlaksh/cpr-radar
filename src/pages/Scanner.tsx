import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, SearchX, TrendingUp, TrendingDown, Zap, Target, Eye, ShieldCheck, Waves } from "lucide-react";
import nifty100 from "@/data/nifty100.json";
import midcap150 from "@/data/niftyMidcap150.json";
import smallcap250 from "@/data/niftySmallcap250.json";
import microcap250 from "@/data/niftyMicrocap250.json";
import { StockSymbol, UniverseConfig, ScanResult } from "@/types/scanner";
import { fetchMarketData, evaluate } from "@/lib/scanner";
import { StockDetailDialog } from "@/components/StockDetailDialog";

const UNIVERSES: Record<string, UniverseConfig> = {
  nifty100: { name: "NIFTY 100", symbols: (nifty100 as unknown) as StockSymbol[] },
  midcap150: { name: "NIFTY MIDCAP 150", symbols: (midcap150 as unknown) as StockSymbol[] },
  smallcap250: { name: "NIFTY SMALLCAP 250", symbols: (smallcap250 as unknown) as StockSymbol[] },
  microcap250: { name: "NIFTY MICROCAP 250", symbols: (microcap250 as unknown) as StockSymbol[] },
};

type Filter = "ALL" | "A+" | "HQ_CLUSTER" | "CLUSTER" | "WATCHLIST";

import { useScanner } from "@/hooks/useScanner";

export default function Scanner() {
  const { id = "nifty100" } = useParams<{ id: string }>();
  
  const universe = UNIVERSES[id];
  const total = universe?.symbols.length ?? 0;

  const { scanned, results, done } = useScanner(universe);
  const [selected, setSelected] = useState<ScanResult | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");

  const counts = useMemo(() => ({
    ALL: results.length,
    "A+": results.filter((r) => r.setupType === "A+").length,
    HQ_CLUSTER: results.filter((r) => r.isCluster && r.direction !== "NEUTRAL").length,
    CLUSTER: results.filter((r) => r.isCluster).length,
    WATCHLIST: results.filter((r) => r.setupType === "WATCHLIST").length,
  }), [results]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return results;
    if (filter === "A+") return results.filter((r) => r.setupType === "A+");
    if (filter === "HQ_CLUSTER") return results.filter((r) => r.isCluster && r.direction !== "NEUTRAL");
    if (filter === "CLUSTER") return results.filter((r) => r.isCluster);
    if (filter === "WATCHLIST") return results.filter((r) => r.setupType === "WATCHLIST");
    return results;
  }, [results, filter]);

  if (!universe) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-muted-foreground">Unknown universe</p>
      </main>
    );
  }

  const pct = total ? (scanned / total) * 100 : 0;
  const filters: Filter[] = ["ALL", "A+", "HQ_CLUSTER", "CLUSTER", "WATCHLIST"];

  return (
    <main className="min-h-screen pb-12">
      {/* Sticky mobile header */}
      <div className="sticky top-0 z-20 glass border-b">
        <div className="container px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 max-w-6xl">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-semibold truncate">{universe.name}</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1">
              <Waves className="w-3 h-3 text-indigo-400" /> Multi-Timeframe Confluence
            </p>
          </div>
          {done && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {results.length} setups
            </Badge>
          )}
        </div>

        {!done && (
          <div className="container px-4 sm:px-6 pb-3 max-w-6xl">
            <div className="flex justify-between text-[11px] sm:text-xs mb-1.5 text-muted-foreground">
              <span>Scanning {scanned} / {total}</span>
              <span>{pct.toFixed(0)}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        )}
      </div>

      <div className="container px-4 sm:px-6 pt-5 max-w-6xl">
        {/* Filter chips */}
        {results.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 scrollbar-none">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filter === f
                    ? f === "A+"
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-500"
                      : f === "CLUSTER" || f === "HQ_CLUSTER"
                      ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400"
                      : f === "WATCHLIST"
                      ? "bg-sky-500/15 border-sky-500/40 text-sky-400"
                      : "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "A+" && <Zap className="w-3 h-3" />}
                {(f === "CLUSTER" || f === "HQ_CLUSTER") && <Target className="w-3 h-3" />}
                {f === "WATCHLIST" && <Eye className="w-3 h-3" />}
                {f.replace("_", " ")}
                <span className="opacity-50 ml-1 text-[10px]">
                  {counts[f as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>
        )}

        {done && results.length === 0 && (
          <Card className="p-10 sm:p-14 text-center glass shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-base font-medium mb-1">No valid setups found</p>
            <p className="text-sm text-muted-foreground">Try another universe</p>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((r) => {
            const isLong = r.direction === "LONG";
            const isShort = r.direction === "SHORT";
            const isNeutral = r.direction === "NEUTRAL";
            
            return (
              <Card
                key={r.symbol}
                onClick={() => setSelected(r)}
                className="group relative p-4 sm:p-5 cursor-pointer glass shadow-card hover:border-primary/40 active:scale-[0.99] transition-all overflow-hidden"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isLong ? "bg-primary" : isShort ? "bg-destructive" : "bg-muted"
                  }`}
                />
                
                {r.setupType === "A+" && (
                  <div className="absolute top-0 right-0 p-1">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] py-0 px-1.5 h-5">
                      A+ Setup
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold truncate">{r.symbol}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4 bg-indigo-500/5 border-indigo-500/20 text-indigo-400">
                        {r.structure}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4 bg-sky-500/5 border-sky-500/20 text-sky-400">
                        Price {r.pricePosition}
                      </Badge>
                    </div>
                  </div>
                  {!isNeutral && (
                    <div
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold ${
                        isLong
                          ? "bg-primary/15 text-primary"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {isLong ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {r.direction}
                    </div>
                  )}
                  {isNeutral && (
                     <Badge variant="outline" className="text-[10px] opacity-70">
                        {r.setupType}
                     </Badge>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                      Price
                    </div>
                    <div className="text-xl sm:text-2xl font-bold tabular-nums">
                      ₹{r.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                      Cluster Width
                    </div>
                    <div className={`text-sm font-semibold tabular-nums ${r.isCluster ? 'text-indigo-400' : ''}`}>
                      {r.clusterWidthPct.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {done && results.length > 0 && (
          <p className="text-xs text-muted-foreground mt-8 text-center">
            Scan complete · {results.length} setup{results.length === 1 ? "" : "s"} found
          </p>
        )}
      </div>

      <StockDetailDialog
        result={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </main>
  );
}
