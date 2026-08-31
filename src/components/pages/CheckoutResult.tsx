"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Btn } from "../Button";
import { useCart } from "@/lib/cart";
import { useLocale, useT } from "@/lib/useLocale";
import { SITE } from "@/data/site";

export function CheckoutResult({ kind }: { kind: "success" | "cancel" }) {
  const t = useT();
  const locale = useLocale();
  const { clear, setOpen } = useCart();
  const ok = kind === "success";

  useEffect(() => { if (ok) clear(); }, [ok, clear]);

  return (
    <section className="wash relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-[var(--nav-h)]">
      <div className="stagger-in relative w-full max-w-lg rounded-[2.5rem] border border-line bg-card px-8 py-14 text-center shadow-lift">
        <div
          className={`pop mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
            ok ? "bg-cardamom-100 text-cardamom-500" : "bg-ember-100 text-ember-500"
          }`}
        >
          {ok ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
        </div>

        <h1 className="display-md mt-7 text-ink">{ok ? t("success.title") : t("cancel.title")}</h1>
        <p className="mx-auto mt-4 max-w-sm text-[0.92rem] leading-relaxed text-muted">
          {ok ? t("success.sub") : t("cancel.sub")}
        </p>

        {ok && (
          <p className="mt-6 rounded-2xl border border-line bg-canvas-2 px-5 py-4 text-[0.82rem] text-ink-soft">
            {t("checkout.etaLine", { min: SITE.order.etaMinutes, phone: SITE.phone })}
          </p>
        )}

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {ok ? (
            <Btn href={`/${locale}`}>{t("success.back")}</Btn>
          ) : (
            <>
              <Btn href={`/${locale}/shop`}>{t("nav.shop")}</Btn>
              <button
                onClick={() => setOpen(true)}
                className="rounded-full border border-line-strong bg-card px-7 py-3.5 text-sm font-semibold text-ink shadow-card transition-colors hover:border-crimson-500 hover:text-crimson-600"
              >
                {t("cancel.back")}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
