import { useState, useEffect, useRef } from "react";
import { UniverseConfig, ScanResult } from "@/types/scanner";
import { fetchMarketData, evaluate } from "@/lib/scanner";

export function useScanner(universe: UniverseConfig | undefined) {
  const [scanned, setScanned] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!universe || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    const found: ScanResult[] = [];
    const concurrency = 5;
    const symbols = universe.symbols.map((s) => s.Symbol);
    let idx = 0;

    const runScan = async () => {
      async function worker() {
        while (!cancelled) {
          const i = idx++;
          if (i >= symbols.length) return;
          const sym = symbols[i];
          const candles = await fetchMarketData(sym);
          if (candles && !cancelled) {
            const r = evaluate(sym, candles);
            if (r) {
              found.push(r);
              setResults([...found]);
            }
          }
          if (!cancelled) setScanned((n) => n + 1);
        }
      }
      await Promise.all(Array.from({ length: concurrency }, worker));
      if (!cancelled) setDone(true);
    };

    runScan();

    return () => {
      cancelled = true;
    };
  }, [universe]);

  return { scanned, results, done };
}
