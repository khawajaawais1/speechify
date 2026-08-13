"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Magnetic } from "./Magnetic";

type Variant = "gold" | "ghost" | "solid";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 will-change-transform";

const styles: Record<Variant, string> = {
  gold: "text-white",
  ghost: "text-ink border border-line-strong bg-card hover:border-crimson-500/60 hover:text-crimson-500 hover:shadow-card",
  solid: "bg-card text-ink border border-line hover:bg-sand shadow-card",
};

function Inner({ children, variant }: { children: React.ReactNode; variant: Variant }) {
  return (
    <>
      {variant === "gold" && (
        <>
          <span className="absolute inset-0 rounded-full bg-[linear-gradient(100deg,#ffb63f,#f5a524_42%,#e4572e)]" />
          <span className="absolute inset-0 rounded-full opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60 bg-[linear-gradient(100deg,#ffb63f,#f5a524_42%,#e4572e)]" />
          <span className="absolute inset-x-6 -bottom-px h-px bg-white/60" />
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );
}

export function Btn({
  href, children, variant = "gold", className = "", magnetic = true, ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const el = (
    <motion.span whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...rest}>
        <Inner variant={variant}>{children}</Inner>
      </Link>
    </motion.span>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function BtnAction({
  children, variant = "gold", className = "", magnetic = false, ...rest
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const el = (
    <motion.button
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles[variant]} ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      <Inner variant={variant}>{children}</Inner>
    </motion.button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
