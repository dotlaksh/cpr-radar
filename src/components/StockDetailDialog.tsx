import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Target, Layers, Activity, ShieldCheck } from "lucide-react";
import { ScanResult } from "@/types/scanner";
import { Badge } from "./ui/badge";

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
  
  const fmt = (v: number) => v.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 border-none bg-background/80 backdrop-blur-2xl sm:rounded-[2.5rem] overflow-hidden focus:outline-none">
        <DialogDescription className="sr-only">
          Detailed technical analysis for {result.symbol}.
        </DialogDescription>

        <div className="relative p-6 sm:p-8 pb-6 max-h-[90vh] overflow-y-auto scrollbar-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
             <div>
                <h2 className="text-4xl font-black tracking-tighter mb-1">{result.symbol}</h2>
                <div className="flex gap-2">
                   <Badge className="bg-primary text-white border-none rounded-lg px-2 text-[10px] uppercase font-black">
                      {result.structure}
                   </Badge>
                   {result.setupType === "A+" && (
                      <Badge className="bg-amber-500 text-black border-none rounded-lg px-2 text-[10px] uppercase font-black">
                         A+ SETUP
                      </Badge>
                   )}
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">CMP</p>
                <p className="text-3xl font-black tabular-nums tracking-tight">₹{fmt(result.price)}</p>
             </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
             <div className="glass-card rounded-[1.5rem] p-5 text-center">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Direction</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isLong ? 'bg-emerald-500/10 text-emerald-400' : 'bg-destructive/10 text-destructive'
                }`}>
                   {isLong ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                   {result.direction}
                </div>
             </div>
             <div className="glass-card rounded-[1.5rem] p-5 text-center">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Orientation</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5">
                   <Activity className="w-3 h-3 text-primary" />
                   {result.pricePosition}
                </div>
             </div>
          </div>

          {/* Relationship Matrix Section */}
          <section className="mb-8">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-4 flex items-center gap-2 px-1">
               <Layers className="w-3 h-3" /> Relationship Matrix
            </h3>
            <div className="space-y-2">
              {result.relationships.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 glass-card rounded-2xl group transition-all active:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Target className="w-4.5 h-4.5 text-primary/60" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-tight">{r.pair}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{r.tightness}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`border-none rounded-lg text-[9px] font-black uppercase tracking-widest py-1 px-3 ${
                    r.relation === 'Overlap' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-muted-foreground'
                  }`}>
                    {r.relation}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Cluster Precision Footer */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-4 flex items-center gap-2 px-1">
               <ShieldCheck className="w-3 h-3" /> Precision Metrics
            </h3>
            <div className="p-6 glass-card rounded-[2rem] flex items-center justify-between border-primary/20 bg-primary/5">
               <div>
                  <p className="text-sm font-black mb-1">Cluster Width</p>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-tight">Multi-TF Structural Coiling</p>
               </div>
               <div className="text-right">
                  <p className="text-3xl font-black text-primary tracking-tighter tabular-nums">{result.clusterWidthPct.toFixed(2)}%</p>
                  <p className="text-[9px] font-black uppercase text-primary/60 tracking-widest">Cohesion Index</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </Dialog>
  );
}
