import { Candle } from "../types/scanner";

export function aggregate(candles: Candle[], keyFn: (d: Date) => string): Candle[] {
  const map = new Map<string, Candle>();
  const order: string[] = [];
  for (const c of candles) {
    const k = keyFn(new Date(c.t));
    const existing = map.get(k);
    if (!existing) {
      map.set(k, { ...c });
      order.push(k);
    } else {
      existing.h = Math.max(existing.h, c.h);
      existing.l = Math.min(existing.l, c.l);
      existing.c = c.c;
    }
  }
  return order.map((k) => map.get(k)!);
}

export const monthlyKey = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
export const quarterlyKey = (d: Date) =>
  `${d.getUTCFullYear()}-Q${Math.floor(d.getUTCMonth() / 3)}`;
export const yearlyKey = (d: Date) => `${d.getUTCFullYear()}`;

export function cpr(c: Candle) {
  const pivot = (c.h + c.l + c.c) / 3;
  const bc = (c.h + c.l) / 2;
  const tc = pivot * 2 - bc;
  const top = Math.max(tc, bc);
  const bot = Math.min(tc, bc);
  return { pivot, tc: top, bc: bot, width: top - bot };
}

export function ema(values: number[], period: number): number {
  if (values.length === 0) return NaN;
  const k = 2 / (period + 1);
  let e = values[0];
  for (let i = 1; i < values.length; i++) e = values[i] * k + e * (1 - k);
  return e;
}
