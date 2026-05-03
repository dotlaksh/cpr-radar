import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Check, X, Target, Layers, Activity, ShieldCheck, ChevronRight } from "lucide-react";
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

  const fmt = (v: number) => v.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 border-none bg-background text-foreground sm:rounded-[2.5rem] overflow-hidden focus:outline-none shadow-2xl">
        <DialogDescription className="sr-only">
          Detailed technical analysis for {result.symbol}.
        </DialogDescription>

        <div className="p-8 pb-10 overflow-y-auto max-h-[95vh] scrollbar-none">
          {/* Hero Header */}
          <header className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">Technical Analysis</h2>
            </div>
            <div className="flex items-baseline gap-4 mb-2">
               <DialogTitle className="text-5xl font-black tracking-tighter">{result.symbol}</DialogTitle>
               <span className="text-muted-foreground font-semibold text-base">{result.trend}</span>
            </div>
            <div className="text-6xl font-black tabular-nums tracking-tighter">
               ₹{fmt(result.price)}
            </div>
          </header>

          {/* Classification Bar */}
          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-muted/50 border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Structure Classification</p>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <Target className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-bold tracking-tight">{result.structure}</span>
                   </div>
                </div>
             </div>
             <div className="bg-muted/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-end">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Price Position</p>
                <Badge className={`rounded-full px-5 py-2 text-xs font-bold uppercase border-none ${
                   result.pricePosition === 'Above' ? 'bg-emerald-500/10 text-emerald-400' : 
                   result.pricePosition === 'Below' ? 'bg-rose-500/10 text-rose-400' : 'bg-primary/10 text-primary'
                }`}>
                   {result.pricePosition} Cluster Zone
                </Badge>
             </div>
          </div>

          {/* Core Confluence Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
             {/* Left: Relationship Matrix */}
             <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                   <Layers className="w-3.5 h-3.5 text-primary" />
                   <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Relationship Matrix</h3>
                </div>
                <div className="space-y-2">
                   {result.relationships.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/30 border border-white/5 rounded-2xl">
                         <span className="text-xs font-bold text-foreground/80">{r.pair}</span>
                         <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black uppercase tracking-wider">{r.relation}</span>
                            <Badge variant="outline" className="text-[9px] font-black uppercase bg-background border-none h-5 px-2">
                               {r.tightness}
                            </Badge>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* Right: Confluence Checklist */}
             <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                   <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                   <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Confluence Checklist</h3>
                </div>
                <div className="space-y-2">
                   {result.checks.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/30 border border-white/5 rounded-2xl">
                         <span className="text-xs font-bold text-foreground/80">{c.label}</span>
                         {c.passed ? (
                            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
                               <Check className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                         ) : (
                            <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                               <X className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             </section>
          </div>

          {/* Pivot Details */}
          <section>
             <div className="flex items-center gap-2 mb-4 px-1">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Multi-Timeframe Pivot Detail</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                   { label: 'MONTHLY', data: result.monthly },
                   { label: 'QUARTERLY', data: result.quarterly },
                   { label: 'YEARLY', data: result.yearly }
                ].map((item) => (
                   <div key={item.label} className="bg-muted/30 border border-white/5 rounded-[2rem] p-6">
                      <div className="flex items-center justify-between mb-6">
                         <span className="text-[10px] font-black tracking-widest text-muted-foreground">{item.label}</span>
                         <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase px-2 py-0.5 rounded-lg">
                            {item.data.label}
                         </Badge>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground font-bold">TC</span>
                            <span className="font-bold text-foreground/80">₹{fmt(item.data.tc)}</span>
                         </div>
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground">PIVOT</span>
                            <span className="text-2xl font-black tabular-nums tracking-tighter">₹{fmt(item.data.pivot)}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                            <span className="text-muted-foreground font-bold">BC</span>
                            <span className="font-bold text-foreground/80">₹{fmt(item.data.bc)}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </section>
        </div>

        <button 
           onClick={() => onOpenChange(false)}
           className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted/50 border border-white/5 flex items-center justify-center hover:bg-muted transition-colors focus:outline-none group"
        >
           <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </DialogContent>
    </Dialog>
  );
  );
}
