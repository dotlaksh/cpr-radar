import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { TrendingUp, Activity, Layers, ArrowRight } from "lucide-react";
import nifty100 from "@/data/nifty100.json";
import midcap150 from "@/data/niftyMidcap150.json";
import smallcap250 from "@/data/niftySmallcap250.json";
import microcap250 from "@/data/niftyMicrocap250.json";


import { StockSymbol } from "@/types/scanner";

const universes = [
  {
    id: "nifty100",
    name: "LARGECAP 100",
    desc: "Large-cap leaders",
    icon: TrendingUp,
    count: ((nifty100 as unknown) as StockSymbol[]).length,
  },
  {
    id: "midcap150",
    name: "MIDCAP 150",
    desc: "Mid-cap universe",
    icon: Activity,
    count: ((midcap150 as unknown) as StockSymbol[]).length,
  },
  {
    id: "smallcap250",
    name: "SMALLCAP 250",
    desc: "Small-cap universe",
    icon: Layers,
    count: ((smallcap250 as unknown) as StockSymbol[]).length,
  },
  {
    id: "microcap250",
    name: "MICROCAP 250",
    desc: "Micro-cap universe",
    icon: Layers,
    count: ((microcap250 as unknown) as StockSymbol[]).length,
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="container max-w-4xl relative z-10">
        <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border text-[10px] uppercase tracking-widest font-bold text-primary mb-6">
            <Activity className="w-3 h-3 animate-pulse" /> Live Analysis Engine
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            CPR RADAR
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
            Institutional-grade multi-timeframe confluence radar for high-conviction positional trades.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
          {universes.map((u, i) => {
            const Icon = u.icon;
            return (
              <Card
                key={u.id}
                onClick={() => navigate(`/scan/${u.id}`)}
                className="group relative p-6 cursor-pointer glass-card hover:bg-white/[0.06] hover:border-primary/40 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-black tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                    {u.count} SYMBOLS
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform">{u.name}</h2>
                  <p className="text-xs text-muted-foreground line-clamp-1">{u.desc}</p>
                </div>

                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </Card>
            );
          })}
        </div>

        <footer className="mt-16 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">
          Market Intelligence v2.0
        </footer>
      </div>
    </main>
  );
}
