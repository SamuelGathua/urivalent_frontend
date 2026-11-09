"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const pillarScrollRef = useRef<HTMLDivElement>(null);
  const [activeSector, setActiveSector] = useState(0);
  const [isHeroIdle, setIsHeroIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const wireSectors = [
    {
      name: "Silicon & Nanotech",
      tag: "SILICON & NANOTECH",
      score: "SIGNAL 9.4",
      time: "14m ago",
      headline: "Chiplet economics move from roadmap to near-term constraint",
      excerpt: "Advanced packaging capacity and high-bandwidth memory co-design emerge as the first-order bottleneck for next-gen accelerator volume.",
      technical: "2.5D integration and hybrid bonding throughput are dictating production schedules ahead of leading-edge wafer fab allocations.",
      impact: "Premiums expand for diversified back-end supply chains. Capital expenditures shift toward dedicated packaging cleanrooms.",
      ticker: "TSM +1.05",
    },
    {
      name: "Energy & Infra",
      tag: "ENERGY & INFRA",
      score: "SIGNAL 9.2",
      time: "1h ago",
      headline: "Hyperscale baseload agreements accelerate in PJM interconnect",
      excerpt: "Dedicated nuclear and geothermal long-term power purchase agreements pass regulatory review for gigawatt-class cluster campuses.",
      technical: "Co-located microgrid generation eliminates interconnection queue delays, locking in sub-5ms latency to regional fiber backbones.",
      impact: "Power density constraints reward facilities with behind-the-meter baseload contracts over raw land acquisitions.",
      ticker: "GRID +3.40",
    },
    {
      name: "Models & Research",
      tag: "MODELS & RESEARCH",
      score: "SIGNAL 8.9",
      time: "38m ago",
      headline: "Test-time compute scaling laws demonstrate super-linear gains",
      excerpt: "Dynamic search budgets and automated verification loops outperform brute parameter scaling on complex scientific benchmarks.",
      technical: "Monte Carlo tree search coupled with domain-specific verifiers reduces error rates exponentially without weight updates.",
      impact: "Inference compute allocations begin surpassing pre-training cluster CAPEX in leading frontier labs.",
      ticker: "NVDA +2.85",
    },
  ];

  const pillarsData = [
    {
      number: "01",
      tag: "RESEARCH",
      tab: "01 Research",
      title: "Curated preprints",
      hook: "From the research frontier, minus the noise.",
      desc: "Urivalent tracks new arXiv work and surfaces the papers with meaningful implications for models, compute and infrastructure.",
    },
    {
      number: "02",
      tag: "OPEN SOURCE",
      tab: "02 Tooling",
      title: "Open-source tooling",
      hook: "The code moving from idea to adoption.",
      desc: "Follow fast-moving repositories, practical agent frameworks and developer tools gaining real traction across the ecosystem.",
    },
    {
      number: "03",
      tag: "CAPITAL",
      tab: "03 Capital",
      title: "Capital & markets",
      hook: "See the infrastructure behind the headlines.",
      desc: "Read signals across AI-basket tickers, data-center power agreements, capacity and the physical build-out of compute.",
    },
  ];

  const scrollToPillar = (index: number) => {
    setActivePillar(index);
    if (pillarScrollRef.current) {
      const container = pillarScrollRef.current;
      const card = container.children[index] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  const handlePillarScroll = () => {
    if (pillarScrollRef.current) {
      const container = pillarScrollRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.84;
      const newIndex = Math.round(scrollLeft / (cardWidth + 12));
      if (newIndex >= 0 && newIndex <= 2 && newIndex !== activePillar) {
        setActivePillar(newIndex);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60 && currentScrollY > lastScrollY) {
        // Scrolling down -> hide navbar
        setNavVisible(false);
      } else {
        // Scrolling up or near top -> show navbar
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cinematic 5-Second Idle Fade on Hero Section
  useEffect(() => {
    const resetIdleTimer = () => {
      // Restore visibility immediately upon any user gesture
      setIsHeroIdle(false);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      // Schedule idle fade only when user is viewing the Hero section
      if (typeof window !== "undefined" && window.scrollY < window.innerHeight * 0.5) {
        idleTimerRef.current = setTimeout(() => {
          if (window.scrollY < window.innerHeight * 0.5) {
            setIsHeroIdle(true);
          }
        }, 5000);
      }
    };

    // Arm the 5s timer on mount
    resetIdleTimer();

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "touchmove",
      "scroll",
    ];

    activityEvents.forEach((ev) =>
      window.addEventListener(ev, resetIdleTimer, { passive: true })
    );

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      activityEvents.forEach((ev) =>
        window.removeEventListener(ev, resetIdleTimer)
      );
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#164A41] overflow-x-hidden selection:bg-[#F1B24A] selection:text-[#164A41]">
      {/* ================================================================== */}
      {/* FLOATING GLASS ISLAND NAVIGATION DOCK                              */}
      {/* ================================================================== */}
      <header
        className={`fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-700 ease-out ${
          navVisible && !isHeroIdle
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1340px] mx-auto bg-[#0A1D16]/75 hover:bg-[#0A1D16]/85 backdrop-blur-xl border border-white/[0.14] rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6),0_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-between gap-4 transition-all">
          {/* Left: Brand Logo housed in a luminous pearl pod for maximum contrast & luxury */}
          <Link href="/" className="flex items-center gap-2 group min-h-[44px] min-w-[44px]" aria-label="Urivalent Homepage">
            <div className="bg-white/[0.94] hover:bg-white px-3.5 py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all group-hover:scale-[1.03]">
              <Image
                src="/urivalent_logo.webp"
                alt="Urivalent"
                width={84}
                height={28}
                className="h-6 sm:h-7 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right: Compact Feed Action Pill */}
          <Link
            href="/feeds"
            className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] font-bold font-mono uppercase tracking-[0.16em] px-4 py-2 min-h-[44px] rounded-full transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1 active:scale-95"
          >
            <span>Feed</span>
            <span className="text-xs">↗</span>
          </Link>
        </div>
      </header>

      {/* ================================================================== */}
      {/* 1. HERO SECTION — EXACT MATCH TO IMAGE 1 & ATTACHED SCREENSHOT      */}
      {/* ================================================================== */}
      <section className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-8 overflow-hidden">
        {/* Full-width Background Image: landing_page.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing_page.jpg"
            alt="Visionary Goggle-Worn Skyward Portrait"
            fill
            sizes="100vw"
            className="object-cover object-[78%_center] sm:object-center"
            priority
            quality={82}
          />
          {/* Directional gradient overlay on the left to preserve exact typography readability while revealing face */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent sm:via-black/30 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        {/* Content Container — Centered naturally with generous top clearance on mobile */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full my-auto pt-10 sm:pt-0">
          <div className="max-w-2xl">
            {/* Main Headline — Exact phrasing & styling from Image 1 */}
            <h1
              className="text-[2.75rem] sm:text-7xl lg:text-[5.75rem] font-medium leading-[0.98] sm:leading-[0.96] tracking-tight text-white mb-3 sm:mb-8 drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              As Far As
              <br />
              <span className="italic text-[#7CE5B4] font-normal">
                Your Eyes
              </span>
              <br />
              Can See<span className="text-[#7CE5B4] font-serif not-italic">:</span>
            </h1>

            {/* Sub-headline — Reduced on mobile by 5 points (18px down to 13px) */}
            <p className="text-white/95 text-[13px] sm:text-xl lg:text-2xl font-light leading-relaxed sm:leading-snug tracking-wide mb-6 sm:mb-10 max-w-lg">
              The future of AI intelligence,
              <br />
              brought into focus.
            </p>

            {/* CTAs Row — Refined compact buttons, shifted slightly lower on mobile */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-6 mt-4 sm:mt-0 pt-3 sm:pt-0">
              {/* Compact Rectangular Gold Button */}
              <Link
                href="/feeds"
                className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[44px] rounded-[2px] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1.5 active:scale-[0.98]"
              >
                <span>Access the Feed</span>
                <span className="text-[11px] sm:text-xs font-bold">↗</span>
              </Link>

              {/* Refined Text Link with Down Arrow */}
              <a
                href="#what-you-see"
                className="text-[#F1B24A] hover:text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-1.5 transition-colors py-2 sm:py-1.5 min-h-[44px]"
              >
                <span>See how it works</span>
                <span className="text-[11px] sm:text-xs">↓</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Baseline: Centered Scroll Indicator Capsule Pill with Accessible 44px Touch Target */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full pt-6 sm:pt-8 flex justify-center text-white">
          <a
            href="#what-you-see"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label="Scroll to content"
          >
            <span className="w-4 h-7 rounded-full border border-white/70 hover:border-white flex justify-center pt-1.5 shadow-sm">
              <span className="w-1 h-1.5 rounded-full bg-[#F1B24A] animate-bounce" />
            </span>
          </a>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. WHAT YOU SEE SECTION — REDESIGNED FOR MOBILE, INTACT ON DESKTOP  */}
      {/* ================================================================== */}
      <section id="what-you-see" className="bg-[#FAF9F5] pt-8 sm:pt-20 pb-10 sm:pb-28 border-b border-[#164A41]/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4 sm:mb-14">
            <span className="text-[#164A41]/80 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
              01 &nbsp; WHAT YOU SEE — A WIDER FIELD OF VIEW
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
            {/* Left Column: Headline & Value Statement */}
            <div className="lg:col-span-4">
              <h2
                className="text-2xl sm:text-5xl lg:text-[3.4rem] font-medium leading-[1.08] sm:leading-[1.05] tracking-tight text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                See the signals
                <br />
                <span className="italic text-[#2C5E54]">
                  beneath the surface.
                </span>
              </h2>

              <p className="text-[#2C5E54] text-xs sm:text-base leading-relaxed mt-2.5 sm:mt-6 max-w-md">
                The important shifts rarely arrive in one place. Urivalent
                brings the research, the tools and the capital story into
                one clear line of sight.
              </p>
            </div>

            {/* Right Column: Mobile Interactive Snap Carousel / Desktop 3 Columns */}
            <div className="lg:col-span-8">
              {/* MOBILE VIEW (md:hidden): Compact, Interactive, Non-flowing Card Deck */}
              <div className="md:hidden">
                {/* Segmented Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-[#164A41]/[0.05] rounded-full border border-[#164A41]/10 mb-3.5">
                  {pillarsData.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToPillar(idx)}
                      className={`flex-1 min-h-[44px] py-2 px-2.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold transition-all inline-flex items-center justify-center ${
                        activePillar === idx
                          ? "bg-[#164A41] text-[#FAF9F5] shadow-sm"
                          : "text-[#164A41]/80 hover:text-[#164A41]"
                      }`}
                    >
                      {item.tab}
                    </button>
                  ))}
                </div>

                {/* Horizontal Snap Carousel */}
                <div
                  ref={pillarScrollRef}
                  onScroll={handlePillarScroll}
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-6 px-6"
                  style={{ scrollbarWidth: "none" }}
                >
                  {pillarsData.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-[84vw] shrink-0 snap-center rounded-2xl bg-white/95 border border-[#164A41]/10 p-5 shadow-[0_4px_16px_rgba(22,74,65,0.04)] flex flex-col justify-between"
                    >
                      <div>
                        {/* Eyebrow: NO icon, compact category tag */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#8A5200] font-bold">
                            {item.number} / {item.tag}
                          </span>
                          <span className="text-[9px] font-mono text-[#164A41]/75">
                            {idx + 1} of 3
                          </span>
                        </div>

                        {/* Title: reduced font size */}
                        <h3
                          className="text-lg font-bold text-[#164A41] mb-1 font-serif"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {item.title}
                        </h3>

                        {/* Hook */}
                        <p className="text-xs text-[#164A41] font-medium mb-1.5">
                          {item.hook}
                        </p>

                        {/* Body Description */}
                        <p className="text-[11px] text-[#2C5E54] leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>

                      {/* Gold Accent Bar */}
                      <div className="pt-4 flex items-center justify-between">
                        <div className="h-[2px] w-8 bg-[#F1B24A]" />
                        <span className="text-[9px] font-mono text-[#164A41]/70 uppercase tracking-widest">
                          Swipe →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Pagination Dots with 44px Accessible Touch Targets */}
                <div className="flex items-center justify-center gap-1 mt-1">
                  {pillarsData.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToPillar(idx)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center -mx-1"
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      <span
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activePillar === idx ? "w-6 bg-[#164A41]" : "w-1.5 bg-[#164A41]/35"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* DESKTOP VIEW (hidden md:grid): Refined 3-Column Layout without Icons */}
              <div className="hidden md:grid border-t border-[#164A41]/20 pt-6 grid-cols-3 divide-x divide-[#164A41]/15">
                {/* Column 1: Curated Preprints */}
                <div className="px-6 first:pl-0 flex flex-col justify-between">
                  <div>
                    {/* Tag Header without icon */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8A5200] font-bold">
                        01 / RESEARCH
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#164A41] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Curated preprints
                    </h3>
                    <p className="text-[#164A41] text-xs sm:text-sm font-medium mb-3">
                      From the research frontier, minus the noise.
                    </p>
                    <p className="text-[#2C5E54] text-xs leading-relaxed">
                      Urivalent tracks new arXiv work and surfaces the papers
                      with meaningful implications for models, compute and
                      infrastructure.
                    </p>
                  </div>

                  {/* Gold bottom accent bar */}
                  <div className="pt-6">
                    <div className="h-[2px] w-12 bg-[#F1B24A]" />
                  </div>
                </div>

                {/* Column 2: Open-Source Tooling */}
                <div className="px-6 flex flex-col justify-between">
                  <div>
                    {/* Tag Header without icon */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8A5200] font-bold">
                        02 / OPEN SOURCE
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#164A41] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Open-source tooling
                    </h3>
                    <p className="text-[#164A41] text-xs sm:text-sm font-medium mb-3">
                      The code moving from idea to adoption.
                    </p>
                    <p className="text-[#2C5E54] text-xs leading-relaxed">
                      Follow fast-moving repositories, practical agent
                      frameworks and developer tools gaining real traction
                      across the ecosystem.
                    </p>
                  </div>

                  {/* Gold bottom accent bar */}
                  <div className="pt-6">
                    <div className="h-[2px] w-12 bg-[#F1B24A]" />
                  </div>
                </div>

                {/* Column 3: Capital & Markets */}
                <div className="px-6 last:pr-0 flex flex-col justify-between">
                  <div>
                    {/* Tag Header without icon */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8A5200] font-bold">
                        03 / CAPITAL
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#164A41] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Capital &amp; markets
                    </h3>
                    <p className="text-[#164A41] text-xs sm:text-sm font-medium mb-3">
                      See the infrastructure behind the headlines.
                    </p>
                    <p className="text-[#2C5E54] text-xs leading-relaxed">
                      Read signals across AI-basket tickers, data-center
                      power agreements, capacity and the physical build-out
                      of compute.
                    </p>
                  </div>

                  {/* Gold bottom accent bar */}
                  <div className="pt-6">
                    <div className="h-[2px] w-12 bg-[#F1B24A]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. HOW IT WORKS / PIPELINE — REDESIGNED FOR MOBILE, INTACT ON DESKTOP */}
      {/* ================================================================== */}
      <section id="how-it-works" className="relative bg-[#12382C] text-white py-8 sm:py-16 overflow-hidden border-b border-[#9DC88D]/20">
        {/* Subtle decorative concentric wireframe circles in top-right background (from Image 3) */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full border border-white/5 pointer-events-none hidden lg:block" />
        <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full border border-white/[0.07] pointer-events-none hidden lg:block" />
        <div className="absolute top-10 right-10 h-48 w-48 rounded-full border border-[#F1B24A]/10 pointer-events-none hidden lg:block" />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          {/* Eyebrow tag */}
          <div className="flex items-center gap-2 mb-4 sm:mb-8">
            <span className="text-[#F1B24A] text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
              02 &nbsp; HOW IT WORKS · FROM SIGNAL TO CLARITY
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: "Always scanning. Always synthesizing." */}
            <div className="lg:col-span-4">
              <h2
                className="text-2xl sm:text-4xl lg:text-[3rem] font-medium leading-[1.08] sm:leading-[1.05] tracking-tight text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Always scanning.
                <br />
                <span className="italic text-[#9DC88D]">
                  Always synthesizing.
                </span>
              </h2>

              <div className="mt-3 sm:mt-5 space-y-0.5 sm:space-y-1 text-xs sm:text-base">
                <p className="text-white/70">Autonomous scraping.</p>
                <p className="text-white/70">Intelligent filtering.</p>
                <p className="text-[#F1B24A] italic font-normal">
                  Instant delivery.
                </p>
              </div>
            </div>

            {/* Right Column: Pipeline Details */}
            <div className="lg:col-span-8">
              {/* MOBILE VIEW (md:hidden): Ultra-Clean Editorial Sequence */}
              <div className="md:hidden border-t border-b border-[#9DC88D]/20 divide-y divide-[#9DC88D]/15">
                {/* 01: Collect */}
                <div className="py-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.22em] text-[#F1B24A] uppercase font-normal">
                    01 / COLLECT
                  </span>
                  <h3
                    className="text-base font-normal text-white font-serif tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Signal Sources
                  </h3>
                </div>

                {/* 02: Interpret */}
                <div className="py-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.22em] text-[#F1B24A] uppercase font-normal">
                    02 / INTERPRET
                  </span>
                  <h3
                    className="text-base font-normal text-white font-serif tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Urivalent Engine
                  </h3>
                </div>

                {/* 03: Deliver */}
                <div className="py-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.22em] text-[#F1B24A] uppercase font-normal">
                    03 / DELIVER
                  </span>
                  <h3
                    className="text-base font-normal text-white font-serif tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Clear Delivery
                  </h3>
                </div>
              </div>

              {/* DESKTOP VIEW (hidden md:block): Refined Minimalist Pipeline (No Icons, No Sub-tags) */}
              <div className="hidden md:block">
                <div className="border border-white/20 rounded-xl overflow-hidden bg-white/[0.02] shadow-xl backdrop-blur-sm">
                  <div className="grid grid-cols-3 divide-x divide-white/15">
                    {/* Box 01: Signal sources */}
                    <div className="p-6 flex flex-col justify-center hover:bg-white/[0.03] transition-colors min-h-[140px]">
                      <div>
                        {/* Top Header: 01 & COLLECT */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white/40 text-xs font-mono font-bold">01</span>
                          <span className="text-[#F1B24A] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                            COLLECT
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-xl font-normal text-white tracking-tight"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          Signal sources
                        </h3>
                      </div>
                    </div>

                    {/* Box 02: Urivalent engine */}
                    <div className="p-6 flex flex-col justify-center hover:bg-white/[0.03] transition-colors min-h-[140px]">
                      <div>
                        {/* Top Header: 02 & INTERPRET */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white/40 text-xs font-mono font-bold">02</span>
                          <span className="text-[#F1B24A] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                            INTERPRET
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-xl font-normal text-white tracking-tight"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          Urivalent engine
                        </h3>
                      </div>
                    </div>

                    {/* Box 03: Clear delivery */}
                    <div className="p-6 flex flex-col justify-center hover:bg-white/[0.03] transition-colors min-h-[140px]">
                      <div>
                        {/* Top Header: 03 & DELIVER */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white/40 text-xs font-mono font-bold">03</span>
                          <span className="text-[#F1B24A] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                            DELIVER
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-xl font-normal text-white tracking-tight"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          Clear delivery
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. LIVE FEED PREVIEW — REDESIGNED FOR MOBILE, INTACT ON DESKTOP     */}
      {/* ================================================================== */}
      <section id="live-feed" className="bg-[#FAF9F5] py-8 sm:py-16 border-b border-[#164A41]/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4 sm:mb-8">
            <span className="text-[#164A41]/50 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
              03 &nbsp; A GLIMPSE INSIDE THE WIRE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Headline & Description */}
            <div className="lg:col-span-4">
              <h2
                className="text-2xl sm:text-4xl lg:text-[3.2rem] font-medium leading-[1.08] sm:leading-[1.05] tracking-tight text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Intelligence
                <br />
                <span className="italic text-[#4D774E]">
                  in Real-Time.
                </span>
              </h2>

              <p className="text-[#4D774E] text-xs sm:text-sm leading-relaxed mt-2.5 sm:mt-4 max-w-sm font-light">
                One considered view across the frontier—from silicon and
                energy to the models reshaping what comes next.
              </p>

              {/* Desktop Only: Interactive Core Intelligence Beats Selector */}
              <div className="hidden md:block mt-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#164A41]/75 font-semibold mb-3">
                  Core Intelligence Beats
                </div>
                <div className="space-y-2">
                  {wireSectors.map((sector, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSector(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group ${
                        activeSector === i
                          ? "bg-[#164A41] text-[#FAF9F5] border-[#164A41] shadow-sm"
                          : "bg-white/80 hover:bg-white text-[#164A41] border-[#164A41]/12 hover:border-[#164A41]/25"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            activeSector === i ? "text-[#F1B24A]" : "text-[#8A5200]"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                          {sector.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono ${
                            activeSector === i ? "text-[#FAF9F5]/70" : "text-[#164A41]/60"
                          }`}
                        >
                          {sector.ticker}
                        </span>
                        <span
                          className={`text-xs transition-transform ${
                            activeSector === i
                              ? "text-[#F1B24A] translate-x-0.5"
                              : "text-[#164A41]/40 group-hover:translate-x-0.5"
                          }`}
                        >
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Mockup Interface */}
            <div className="lg:col-span-8">
              {/* MOBILE VIEW (md:hidden): High-End Interactive Dispatch with Sector Tabs */}
              <div className="md:hidden">
                {/* 1. Sleek Segmented Sector Selector */}
                <div className="flex items-center gap-1 p-1 bg-[#164A41]/[0.05] rounded-xl border border-[#164A41]/10 mb-3.5">
                  {wireSectors.map((sector, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSector(i)}
                      className={`flex-1 min-h-[44px] py-2 px-2.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all inline-flex items-center justify-center text-center whitespace-nowrap ${
                        activeSector === i
                          ? "bg-[#164A41] text-[#FAF9F5] shadow-sm font-semibold"
                          : "text-[#164A41]/80 hover:text-[#164A41] font-medium"
                      }`}
                    >
                      {sector.name}
                    </button>
                  ))}
                </div>

                {/* 2. Mobile Wire Dispatch Card */}
                <div className="bg-white rounded-2xl border border-[#164A41]/12 p-4 shadow-[0_6px_24px_rgba(22,74,65,0.05)]">
                  {/* Top Bar: Wire Telemetry + Signal Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#164A41]/10 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A] animate-pulse" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#164A41]">
                        {wireSectors[activeSector].tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#164A41]/75 font-mono">
                        {wireSectors[activeSector].time}
                      </span>
                      <span className="border border-[#8A5200] bg-[#F1B24A]/15 text-[#8A5200] font-mono font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                        {wireSectors[activeSector].score}
                      </span>
                    </div>
                  </div>

                  {/* Story Headline */}
                  <h3
                    className="text-base font-bold text-[#164A41] leading-snug mt-3 mb-2 font-serif"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {wireSectors[activeSector].headline}
                  </h3>

                  {/* Lead Excerpt */}
                  <p className="text-xs text-[#2C5E54] leading-relaxed mb-3 font-normal">
                    {wireSectors[activeSector].excerpt}
                  </p>

                  {/* Editorial Synthesis: Technical vs Market */}
                  <div className="border border-[#164A41]/10 rounded-xl p-3 bg-[#FAF9F5] space-y-2 mb-3 text-[11px]">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#164A41] block mb-0.5">
                        TECHNICAL CORE
                      </span>
                      <p className="text-[#2C5E54] leading-relaxed font-normal">
                        {wireSectors[activeSector].technical}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#164A41]/10">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#8A5200] block mb-0.5">
                        MARKET IMPACT
                      </span>
                      <p className="text-[#2C5E54] leading-relaxed font-normal">
                        {wireSectors[activeSector].impact}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Live Ticker Indicator + Feed Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#164A41]/10 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-[#164A41]/80">
                      <span className="text-[#164A41]/75 font-mono">Focus:</span>
                      <strong className="text-[#164A41] font-semibold">{wireSectors[activeSector].ticker}</strong>
                    </div>
                    <Link
                      href="/feeds"
                      className="text-[#164A41] hover:text-[#8A5200] font-bold uppercase tracking-wider min-h-[44px] inline-flex items-center gap-1"
                    >
                      <span>Explore Live Wire</span>
                      <span className="text-xs font-bold">↗</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* DESKTOP VIEW (hidden md:block): Original Live Mockup Interface 100% UNTOUCHED */}
              <div className="hidden md:block">
                <div className="bg-white rounded-xl shadow-lg border border-[#164A41]/15 overflow-hidden">
                {/* 1. Window Frame Bar without icons */}
                <div className="bg-[#F4F3EE] border-b border-[#164A41]/10 px-5 py-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#164A41]/75 font-semibold">
                    URIVALENT / INTELLIGENCE WIRE
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#164A41]/50">
                    LIVE DISPATCH PREVIEW
                  </span>
                </div>

                {/* 2. Compute & Capital Subheader */}
                <div className="bg-[#FAF9F5] border-b border-[#164A41]/10 px-5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-4 text-[#164A41]">
                    <span className="font-bold tracking-wider uppercase text-[10px] text-[#4D774E]">
                      COMPUTE &amp; CAPITAL
                    </span>
                    <span className="text-[11px]">
                      <strong className="text-[#164A41]">NVDA</strong> +2.85
                    </span>
                    <span className="text-[11px]">
                      <strong className="text-[#164A41]">TSM</strong> +1.05
                    </span>
                    <span className="text-[11px]">
                      <strong className="text-[#164A41]">ASML</strong> -0.35
                    </span>
                  </div>

                  <div className="bg-[#F1B24A] text-[#164A41] font-black text-[11px] px-2.5 py-0.5 rounded-[2px] flex items-center gap-1 shadow-sm">
                    <span>18</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider">papers / day</span>
                  </div>
                </div>

                {/* 3. Priority Intelligence Bar with Golden Line */}
                <div className="px-5 pt-4 pb-1.5">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#F1B24A]" />
                      <span className="font-bold uppercase tracking-[0.18em] text-[#164A41] text-[10px]">
                        PRIORITY INTELLIGENCE
                      </span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#164A41]/50 font-semibold">
                      DEMO DATA · NOT LIVE
                    </span>
                  </div>
                  {/* Distinct Solid Gold Line running across */}
                  <div className="h-[2px] w-full bg-[#F1B24A] mb-3.5" />
                </div>

                {/* 4. Main Intelligence Story Card — Dynamically connected to activeSector */}
                <div className="px-5 pb-5">
                  {/* Category & Signal Score */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#4D774E] font-bold">
                      {wireSectors[activeSector].tag}
                    </span>
                    <span className="border border-[#8A5200] bg-[#F1B24A]/15 text-[#8A5200] font-mono font-bold text-[11px] px-2 py-0.5 rounded-[2px]">
                      {wireSectors[activeSector].score}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    className="text-xl sm:text-2xl font-bold text-[#164A41] leading-tight mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {wireSectors[activeSector].headline}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-[#2C5E54] leading-relaxed mb-3.5 font-normal">
                    {wireSectors[activeSector].excerpt}
                  </p>

                  {/* Two-Column Technical vs Market Box */}
                  <div className="border border-[#164A41]/15 rounded-lg p-3 sm:p-4 bg-[#FAF9F5] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#164A41] mb-1">
                        TECHNICAL SUMMARY
                      </div>
                      <p className="text-[11px] text-[#2C5E54] leading-relaxed font-normal">
                        {wireSectors[activeSector].technical}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#8A5200] mb-1">
                        MARKET IMPACT
                      </div>
                      <p className="text-[11px] text-[#2C5E54] leading-relaxed font-normal">
                        {wireSectors[activeSector].impact}
                      </p>
                    </div>
                  </div>

                  {/* Read the Full Feed Link */}
                  <div>
                    <Link
                      href="/feeds"
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#164A41] hover:text-[#8A5200] transition-colors"
                    >
                      <span>READ THE FULL FEED</span>
                      <span className="text-xs">↗</span>
                    </Link>
                  </div>
                </div>

                {/* 5. Bottom 3-Column Sector Strip — Interactive Selector */}
                <div className="border-t border-[#164A41]/15 bg-[#FAF9F5] grid grid-cols-3 divide-x divide-[#164A41]/15 font-mono text-xs">
                  {wireSectors.map((sector, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSector(i)}
                      className={`text-left px-5 py-3 transition-colors ${
                        activeSector === i
                          ? "bg-[#164A41]/[0.06] border-t-2 border-[#F1B24A] -mt-[1px]"
                          : "hover:bg-[#164A41]/[0.02]"
                      }`}
                    >
                      <span className="text-[9px] text-[#164A41]/50 block">0{i + 1}</span>
                      <span className="text-[9px] font-bold text-[#4D774E] uppercase tracking-wider block">
                        {sector.tag}
                      </span>
                      <span
                        className={`text-[11px] font-bold mt-0.5 block ${
                          activeSector === i ? "text-[#8A5200]" : "text-[#164A41]"
                        }`}
                      >
                        {sector.ticker}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* ================================================================== */}
      {/* 5. FINAL CALL TO ACTION                                             */}
      {/* ================================================================== */}
      <section className="relative bg-[#12382C] text-white py-20 sm:py-28 overflow-hidden">
        {/* Background binoculars image overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/landing_page.jpeg"
            alt="Urivalent Frontier Perspective"
            fill
            sizes="100vw"
            quality={75}
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-[#F1B24A] text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
              04 &nbsp; THE NEXT SIGNAL IS OUT THERE
            </span>
          </div>

          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.12] tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Don&apos;t get left behind.
            <br />
            <span className="italic text-[#F1B24A] whitespace-nowrap inline-block">
              Start tracking the frontier today.
            </span>
          </h2>

          <p className="text-white text-xs sm:text-[12px] leading-relaxed max-w-lg mx-auto mb-7 font-light">
            Follow what is moving the intelligence economy—before it becomes obvious.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/feeds"
              className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] font-bold uppercase tracking-[0.16em] px-5 py-2.5 min-h-[44px] rounded-[2px] transition-all shadow-md inline-flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>Join Urivalent</span>
              <span className="text-xs font-bold">↗</span>
            </Link>
            <a
              href="mailto:contact@urivalent.tech"
              className="text-white hover:text-[#F1B24A] text-[10px] font-medium uppercase tracking-[0.16em] px-4 py-2 min-h-[44px] inline-flex items-center transition-colors"
            >
              Talk to us
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. FOOTER — COMPACT LOW-PROFILE BAR                                */}
      {/* ================================================================== */}
      <footer className="bg-[#0C241C] border-t border-[#9DC88D]/15 py-3 sm:py-4 px-6 sm:px-10 lg:px-16 text-white">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo in luminous pearl pod (as in navbar) */}
          <Link href="/" className="flex items-center group min-h-[44px]" aria-label="Urivalent Homepage">
            <div className="bg-white/[0.94] hover:bg-white px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-all group-hover:scale-[1.03]">
              <Image
                src="/urivalent_logo.webp"
                alt="Urivalent"
                width={72}
                height={24}
                className="h-5 sm:h-5.5 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Links with accessible touch targets & high contrast */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] font-mono text-white/85">
            <span className="hover:text-white cursor-pointer transition-colors py-2 min-h-[44px] inline-flex items-center">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors py-2 min-h-[44px] inline-flex items-center">Privacy</span>
            <a href="mailto:contact@urivalent.tech" className="hover:text-white transition-colors py-2 min-h-[44px] inline-flex items-center">
              Contact
            </a>
            <Link href="/admin" className="text-[#F1B24A] hover:underline font-bold py-2 min-h-[44px] inline-flex items-center">
              Admin ↗
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
