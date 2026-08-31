import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { Stats } from "@/components/home/Stats";
import { FireStory } from "@/components/home/FireStory";
import { Signature } from "@/components/home/Signature";
import { Categories } from "@/components/home/Categories";
import { Buffet } from "@/components/home/Buffet";
import { Story } from "@/components/home/Story";
import { Reviews } from "@/components/home/Reviews";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { OrderPerks } from "@/components/home/OrderPerks";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Stats />
      {/* Not inside a `defer` wrapper — content-visibility and overflow
          clipping both break the pinned stage inside. */}
      <FireStory />
      {/* `defer` lets the browser skip layout + paint for these until they
          approach the viewport — the main scroll-performance win. */}
      <div className="defer"><Signature /></div>
      <div className="defer"><Categories /></div>
      <div className="defer"><Buffet /></div>
      <div className="defer"><Story /></div>
      <div className="defer"><Reviews /></div>
      <div className="defer"><GalleryStrip /></div>
      <div className="defer"><OrderPerks /></div>
      <div className="defer"><FinalCTA /></div>
    </>
  );
}
