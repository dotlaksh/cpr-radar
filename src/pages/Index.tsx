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
    <main className="min-h-screen">
      <div className="container px-4 sm:px-6 py-10 sm:py-16 lg:py-20 max-w-5xl">
        <header className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
            CPR <span className="bg-gradient-to-t from-primary to-primary-glow bg-clip-text text-transparent">Radar</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto px-2 mb-12">
            Advanced multi-timeframe confluence analysis for positional traders.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {universes.map((u) => {
            const Icon = u.icon;
            return (
              <Card
                key={u.id}
                onClick={() => navigate(`/scan/${u.id}`)}
                className="group relative p-5 sm:p-6 cursor-pointer glass shadow-card hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h2 className="text-lg font-semibold mb-1">{u.name}</h2>
                <p className="text-sm text-muted-foreground mb-3">{u.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs font-medium text-muted-foreground">
                    {u.count} symbols
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Scan Now
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10 sm:mt-14">
          Tap a universe to begin a one-shot deterministic scan
        </p>
      </div>
    </main>
  );
}
