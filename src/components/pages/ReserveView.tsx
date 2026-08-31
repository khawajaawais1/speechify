"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CalendarCheck, Check, Phone, Users } from "lucide-react";
import { PageHero } from "../PageHero";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useLocale, useT } from "@/lib/useLocale";
import { HERO_ART, PHOTOS, SITE } from "@/data/site";

const field =
  "w-full rounded-2xl border border-line bg-card px-4 py-3.5 text-[0.88rem] text-ink shadow-card placeholder:text-faint focus:border-crimson-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-500";

/** Local YYYY-MM-DD. `toISOString()` is UTC and rolls the date over in Finland. */
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

export function ReserveView() {
  const t = useT();
  const locale = useLocale();
  const [sent, setSent] = useState(false);
  // Lazy initial state: computed once on the client, so it cannot drift and
  // cannot trigger a hydration mismatch by running during render on the server.
  const [minDate] = useState(todayISO);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", guests: "2", date: "", time: "18:00", message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mailto = () => {
    const subject = encodeURIComponent(
      `${t("reserve.subject")} — ${form.name} — ${form.date} ${form.time}`,
    );
    const body = encodeURIComponent(
      [
        `${t("form.name")}: ${form.name}`,
        `${t("form.phone")}: ${form.phone}`,
        `${t("form.email")}: ${form.email}`,
        `${t("form.guests")}: ${form.guests}`,
        `${t("form.date")}: ${form.date}`,
        `${t("form.time")}: ${form.time}`,
        "",
        form.message,
      ].join("\n"),
    );
    return `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <PageHero eyebrow={t("nav.reserve")} title={t("reserve.title")} sub={t("reserve.sub")} image={HERO_ART.reservations} />

      <div className="mx-auto grid max-w-[88rem] gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); window.location.href = mailto(); }}
          className="stagger-in rounded-[2rem] border border-line bg-card p-7 shadow-lift sm:p-9"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">{t("form.name")}</span>
              <input required value={form.name} onChange={set("name")} className={field} placeholder="Matti Meikäläinen" />
            </label>
            <label>
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">{t("form.phone")}</span>
              <input required type="tel" value={form.phone} onChange={set("phone")} className={field} placeholder="+358 …" />
            </label>
            <label>
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">{t("form.email")}</span>
              <input required type="email" value={form.email} onChange={set("email")} className={field} placeholder="you@example.com" />
            </label>
            <label>
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">{t("form.date")}</span>
              {/* Without `min` the picker happily accepts last Tuesday. */}
              <input required type="date" min={minDate} value={form.date} onChange={set("date")} className={field} />
            </label>
            <label>
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">{t("form.time")}</span>
              {/* Bounded to service hours: the kitchen closes at 21:00 and the
                  last sitting is 20:30, so a 02:00 booking is not a booking. */}
              <input required type="time" min="10:30" max="20:30" step={900}
                value={form.time} onChange={set("time")} className={field} />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">{t("form.guests")}</span>
              <div className="flex flex-wrap gap-2">
                {["1", "2", "3", "4", "5", "6", "8", "10+"].map((g) => (
                  <button
                    key={g} type="button"
                    onClick={() => setForm((f) => ({ ...f, guests: g }))}
                    className={`h-11 min-w-11 rounded-full border px-4 text-[0.82rem] font-semibold transition-colors ${
                      form.guests === g
                        ? "border-crimson-500 bg-crimson-500 text-white shadow-glow-red"
                        : "border-line bg-card text-ink-soft hover:border-crimson-500/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-widest text-faint">{t("form.message")}</span>
              <textarea rows={3} value={form.message} onChange={set("message")} className={`${field} resize-none`}
                placeholder={t("reserve.messagePlaceholder")} />
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit"
            className="relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 text-sm font-bold text-white"
          >
            <span className="absolute inset-0 bg-[linear-gradient(100deg,#ffb63f,#f5a524_42%,#e4572e)]" />
            <span className="relative flex items-center gap-2">
              {sent ? <Check className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />}
              {sent ? t("form.sent") : t("form.send")}
            </span>
          </motion.button>
          {/* The form hands off to the customer's mail client, which may not
              exist — plenty of phones have no mail app configured. Saying
              "Thanks, we'll confirm shortly" in that case is a lie that costs
              the restaurant a booking, so once submitted we say what actually
              happened and give a phone number that always works. */}
          {sent && (
            <p
              role="status"
              className="mt-4 rounded-2xl border border-saffron-300 bg-saffron-100 px-4 py-3 text-center text-[0.76rem] leading-relaxed text-ink-soft"
            >
              {t("form.sentHelp", { phone: SITE.phone })}
            </p>
          )}
          <p className="mt-3 text-center text-[0.7rem] text-faint">
            {t("reserve.confirmNote")}
          </p>
        </form>

        <div className="space-y-5">
          <Photo src={PHOTOS.interior1} alt="" className="aspect-[4/3] w-full rounded-[2rem] border-4 border-white shadow-lift" sizes="(max-width:1024px) 92vw, 40vw" />
          <Reveal>
            <div className="rounded-[2rem] border border-line bg-card p-7 shadow-card">
              <p className="eyebrow flex items-center gap-2"><Users className="h-3.5 w-3.5" />{t("reserve.groupsTitle")}</p>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft">
                {t("reserve.groupsBody")}
              </p>
              <a href={SITE.phoneHref} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-crimson-600">
                <Phone className="h-4 w-4" />{SITE.phone}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-line bg-card p-7 shadow-card">
              <p className="eyebrow">{t("hours.kitchen")}</p>
              <ul className="mt-4 space-y-2.5 text-[0.86rem] text-muted">
                {SITE.hours.kitchen.map((h) => (
                  <li key={h.t} className="flex justify-between gap-4">
                    <span>{h.d[locale]}</span><span className="tabular-nums text-ink-soft">{h.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
