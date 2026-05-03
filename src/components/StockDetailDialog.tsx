import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X, ArrowUpRight, ArrowDownRight, Target, Zap, Layers, Activity, ShieldCheck } from "lucide-react";
import { ScanResult, CPRLevels } from "@/types/scanner";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

const fmt = (n: number) => `₹${n.toFixed(2)}`;

export function StockDetailDialog({
  result,
  open,
  onOpenChange,
}: {
  result: ScanResult | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  if (!result) return null;
  const isLong = result.direction === "LONG";
  const isShort = result.direction === "SHORT";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0 sm:rounded-2xl">
        {/* Hero */}
        <div className="relative p-5 sm:p-6 border-b overflow-hidden">
          <div
            className={`absolute inset-0 opacity-20 ${
              isLong ? "gradient-long" : isShort ? "gradient-short" : "bg-muted/20"
            }`}
          />
          <div className="relative">
            <DialogHeader className="space-y-0 mb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-xl sm:text-2xl font-bold truncate">
                    {result.symbol}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Deep structural analysis and multi-timeframe confluence for {result.symbol}.
                  </DialogDescription>
                  {result.setupType === "A+" && (
                    <Badge className="bg-amber-500 text-white border-none gap-1">
                      <Zap className="w-3 h-3 fill-current" /> A+ Setup
                    </Badge>
                  )}
                </div>
                {!result.direction.includes("NEUTRAL") && (
                  <div
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      isLong
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-destructive/20 text-destructive border border-destructive/30"
                    }`}
                  >
                    {isLong ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {result.direction}
                  </div>
                )}
              </div>
            </DialogHeader>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold tabular-nums">
                {fmt(result.price)}
              </span>
              <span className="text-xs text-muted-foreground">{result.trend}</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Structural Analysis Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 glass">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Structure Classification</p>
              <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                {result.structure}
              </h3>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Price Position</p>
              <Badge className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                result.pricePosition === "Inside" ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : "bg-primary/20 text-primary border-primary/30"
              }`}>
                {result.pricePosition} Cluster Zone
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             {/* Relationship Matrix */}
             <section className="space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Relationship Matrix
                </h3>
                <div className="grid gap-2">
                   {result.relationships.map((rel) => (
                      <div key={rel.pair} className="flex items-center justify-between p-3 rounded-xl border bg-card/40 text-xs">
                        <span className="text-muted-foreground font-medium">{rel.pair}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{rel.relation}</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-muted text-[9px] uppercase font-black tracking-tighter">
                            {rel.tightness}
                          </span>
                        </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* Checklist */}
             <section className="space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Confluence Checklist
                </h3>
                <div className="grid gap-2">
                  {result.checks.map((c) => (
                    <div key={c.label} className="flex items-center justify-between p-3 rounded-xl border bg-card/40">
                      <span className="text-[13px] text-muted-foreground">{c.label}</span>
                      {c.passed ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/30" />
                      )}
                    </div>
                  ))}
                </div>
             </section>
          </div>

          {/* CPR Widths & Levels */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Multi-Timeframe Pivot Detail
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Monthly", levels: result.monthly },
                { title: "Quarterly", levels: result.quarterly },
                { title: "Yearly", levels: result.yearly }
              ].map((tf) => (
                <div key={tf.title} className="rounded-xl border bg-card/40 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                      {tf.title}
                    </h4>
                    <Badge variant="outline" className={`text-[9px] py-0 px-1.5 h-4 border-border/50 ${
                      tf.levels.label.includes("Narrow") ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : ""
                    }`}>
                      {tf.levels.label}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm tabular-nums">
                    <div className="flex justify-between text-muted-foreground">
                      <span>TC</span>
                      <span>{fmt(tf.levels.tc)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground text-base border-y border-border/10 py-1">
                      <span>PIVOT</span>
                      <span>{fmt(tf.levels.pivot)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>BC</span>
                      <span>{fmt(tf.levels.bc)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  );
}
