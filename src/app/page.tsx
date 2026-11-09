"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#164A41] overflow-x-hidden selection:bg-[#F1B24A] selection:text-[#164A41]">
      {/* ================================================================== */}
      {/* FLOATING GLASS ISLAND NAVIGATION DOCK                              */}
      {/* ================================================================== */}
      <header
        className={`fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-300 ease-out ${
          navVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1340px] mx-auto bg-[#0A1D16]/75 hover:bg-[#0A1D16]/85 backdrop-blur-xl border border-white/[0.14] rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6),0_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-between gap-4 transition-all">
          {/* Left: Brand Logo housed in a luminous pearl pod for maximum contrast & luxury */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white/[0.94] hover:bg-white px-3.5 py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all group-hover:scale-[1.03]">
              <img
                src="/urivalent_logo.png"
                alt="Urivalent"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Right: Compact Feed Action Pill */}
          <Link
            href="/feeds"
            className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] font-bold font-mono uppercase tracking-[0.16em] px-4 py-1.5 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-1 active:scale-95"
          >
            <span>Feed</span>
            <span className="text-xs">↗</span>
          </Link>
        </div>
      </header>

      {/* ================================================================== */}
      {/* 1. HERO SECTION — EXACT MATCH TO IMAGE 1 & ATTACHED SCREENSHOT      */}
      {/* ================================================================== */}
      <section className="relative min-h-screen flex flex-col justify-between pt-32 sm:pt-36 pb-8 overflow-hidden">
        {/* Full-width Background Image: landing_page.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing_page.jpg"
            alt="Visionary Goggle-Worn Skyward Portrait"
            fill
            className="object-cover object-[68%_center] sm:object-center"
            priority
            quality={95}
          />
          {/* Directional gradient overlay on the left to preserve exact typography readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent sm:via-black/30 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Content Container aligned exactly as in Image 1 */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full my-auto">
          <div className="max-w-2xl">
            {/* Main Headline — Exact phrasing & styling from Image 1 */}
            <h1
              className="text-5xl sm:text-7xl lg:text-[5.75rem] font-medium leading-[0.96] tracking-tight text-white mb-6 sm:mb-8 drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              As Far As
              <br />
              <span className="italic text-[#7CE5B4] font-normal">
                Your Eyes
              </span>
              <br />
              Can See<span className="text-[#F1B24A] font-serif not-italic">:</span>
            </h1>

            {/* Sub-headline — Exact 2 lines from Image 1 */}
            <p className="text-white/90 text-lg sm:text-xl lg:text-2xl font-light leading-snug tracking-wide mb-8 sm:mb-10 max-w-lg">
              The future of AI intelligence,
              <br />
              brought into focus.
            </p>

            {/* CTAs Row — Refined, compact size matching Image 1 */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              {/* Compact Rectangular Gold Button */}
              <Link
                href="/feeds"
                className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] font-bold uppercase tracking-[0.16em] px-4 sm:px-5 py-2 sm:py-2.5 rounded-[2px] transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 active:scale-[0.98]"
              >
                <span>Access the Feed</span>
                <span className="text-xs font-bold">↗</span>
              </Link>

              {/* Refined Text Link with Down Arrow */}
              <a
                href="#what-you-see"
                className="text-[#F1B24A] hover:text-white text-[10px] font-semibold uppercase tracking-[0.16em] flex items-center gap-1.5 transition-colors py-1.5"
              >
                <span>See how it works</span>
                <span className="text-xs">↓</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Baseline: Centered Scroll Indicator Capsule Pill */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full pt-8 flex justify-center text-white">
          <a
            href="#what-you-see"
            className="w-4 h-7 rounded-full border border-white/50 hover:border-white flex justify-center pt-1.5 transition-colors shadow-sm"
            aria-label="Scroll to content"
          >
            <span className="w-1 h-1.5 rounded-full bg-[#F1B24A] animate-bounce" />
          </a>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. WHAT YOU SEE SECTION — EXACT MATCH TO IMAGE 2                    */}
      {/* ================================================================== */}
      <section id="what-you-see" className="bg-[#FAF9F5] pt-14 sm:pt-20 pb-20 sm:pb-28 border-b border-[#164A41]/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-10 sm:mb-14">
            <span className="text-[#164A41]/50 text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
              01 &nbsp; WHAT YOU SEE — A WIDER FIELD OF VIEW
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Headline & Value Statement */}
            <div className="lg:col-span-4">
              <h2
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-medium leading-[1.05] tracking-tight text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                See the signals
                <br />
                <span className="italic text-[#4D774E]">
                  beneath the surface.
                </span>
              </h2>

              <p className="text-[#4D774E] text-sm sm:text-base leading-relaxed mt-6 max-w-md">
                The important shifts rarely arrive in one place. Urivalent
                brings the research, the tools and the capital story into
                one clear line of sight.
              </p>
            </div>

            {/* Right Column: 3 Columns Grid with Top Border & Dividers */}
            <div className="lg:col-span-8">
              <div className="border-t border-[#164A41]/20 pt-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#164A41]/15">
                {/* Column 1: Curated Preprints */}
                <div className="py-6 md:py-0 md:px-6 first:md:pl-0 flex flex-col justify-between">
                  <div>
                    {/* Icon + Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="h-11 w-11 rounded-full border border-[#F1B24A] bg-[#F1B24A]/10 flex items-center justify-center text-[#B87914]">
                        {/* Rosette / Orbit Network Icon */}
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                          <circle cx="12" cy="12" r="3" />
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="19" r="2" />
                          <circle cx="5" cy="12" r="2" />
                          <circle cx="19" cy="12" r="2" />
                          <path d="M12 7v2m0 6v2M7 12h2m6 0h2" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#164A41]/50 font-semibold">
                        01 / RESEARCH
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#164A41] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Curated preprints
                    </h3>
                    <p className="text-[#164A41]/75 text-xs sm:text-sm font-medium mb-3">
                      From the research frontier, minus the noise.
                    </p>
                    <p className="text-[#4D774E] text-xs leading-relaxed">
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
                <div className="py-6 md:py-0 md:px-6 flex flex-col justify-between">
                  <div>
                    {/* Icon + Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="h-11 w-11 rounded-full border border-[#F1B24A] bg-[#F1B24A]/10 flex items-center justify-center text-[#B87914]">
                        {/* Code Bracket Icon */}
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#164A41]/50 font-semibold">
                        02 / OPEN SOURCE
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#164A41] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Open-source tooling
                    </h3>
                    <p className="text-[#164A41]/75 text-xs sm:text-sm font-medium mb-3">
                      The code moving from idea to adoption.
                    </p>
                    <p className="text-[#4D774E] text-xs leading-relaxed">
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
                <div className="py-6 md:py-0 md:px-6 last:md:pr-0 flex flex-col justify-between">
                  <div>
                    {/* Icon + Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="h-11 w-11 rounded-full border border-[#F1B24A] bg-[#F1B24A]/10 flex items-center justify-center text-[#B87914]">
                        {/* Trending Market Chart Icon */}
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#164A41]/50 font-semibold">
                        03 / CAPITAL
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#164A41] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Capital &amp; markets
                    </h3>
                    <p className="text-[#164A41]/75 text-xs sm:text-sm font-medium mb-3">
                      See the infrastructure behind the headlines.
                    </p>
                    <p className="text-[#4D774E] text-xs leading-relaxed">
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
      {/* 3. HOW IT WORKS / PIPELINE — COMPACT & SLEEK                      */}
      {/* ================================================================== */}
      <section id="how-it-works" className="relative bg-[#12382C] text-white py-12 sm:py-16 overflow-hidden border-b border-[#9DC88D]/20">
        {/* Subtle decorative concentric wireframe circles in top-right background (from Image 3) */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full border border-white/5 pointer-events-none hidden lg:block" />
        <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full border border-white/[0.07] pointer-events-none hidden lg:block" />
        <div className="absolute top-10 right-10 h-48 w-48 rounded-full border border-[#F1B24A]/10 pointer-events-none hidden lg:block" />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          {/* Eyebrow tag */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <span className="text-[#F1B24A] text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
              02 &nbsp; HOW IT WORKS · FROM SIGNAL TO CLARITY
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: "Always scanning. Always synthesizing." */}
            <div className="lg:col-span-4">
              <h2
                className="text-3xl sm:text-4xl lg:text-[3rem] font-medium leading-[1.05] tracking-tight text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Always scanning.
                <br />
                <span className="italic text-[#9DC88D]">
                  Always synthesizing.
                </span>
              </h2>

              <div className="mt-5 space-y-1 text-sm sm:text-base">
                <p className="text-white/70">Autonomous scraping.</p>
                <p className="text-white/70">Intelligent filtering.</p>
                <p className="text-[#F1B24A] font-semibold italic">
                  Instant delivery.
                </p>
              </div>

              <div className="mt-5">
                <Link
                  href="/feeds"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#F1B24A] hover:text-white transition-colors"
                >
                  <span>See the live feed</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Three-Box Pipeline Details */}
            <div className="lg:col-span-8">
              <div className="border border-white/20 rounded-xl overflow-hidden bg-white/[0.02] shadow-xl backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15">
                  {/* Box 01: Signal sources */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
                    <div>
                      {/* Top Header: 01 & COLLECT */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/40 text-xs font-mono font-bold">01</span>
                        <span className="text-[#F1B24A] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                          COLLECT
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="h-10 w-10 rounded-full border border-[#F1B24A]/40 bg-[#F1B24A]/10 flex items-center justify-center text-[#F1B24A] mb-4">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                          <circle cx="6" cy="12" r="2.5" />
                          <circle cx="18" cy="6" r="2.5" />
                          <circle cx="18" cy="18" r="2.5" />
                          <path d="M8.5 11l7-3.5M8.5 13l7 3.5" />
                        </svg>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-lg sm:text-xl font-bold text-white mb-1.5"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Signal sources
                      </h3>
                    </div>

                    <p className="text-[#9DC88D] text-xs font-mono mt-3">
                      arXiv · GitHub · News
                    </p>
                  </div>

                  {/* Box 02: Urivalent engine */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
                    <div>
                      {/* Top Header: 02 & INTERPRET */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/40 text-xs font-mono font-bold">02</span>
                        <span className="text-[#F1B24A] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                          INTERPRET
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="h-10 w-10 rounded-full border border-[#F1B24A]/40 bg-[#F1B24A]/10 flex items-center justify-center text-[#F1B24A] mb-4">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-lg sm:text-xl font-bold text-white mb-1.5"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Urivalent engine
                      </h3>
                    </div>

                    <p className="text-[#9DC88D] text-xs font-mono mt-3">
                      FastAPI · Cloudflare
                    </p>
                  </div>

                  {/* Box 03: Clear delivery */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
                    <div>
                      {/* Top Header: 03 & DELIVER */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/40 text-xs font-mono font-bold">03</span>
                        <span className="text-[#F1B24A] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                          DELIVER
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="h-10 w-10 rounded-full border border-[#F1B24A]/40 bg-[#F1B24A]/10 flex items-center justify-center text-[#F1B24A] mb-4">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-lg sm:text-xl font-bold text-white mb-1.5"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Clear delivery
                      </h3>
                    </div>

                    <p className="text-[#9DC88D] text-xs font-mono mt-3">
                      Dashboard · Email briefing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. LIVE FEED PREVIEW — COMPACT & TIGHT LAYOUT                       */}
      {/* ================================================================== */}
      <section id="live-feed" className="bg-[#FAF9F5] py-12 sm:py-16 border-b border-[#164A41]/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <span className="text-[#164A41]/50 text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
              03 &nbsp; A GLIMPSE INSIDE THE WIRE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Headline, Description, Link, and Category Buttons */}
            <div className="lg:col-span-4">
              <h2
                className="text-3xl sm:text-4xl lg:text-[3.2rem] font-medium leading-[1.05] tracking-tight text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Intelligence
                <br />
                <span className="italic text-[#4D774E]">
                  in Real-Time.
                </span>
              </h2>

              <p className="text-[#4D774E] text-xs sm:text-sm leading-relaxed mt-4 max-w-sm">
                One considered view across the frontier—from silicon and
                energy to the models reshaping what comes next.
              </p>

              <div className="mt-5">
                <Link
                  href="/feeds"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#164A41] hover:text-[#B87914] transition-colors"
                >
                  <span>Explore the intelligence wire</span>
                  <span className="text-sm font-bold">↗</span>
                </Link>
              </div>

              {/* 3 Outline Category Pill Buttons below link */}
              <div className="flex flex-wrap items-center gap-2 mt-5">
                <span className="border border-[#164A41]/30 bg-white/70 text-[#164A41] text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-[3px] shadow-sm">
                  Silicon &amp; Nanotech
                </span>
                <span className="border border-[#164A41]/30 bg-white/70 text-[#164A41] text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-[3px] shadow-sm">
                  Energy &amp; Infra
                </span>
                <span className="border border-[#164A41]/30 bg-white/70 text-[#164A41] text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-[3px] shadow-sm">
                  Models &amp; Research
                </span>
              </div>
            </div>

            {/* Right Column: Live Mockup Interface */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-lg border border-[#164A41]/15 overflow-hidden">
                {/* 1. Window Frame Bar */}
                <div className="bg-[#F4F3EE] border-b border-[#164A41]/10 px-5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F1B24A]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E88C30]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4D774E]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#164A41]/60 font-semibold">
                    URIVALENT / INTELLIGENCE WIRE
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#164A41]/40">
                    ILLUSTRATIVE PREVIEW
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

                {/* 4. Main Intelligence Story Card */}
                <div className="px-5 pb-5">
                  {/* Category & Signal Score */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#4D774E] font-bold">
                      SILICON &amp; NANOTECH
                    </span>
                    <span className="border border-[#F1B24A] bg-[#F1B24A]/15 text-[#B87914] font-mono font-bold text-[11px] px-2 py-0.5 rounded-[2px]">
                      SIGNAL 9.4
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    className="text-xl sm:text-2xl font-bold text-[#164A41] leading-tight mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Chiplet economics move from roadmap to near-term constraint
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-[#4D774E] leading-relaxed mb-3.5">
                    An illustrative signal on advanced packaging capacity, with integration complexity becoming as strategically important as leading-edge wafer supply.
                  </p>

                  {/* Two-Column Technical vs Market Box */}
                  <div className="border border-[#164A41]/15 rounded-lg p-3 sm:p-4 bg-[#FAF9F5] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#164A41] mb-1">
                        TECHNICAL SUMMARY
                      </div>
                      <p className="text-[11px] text-[#4D774E] leading-relaxed">
                        2.5D integration, hybrid bonding and high bandwidth memory co-design are reshaping practical limits of accelerator throughput. Packaging yield is emerging as a first order variable.
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#F1B24A] mb-1">
                        MARKET IMPACT
                      </div>
                      <p className="text-[11px] text-[#4D774E] leading-relaxed">
                        Could extend the premium on packaging capacity and strengthen the case for diversified back-end supply. Watch capex allocation, lead times and customer prepayments.
                      </p>
                    </div>
                  </div>

                  {/* Read the Full Feed Link */}
                  <div>
                    <Link
                      href="/feeds"
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#164A41] hover:text-[#F1B24A] transition-colors"
                    >
                      <span>READ THE FULL FEED</span>
                      <span className="text-xs">↗</span>
                    </Link>
                  </div>
                </div>

                {/* 5. Bottom 3-Column Sector Strip from Image 4 */}
                <div className="border-t border-[#164A41]/15 bg-[#FAF9F5] px-5 py-3 grid grid-cols-3 divide-x divide-[#164A41]/15 font-mono text-xs">
                  <div className="pr-3">
                    <span className="text-[9px] text-[#164A41]/40 block">01</span>
                    <span className="text-[9px] font-bold text-[#4D774E] uppercase tracking-wider block">
                      SILICON &amp; NANOTECH
                    </span>
                    <span className="text-[11px] font-bold text-[#164A41] mt-0.5 block">
                      TSMC
                    </span>
                  </div>

                  <div className="px-3">
                    <span className="text-[9px] text-[#164A41]/40 block">02</span>
                    <span className="text-[9px] font-bold text-[#4D774E] uppercase tracking-wider block">
                      ENERGY &amp; INFRA
                    </span>
                    <span className="text-[11px] font-bold text-[#F1B24A] mt-0.5 block">
                      GRID CAPACITY
                    </span>
                  </div>

                  <div className="pl-3">
                    <span className="text-[9px] text-[#164A41]/40 block">03</span>
                    <span className="text-[9px] font-bold text-[#4D774E] uppercase tracking-wider block">
                      MODELS &amp; RESEARCH
                    </span>
                    <span className="text-[11px] font-bold text-[#164A41] mt-0.5 block">
                      OPEN MODELS
                    </span>
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
              className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] font-bold uppercase tracking-[0.16em] px-5 py-2.5 rounded-[2px] transition-all shadow-md flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>Join Urivalent</span>
              <span className="text-xs font-bold">↗</span>
            </Link>
            <a
              href="mailto:contact@urivalent.tech"
              className="text-white/80 hover:text-white text-[10px] font-medium uppercase tracking-[0.16em] px-4 py-2 transition-colors"
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
          <Link href="/" className="flex items-center group">
            <div className="bg-white/[0.94] hover:bg-white px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-all group-hover:scale-[1.03]">
              <img
                src="/urivalent_logo.png"
                alt="Urivalent"
                className="h-5 sm:h-5.5 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-5 text-[11px] font-mono text-white/60">
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <a href="mailto:contact@urivalent.tech" className="hover:text-white transition-colors">
              Contact
            </a>
            <Link href="/admin" className="text-[#F1B24A] hover:underline font-bold">
              Admin ↗
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
