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

  const pct = total ? (scanned / total) * 100 : 0;
  const filters: Filter[] = ["ALL", "A+", "HQ_CLUSTER", "CLUSTER", "WATCHLIST"];

  return (
    <main className="min-h-screen bg-background pb-32">
      {/* Dynamic Mobile Header */}
      <nav className="sticky top-0 z-40 glass border-b border-white/5 pt-6 pb-3">
        <div className="container px-4 flex items-center justify-between gap-4 mb-3">
          <Link to="/" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-sm font-bold tracking-tight truncate px-4">{universe?.name}</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
              {done ? `${results.length} Found` : `Scanning...`}
            </p>
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
             {!done && <Activity className="w-4 h-4 text-primary animate-pulse" />}
          </div>
        </div>
        {!done && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </nav>

      {/* Filter Chips - Horizontal Scroll */}
      <div className="sticky top-[69px] z-20 glass border-b border-white/5 py-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 px-4 min-w-max">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold tracking-tight transition-all border ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
              }`}
            >
              {f.replace("_", " ")}
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                filter === f ? 'bg-black/20' : 'bg-white/10'
              }`}>
                {counts[f as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const isLong = r.direction === "LONG";
            const isShort = r.direction === "SHORT";
            const isNeutral = r.direction === "NEUTRAL";

            return (
              <Card
                key={r.symbol}
                onClick={() => setSelected(r)}
                className="group relative p-5 glass-card active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{r.symbol}</h3>
                    <div className="flex gap-1.5 mt-1">
                      <Badge variant="outline" className="text-[9px] py-0 px-2 h-5 bg-primary/5 border-primary/20 text-primary">
                        {r.structure}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] py-0 px-2 h-5 bg-sky-500/5 border-sky-500/20 text-sky-400">
                        {r.pricePosition}
                      </Badge>
                    </div>
                  </div>
                  {!isNeutral && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isLong ? 'bg-emerald-500/10 text-emerald-400' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {isLong ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                   <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">CMP</p>
                      <p className="text-lg font-bold tabular-nums">₹{r.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Cluster Width</p>
                      <p className={`text-lg font-bold tabular-nums ${r.isCluster ? 'text-primary' : ''}`}>
                        {r.clusterWidthPct.toFixed(2)}%
                      </p>
                   </div>
                </div>
              </Card>
            );
          })}
        </div>

        {done && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <SearchX className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium">No setups in this universe</p>
          </div>
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
