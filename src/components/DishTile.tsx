import {
  Beef,
  CookingPot,
  CupSoda,
  Drumstick,
  Leaf,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  Wheat,
} from "lucide-react";
import type { CategoryId } from "@/data/products";

/**
 * Shown in place of a photo for dishes we do not have a real picture of.
 *
 * The alternative was leaving a photo of a *different* dish on the card, which
 * is worse than showing none: a customer orders expecting what they saw. A
 * branded tile reads as deliberate, keeps the grid rhythm, and doubles as a
 * checklist — anything showing a tile still needs photographing.
 *
 * Pure CSS and an icon: no image request, nothing to download.
 */

const LOOK: Record<CategoryId, { icon: typeof Utensils; grad: string }> = {
  deals:             { icon: Utensils,   grad: "from-crimson-400 via-crimson-500 to-crimson-700" },
  "indian-mains":    { icon: Soup,       grad: "from-saffron-400 via-ember-500 to-crimson-600" },
  biryani:           { icon: Wheat,      grad: "from-gold-300 via-saffron-500 to-ember-600" },
  "indian-starters": { icon: Drumstick,  grad: "from-saffron-300 via-saffron-500 to-ember-500" },
  pizza:             { icon: Pizza,      grad: "from-ember-400 via-crimson-500 to-crimson-700" },
  "vegan-pizza":     { icon: Leaf,       grad: "from-cardamom-400 via-cardamom-500 to-cardamom-600" },
  kebab:             { icon: Beef,       grad: "from-ember-400 via-ember-500 to-crimson-600" },
  voner:             { icon: Sandwich,   grad: "from-cardamom-400 via-cardamom-500 to-gold-600" },
  falafel:           { icon: CookingPot, grad: "from-gold-400 via-saffron-600 to-ember-600" },
  salads:            { icon: Salad,      grad: "from-cardamom-400 via-cardamom-500 to-gold-500" },
  drinks:            { icon: CupSoda,    grad: "from-gold-300 via-saffron-400 to-saffron-600" },
};

export function DishTile({ cat, className = "" }: { cat: CategoryId; className?: string }) {
  const { icon: Icon, grad } = LOOK[cat] ?? LOOK.deals;
  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${grad} ${className}`}
    >
      {/* the same jali lattice used across the site, at low contrast */}
      <span
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='124' viewBox='0 0 72 124'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1.4'%3E%3Cpath d='M36 4c17.7 0 32 14.3 32 32v52c0 17.7-14.3 32-32 32S4 105.7 4 88V36C4 18.3 18.3 4 36 4Z'/%3E%3Cpath d='M36 24c8.8 0 16 7.2 16 16v44c0 8.8-7.2 16-16 16s-16-7.2-16-16V40c0-8.8 7.2-16 16-16Z'/%3E%3Ccircle cx='36' cy='62' r='4'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "58px 100px",
        }}
      />
      <span className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_35%,rgba(255,255,255,.22),transparent)]" />
      <Icon className="relative h-11 w-11 text-white/85" strokeWidth={1.4} />
    </div>
  );
}
