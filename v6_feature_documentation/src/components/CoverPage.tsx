import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Command, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { animationConfig, homePageText } from "./homePageConfig";
import { useTheme } from "../lib/theme/theme-provider";

interface CoverPageProps {
  onModuleSelect: (module: string) => void;
  onSearchDialogOpen: () => void;
}

/* ─────────────────────────────────────────────────────────────
   Pointy-top hexagon helper
───────────────────────────────────────────────────────────── */
function hex(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/* ─────────────────────────────────────────────────────────────
   Hero graphic: brand-faithful Virima right-side mark
   — thick green arc ring anchored to right edge
   — 13 point-top hexagons per placement appendix
   — clean isometric cube in the inner void
   viewBox: 466 × 471   preserveAspectRatio: xMaxYMid meet
───────────────────────────────────────────────────────────── */
function HeroGraphic({ bgColor }: { bgColor: string }) {
  /*
   * Reference: Virima brand mark — "100% correct" SVG provided by user.
   *
   * Key characteristics from reference:
   *  • TWO very large hexes at the far left that PARTIALLY CLIP at viewBox x=0
   *    (their centres sit at small positive x; their left vertices are negative,
   *    so the SVG clips them — producing the "large partial hex" visual at left edge)
   *  • Hexes graduate from large (left) → medium → small/tiny (toward arc)
   *  • A small hex sits near the arc's top opening (upper-right of hex field)
   *  • Three distinct bands: upper fan, mid band, lower cluster + bottom row
   *
   * Arc geometry: cx=466 (right edge), cy=235 (vertical mid), R_outer=220, R_inner=165
   * Pointy-top hex: leftmost x = cx − 0.866r
   * All verified: dist(cx,cy → 466,235) − r > 220
   *
   * #   (cx,   cy,   r)   leftmost-x   dist−r
   * ────────────────────────────────────────────
   *  1  ( 22,  228,  62)    −32 CLIP    383
   *  2  ( 20,  138,  50)    −23 CLIP    406
   *  3  ( 88,  162,  32)     60          353
   *  4  (148,  128,  26)    125          309
   *  5  (200,   90,  20)    183          284
   *  6  (228,   58,  16)    214          283
   *  7  (205,   32,  14)    193          320
   *  8  ( 88,  250,  32)     61          344
   *  9  (148,  268,  27)    125          291
   * 10  (200,  250,  20)    183          251
   * 11  ( 95,  355,  32)     68          351
   * 12  (155,  385,  38)    122          301
   * 13  (205,  362,  24)    184          264
   * 14  (158,  442,  24)    137          346
   * 15  (210,  456,  17)    195          320
   * 16  (242,  432,  14)    230          284
   */
  const hexes: [number, number, number][] = [
    // ── PARTIAL large anchors — left edge clip
    [ 22,  228,  62],  //  1. Huge — mid-height, partially clipped (leftmost x = -32)
    [ 20,  138,  50],  //  2. Large — upper-left, partially clipped (leftmost x = -23)
    // ── Upper fan — medium → tiny, fanning right toward arc
    [ 88,  162,  32],  //  3. medium
    [148,  128,  26],  //  4. medium-small
    [200,   90,  20],  //  5. small
    [228,   58,  16],  //  6. small — near arc's top opening
    [205,   32,  14],  //  7. tiny — top of field
    // ── Mid band
    [ 88,  250,  32],  //  8. medium
    [148,  268,  27],  //  9. medium
    [180,  248,  18],  // 10. small  (moved left: dist=286, 286−18=268>250 ✓)
    // ── Lower cluster
    [ 95,  355,  32],  // 11. medium
    [155,  385,  38],  // 12. medium-large (lower centrepiece)
    [205,  362,  24],  // 13. medium
    // ── Bottom row
    [158,  442,  24],  // 14. medium
    [210,  456,  17],  // 15. small
    [242,  432,  14],  // 16. small
  ];

  return (
    <svg
      viewBox="0 0 466 471"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMid meet"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/*
       * Z-ORDER (back → front):
       *   1. Arc ring  — thick green "C" band, cx=466 (right edge), cy=235
       *                  R_outer=250 intentionally EXCEEDS viewBox top (y=-15) and
       *                  bottom (y=485) so the SVG clips it → natural "C" opening LEFT
       *   2. Hexagons  — drawn OVER the arc
       *   3. Void      — inner cream circle punches through arc + hides hex overlap
       *   4. Cube      — isometric cube inside the void
       *
       * Arc geometry (cx=466, cy=235):
       *   R_outer=250  left edge x=216 at mid-height  top y=-15 (CLIPPED) bottom y=485 (CLIPPED)
       *   R_inner=190  left edge x=276 at mid-height
       *   Band = 60 units
       *
       * All hex verified: dist(cx,cy → 466,235) − r > 250
       * All cube vertices verified inside R_inner=190
       */}

      {/* ── Group A: Main green arc ring — C-shape, clips at viewBox edges ── */}
      <circle cx="466" cy="235" r="250" fill="#41B84F" />

      {/* ── Group D: Hexagon constellation ───────────────────── */}
      {hexes.map(([cx, cy, r], i) => (
        <polygon key={i} points={hex(cx, cy, r)} fill="#55BA63" />
      ))}

      {/* ── Group B: Inner void ───────────────────────────────── */}
      <circle cx="466" cy="235" r="190" fill={bgColor} />

      {/* ── Group C: Isometric cube — centred inside the void ─── */}
      {/* top face  — lime / yellow-green                          */}
      <polygon points="310,226 355,200 400,226 355,252" fill="#CBDB2A" />
      {/* left face — soft green                                   */}
      <polygon points="310,226 355,252 355,312 310,286" fill="#A4D178" />
      {/* right face — medium green                                */}
      <polygon points="355,252 400,226 400,286 355,312" fill="#7DC242" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   CoverPage
───────────────────────────────────────────────────────────── */
export function CoverPage({ onModuleSelect, onSearchDialogOpen }: CoverPageProps) {
  const [animKey, setAnimKey] = useState(0);
  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";

  useEffect(() => { setAnimKey(k => k + 1); }, []);

  /* Design tokens */
  const bg          = isDark ? "#0a0a0a"  : "#f0ede8";
  const headingClr  = isDark ? "#ffffff"  : "#111827";
  const subClr      = isDark ? "#94a3b8"  : "#4b5563";
  const scrollClr   = isDark ? "#475569"  : "#9ca3af";
  const badgeNewBg  = "#22c55e";
  const badgeText   = isDark ? "#bbf7d0"  : "#166534";

  /* Reuse animationConfig from homePageConfig for consistency */
  const fadeUp = (delay: number, duration = 0.75) => ({
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease: animationConfig.title.ease },
  });

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: bg, minHeight: "100svh" }}
    >
      {/* ── Desktop graphic — absolute right panel ─────────── */}
      <motion.div
        key={`graphic-${animKey}`}
        className="hidden lg:block absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{ width: "56%" }}
        initial={{ opacity: 0, x: 56 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: animationConfig.search.delay,
          duration: animationConfig.tagline.duration,
          ease: animationConfig.title.ease,
        }}
      >
        <HeroGraphic bgColor={bg} />
      </motion.div>

      {/* ── Main content column ────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col justify-center min-h-[100svh]
                   px-8 sm:px-12 lg:pl-[7rem] lg:pr-8
                   lg:max-w-[52%]
                   py-20 lg:py-0"
      >

        {/* 1 — Badge */}
        <motion.div
          key={`badge-${animKey}`}
          {...fadeUp(animationConfig.title.delay)}
          className="flex items-center gap-2 mb-6"
        >
          <span
            className="text-xs font-extrabold px-2.5 py-1 rounded-full tracking-wider"
            style={{ background: badgeNewBg, color: "#fff" }}
          >
            NEW
          </span>
          <span className="text-sm font-medium" style={{ color: badgeText, fontFamily: "'DM Sans', sans-serif" }}>
            Version 6.1 is live - explore what's new
          </span>
        </motion.div>

        {/* 2 — Headline */}
        <motion.h1
          key={`title-${animKey}`}
          {...fadeUp(animationConfig.tagline.delay)}
          className="font-bold leading-[1.08] tracking-tight mb-5"
          style={{
            color: headingClr,
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Welcome to<br />
          VIRIMA Documentation<br className="hidden sm:block" /> Platform
        </motion.h1>

        {/* 3 — Description */}
        <motion.p
          key={`desc-${animKey}`}
          {...fadeUp(animationConfig.description.delay)}
          className="leading-relaxed mb-8"
          style={{
            color: subClr,
            fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
            maxWidth: "32rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {homePageText.description}
        </motion.p>

        {/* 4 — Search bar (existing component, repositioned here) */}
        <motion.div
          key={`search-${animKey}`}
          {...fadeUp(animationConfig.search.delay, animationConfig.search.duration)}
          className="mb-5"
          style={{ maxWidth: '26rem' }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={onSearchDialogOpen}
            className="w-full flex items-center gap-2 justify-start
                       text-slate-700 dark:text-slate-300
                       bg-white dark:bg-black/90 backdrop-blur-sm
                       hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30
                       border-2 border-slate-200 dark:border-[#1a1a1a]
                       hover:border-emerald-400 dark:hover:border-emerald-500
                       h-12 px-4 text-sm
                       transition-all duration-300
                       shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25
                       group"
          >
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors duration-300">
              {homePageText.searchPlaceholder}
            </span>
            <div className="ml-auto h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-all duration-300">
              <Command className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
            </div>
          </Button>
        </motion.div>

        {/* 5 — Get Started CTA (existing button, reused) */}
        <motion.div
          key={`btn-${animKey}`}
          {...fadeUp(animationConfig.button.delay, animationConfig.button.duration)}
          className="flex"
        >
          <Button
            size="lg"
            onClick={() => onModuleSelect("my-dashboard")}
            className="relative bg-gradient-to-r from-green-600 to-green-500
                       hover:from-green-700 hover:to-green-600
                       text-white px-8 sm:px-10 py-5 sm:py-6
                       text-sm sm:text-base font-semibold
                       shadow-2xl shadow-green-500/40 hover:shadow-green-500/50
                       transition-all duration-300 hover:scale-105
                       group overflow-hidden border-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative">{homePageText.getStartedButton}</span>
            <ArrowRight className="relative ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>

        {/* Mobile-only graphic — shown below text on small screens */}
        <motion.div
          key={`graphic-mob-${animKey}`}
          className="block lg:hidden mt-10 -mx-8 sm:-mx-12 h-64 sm:h-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationConfig.button.delay + 0.2, duration: 0.7 }}
        >
          <HeroGraphic bgColor={bg} />
        </motion.div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────── */}
      <motion.div
        key={`scroll-${animKey}`}
        className="absolute bottom-8 left-8 sm:left-12 lg:left-[7rem]
                   flex items-center gap-1.5 text-sm select-none z-10"
        style={{ color: scrollClr }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: animationConfig.button.delay + 0.4, duration: 0.6 }}
      >
        Scroll <ChevronDown className="h-4 w-4" />
      </motion.div>

      {/* ── Bottom fade ──────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(to top, #0a0a0a, transparent)"
            : "linear-gradient(to top, #f0ede8, transparent)",
        }}
      />
    </div>
  );
}
