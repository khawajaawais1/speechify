"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState,
} from "react";
import { PRODUCTS, effectivePrice, type Product } from "@/data/products";
import { SITE } from "@/data/site";

export type Mode = "delivery" | "pickup";
export type Line = { id: string; qty: number };
type State = { lines: Line[]; mode: Mode; note: string };

const KEY = "pasargad.cart.v1";

type Action =
  | { type: "add"; id: string; qty?: number }
  | { type: "dec"; id: string }
  | { type: "remove"; id: string }
  | { type: "qty"; id: string; qty: number }
  | { type: "mode"; mode: Mode }
  | { type: "note"; note: string }
  | { type: "clear" }
  | { type: "hydrate"; state: State };

const initial: State = { lines: [], mode: "delivery", note: "" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "hydrate":
      return a.state;
    case "add": {
      const q = a.qty ?? 1;
      const found = s.lines.find((l) => l.id === a.id);
      return found
        ? { ...s, lines: s.lines.map((l) => (l.id === a.id ? { ...l, qty: l.qty + q } : l)) }
        : { ...s, lines: [...s.lines, { id: a.id, qty: q }] };
    }
    case "dec": {
      const found = s.lines.find((l) => l.id === a.id);
      if (!found) return s;
      if (found.qty <= 1) return { ...s, lines: s.lines.filter((l) => l.id !== a.id) };
      return { ...s, lines: s.lines.map((l) => (l.id === a.id ? { ...l, qty: l.qty - 1 } : l)) };
    }
    case "qty":
      return a.qty <= 0
        ? { ...s, lines: s.lines.filter((l) => l.id !== a.id) }
        : { ...s, lines: s.lines.map((l) => (l.id === a.id ? { ...l, qty: Math.min(a.qty, 50) } : l)) };
    case "remove":
      return { ...s, lines: s.lines.filter((l) => l.id !== a.id) };
    case "mode":
      return { ...s, mode: a.mode };
    case "note":
      return { ...s, note: a.note };
    case "clear":
      return { ...initial, mode: s.mode };
    default:
      return s;
  }
}

export type DetailedLine = { product: Product; qty: number; unit: number; total: number };

type Ctx = {
  state: State;
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  minimum: number;
  meetsMinimum: boolean;
  freeDeliveryGap: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  pulse: number;
  add: (id: string, qty?: number) => void;
  dec: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  setMode: (m: Mode) => void;
  setNote: (n: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const hydrated = useRef(false);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (parsed && Array.isArray(parsed.lines)) {
          dispatch({
            type: "hydrate",
            state: {
              lines: parsed.lines.filter((l) => PRODUCTS.some((p) => p.id === l.id)),
              mode: parsed.mode === "pickup" ? "pickup" : "delivery",
              note: typeof parsed.note === "string" ? parsed.note : "",
            },
          });
        }
      }
    } catch { /* ignore */ }
    hydrated.current = true;
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  // scroll lock while drawer open
  useEffect(() => {
    document.documentElement.classList.toggle("lock", open);
    return () => document.documentElement.classList.remove("lock");
  }, [open]);

  const lines: DetailedLine[] = useMemo(
    () =>
      state.lines
        .map((l) => {
          const product = PRODUCTS.find((p) => p.id === l.id);
          if (!product) return null;
          const unit = effectivePrice(product);
          return { product, qty: l.qty, unit, total: +(unit * l.qty).toFixed(2) };
        })
        .filter(Boolean) as DetailedLine[],
    [state.lines],
  );

  const subtotal = useMemo(() => +lines.reduce((s, l) => s + l.total, 0).toFixed(2), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const o = SITE.order;
  const deliveryFee =
    state.mode === "pickup" || subtotal === 0 ? 0 : subtotal >= o.freeDeliveryOver ? 0 : o.zones[1].fee;
  const serviceFee = subtotal > 0 ? o.serviceFee : 0;
  const total = +(subtotal + deliveryFee + serviceFee).toFixed(2);
  const minimum = state.mode === "pickup" ? o.minPickup : o.minDelivery;
  const meetsMinimum = subtotal >= minimum;
  const freeDeliveryGap =
    state.mode === "delivery" && subtotal > 0 && subtotal < o.freeDeliveryOver
      ? +(o.freeDeliveryOver - subtotal).toFixed(2)
      : 0;

  const add = useCallback((id: string, qty = 1) => {
    dispatch({ type: "add", id, qty });
    setPulse((p) => p + 1);
  }, []);

  const value: Ctx = {
    state, lines, count, subtotal, deliveryFee, serviceFee, total,
    minimum, meetsMinimum, freeDeliveryGap, open, setOpen, pulse, add,
    dec: (id) => dispatch({ type: "dec", id }),
    setQty: (id, qty) => dispatch({ type: "qty", id, qty }),
    remove: (id) => dispatch({ type: "remove", id }),
    setMode: (mode) => dispatch({ type: "mode", mode }),
    setNote: (note) => dispatch({ type: "note", note }),
    clear: () => dispatch({ type: "clear" }),
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
