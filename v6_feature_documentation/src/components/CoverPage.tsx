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
   Hero graphic: Virima right-side brand mark
   — radial-gradient arc "C" swept in from right edge
   — 13 pre-laid hexagons across left + lower field
   — isometric cube centred in the arc's inner void
   viewBox: 636 × 533   preserveAspectRatio: xMaxYMid meet
───────────────────────────────────────────────────────────── */
function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 636 533"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMid meet"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Arc — closed "C" path with radial gradient; extends beyond viewBox
           on the right so the SVG naturally clips it into the crescent. */}
      <path
        d="M812.952 257.755C812.952 257.755 734.789 381.317 613.038 458.306C491.287 535.296 397.468 532.733 397.468 532.733V435.466C397.468 435.466 561.229 410.731 561.229 257.755C561.229 104.78 405.352 103.331 405.352 103.331L403.55 1.27334C403.55 1.27334 491.174 -14.3251 625.539 63.6669C705.487 109.303 770.529 176.661 812.952 257.755Z"
        fill="url(#hero-arc-gradient)"
      />

      {/* Hexagon constellation (13 hexes, all #55BA63) */}
      <path d="M380.794 513.458V488.389L358.832 475.799L336.982 488.389V513.458L358.832 525.937L380.794 513.458Z" fill="#55BA63" />
      <path d="M286.19 510.563V491.177L269.183 481.483L252.176 491.177V510.563L269.183 520.257L286.19 510.563Z" fill="#55BA63" />
      <path d="M358.83 448.504V397.252L314.004 371.626L269.178 397.252V448.504L314.004 474.129L358.83 448.504Z" fill="#55BA63" />
      <path d="M247.448 436.137V409.62L224.247 396.361L201.046 409.62V436.137L224.247 449.396L247.448 436.137Z" fill="#55BA63" />
      <path d="M209.603 362.154V327.726L179.418 310.457L149.234 327.726V362.154L179.418 379.424L209.603 362.154Z" fill="#55BA63" />
      <path d="M113.081 358.255V331.626L89.6541 318.256L66.3401 331.626V358.255L89.6541 371.625L113.081 358.255Z" fill="#55BA63" />
      <path d="M89.6519 292.631V241.379L44.8259 215.754L0 241.379V292.631L44.8259 318.257L89.6519 292.631Z" fill="#55BA63" />
      <path d="M247.448 280.263V253.746L224.247 240.487L201.046 253.746V280.263L224.247 293.522L247.448 280.263Z" fill="#55BA63" />
      <path d="M115.67 200.378V173.972L92.4688 160.713L69.2674 173.972V200.378L92.4688 213.748L115.67 200.378Z" fill="#55BA63" />
      <path d="M214.332 208.954V169.067L179.417 149.123L144.503 169.067V208.954L179.417 228.898L214.332 208.954Z" fill="#55BA63" />
      <path d="M247.673 124.39V97.6496L224.246 84.2795L200.932 97.6496V124.39L224.246 137.76L247.673 124.39Z" fill="#55BA63" />
      <path d="M335.971 121.939V96.8697L314.009 84.2795L292.046 96.8697V121.939L314.009 134.529L335.971 121.939Z" fill="#55BA63" />
      <path d="M380.798 49.184V16.9845L352.641 0.828979L324.484 16.9845V49.184L352.641 65.2281L380.798 49.184Z" fill="#55BA63" />

      {/* Isometric cube — right, top, left faces */}
      <path d="M409.182 349.23L483.404 305.443L482.391 219.986L409.52 262.882L409.182 349.23Z" fill="#7DC242" />
      <path d="M409.516 262.882L482.386 219.987L406.813 178.205L332.591 221.992L409.516 262.882Z" fill="#CBDB2A" />
      <path d="M332.591 221.993L333.605 307.45L409.178 349.231L409.516 262.883L332.591 221.993Z" fill="#A4D178" />

      <defs>
        <radialGradient
          id="hero-arc-gradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-14421.7 -20556.9) rotate(180) scale(28483.6 28436.2)"
        >
          <stop offset="0.05" stopColor="#B9D877" />
          <stop offset="1" stopColor="#32B44A" />
        </radialGradient>
      </defs>
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
        <HeroGraphic />
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
          <HeroGraphic />
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
