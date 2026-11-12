"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function AppleStyleLanding() {
  const [activeTab, setActiveTab] = useState<"compute" | "models" | "policy">("compute");

  const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.8, ease: appleEase },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.12,
      },
    },
    viewport: { once: true },
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-zinc-200 selection:text-black">
      {/* ================================================================== */}
      {/* 1. APPLE FROSTED GLASS NAVIGATION DOCK                            */}
      {/* ================================================================== */}
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-zinc-200/60 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between text-xs tracking-tight">
          {/* Brand Logo & Name */}
          <Link href="/home" className="flex items-center gap-2.5 group">
            <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white font-semibold text-[10px] tracking-normal transition-transform group-hover:scale-105">
              U
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900">
              Urivalent
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden sm:flex items-center gap-7 text-zinc-500 font-normal">
            <a href="#overview" className="hover:text-zinc-900 transition-colors">
              Overview
            </a>
            <a href="#vision" className="hover:text-zinc-900 transition-colors">
              Perspective
            </a>
            <a href="#intelligence" className="hover:text-zinc-900 transition-colors">
              Intelligence
            </a>
            <a href="#wire" className="hover:text-zinc-900 transition-colors">
              Live Wire
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:inline-flex text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Classic View
            </Link>
            <Link
              href="/feeds"
              className="bg-black hover:bg-zinc-800 text-white font-medium px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 shadow-sm"
            >
              Access Feed
            </Link>
          </div>
        </div>
      </nav>

      {/* ================================================================== */}
      {/* 2. HERO SECTION — MONUMENTAL, CENTERED, AIRY                       */}
      {/* ================================================================== */}
      <section id="overview" className="pt-24 md:pt-36 pb-20 md:pb-28 px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium tracking-wide mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Autonomous AI Signal Wire
          </motion.div>

          {/* Massive Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tighter text-zinc-900 leading-[0.98] mb-6 max-w-4xl mx-auto"
          >
            As far as{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-400">
              your eyes
            </span>{" "}
            can see.
          </motion.h1>

          {/* Apple-Style Body Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-zinc-500 font-normal leading-relaxed tracking-normal max-w-2xl mx-auto mb-10"
          >
            The future of Artificial intelligence, brought into focus. Follow what is moving
            the intelligence economy—before it becomes obvious.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16 md:mb-24"
          >
            <Link
              href="/feeds"
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-medium px-6 py-3 rounded-full transition-all active:scale-95 shadow-[0_4px_14px_rgba(0,113,227,0.25)] flex items-center gap-1.5"
            >
              <span>Explore Live Feed</span>
              <span>↗</span>
            </Link>
            <a
              href="#wire"
              className="text-[#0066cc] hover:text-[#0077ed] text-sm font-medium px-4 py-3 rounded-full transition-all flex items-center gap-1 group active:scale-95"
            >
              <span>See how it works</span>
              <span className="transition-transform group-hover:translate-x-0.5">›</span>
            </a>
          </motion.div>

          {/* ================================================================ */}
          {/* HARDWARE SHOWCASE: STYLIZED BEZEL WITH VISIONARY HERO ARTWORK    */}
          {/* ================================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl md:rounded-[2.5rem] p-2.5 sm:p-4 bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-300 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.12)] border border-black/[0.08]"
          >
            {/* Screen Inner Bezel */}
            <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden bg-black aspect-[16/10] sm:aspect-[16/9]">
              {/* Visionary Portrait Art */}
              <Image
                src="/landing_page.jpg"
                alt="Urivalent Visionary Goggle Portrait"
                fill
                priority
                quality={95}
                className="object-cover object-[center_35%]"
              />

              {/* Minimal Apple Floating Pods on Screen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-6 sm:p-10 text-left">
                {/* Top Camera Pill */}
                <div className="w-full flex justify-center">
                  <div className="w-20 h-4 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center gap-2 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-900/80" />
                  </div>
                </div>

                {/* Bottom Hardware Content Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 block mb-1">
                      Signal 01 // Horizon Radar
                    </span>
                    <h3 className="text-xl sm:text-3xl font-semibold text-white tracking-tight">
                      First to see the shifts.
                    </h3>
                  </div>

                  {/* Floating Glass Metric Pill */}
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2.5 text-white shadow-lg flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-white/70 font-mono">
                        Stream Precision
                      </div>
                      <div className="text-sm font-semibold tracking-tight">
                        98.4% Conviction
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. PERSPECTIVE SECTION — FULL-BLEED EDITORIAL CARD                 */}
      {/* ================================================================== */}
      <section id="vision" className="py-24 md:py-32 bg-[#f5f5f7] px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 block mb-3">
              Perspective
            </span>
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tighter text-zinc-900 leading-[1.05] mb-5">
              Look beyond the obvious.
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 font-normal leading-relaxed">
              When everyone is watching the headlines, the real inflection points
              are already moving beneath the surface.
            </p>
          </motion.div>

          {/* Rounded-[2.5rem] Binoculars Showcase Card */}
          <motion.div
            {...fadeInUp}
            className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-black text-white min-h-[460px] md:min-h-[560px] flex flex-col justify-end p-8 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
          >
            {/* Background Binoculars Image */}
            <Image
              src="/landing_page.jpeg"
              alt="Binoculars Perspective"
              fill
              className="object-cover object-center opacity-80"
              quality={90}
            />
            {/* Smooth Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="relative z-10 max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 block mb-2">
                02 · Grounded Telemetry
              </span>
              <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight mb-4 text-white">
                Intelligence distilled directly from raw engineering signal.
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
                From compute infrastructure and tensor hardware allocations to frontier
                model pre-training checkpoints, Urivalent tracks the actual catalysts.
              </p>
              <Link
                href="/feeds"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white hover:text-amber-300 transition-colors"
              >
                <span>Examine the methodology</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. APPLE-STYLE 3-COLUMN BENTO GRID                                */}
      {/* ================================================================== */}
      <section id="intelligence" className="py-24 md:py-36 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 block mb-3">
              Engine Architecture
            </span>
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tighter text-zinc-900 leading-[1.05] mb-5">
              Designed for clarity.
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 font-normal leading-relaxed">
              Every stage of the pipeline is crafted to eliminate noise and deliver
              pure, actionable foresight.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Bento Card 1 */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#f5f5f7] rounded-3xl md:rounded-[2rem] p-8 md:p-10 border border-black/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-zinc-900 font-semibold text-sm mb-8 shadow-sm">
                  01
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-3">
                  Raw Signal Ingestion
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                  Continuous ingestion across primary arxiv manuscripts, model foundry repos,
                  patent filings, and data center grid telemetry.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Latency</span>
                <span className="text-zinc-900 font-semibold">&lt; 3.2s</span>
              </div>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#f5f5f7] rounded-3xl md:rounded-[2rem] p-8 md:p-10 border border-black/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-zinc-900 font-semibold text-sm mb-8 shadow-sm">
                  02
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-3">
                  High-Conviction Scoring
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                  Autonomous vector clustering filters out derivative chatter and scores
                  signals by true macroeconomic and compute impact.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Signal-to-Noise</span>
                <span className="text-zinc-900 font-semibold">98.4%</span>
              </div>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#f5f5f7] rounded-3xl md:rounded-[2rem] p-8 md:p-10 border border-black/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-zinc-900 font-semibold text-sm mb-8 shadow-sm">
                  03
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-3">
                  The Real-Time Wire
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                  Immediate transmission via live feed, structured digests, and administrative
                  control panels. No subscription paywall required.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Access</span>
                <span className="text-emerald-600 font-semibold">Public &amp; Live</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. LIVE WIRE HARDWARE SIMULATION — IPAD / DESKTOP BEZEL           */}
      {/* ================================================================== */}
      <section id="wire" className="py-24 md:py-36 bg-[#f5f5f7] px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 block mb-3">
              Interactive Feed
            </span>
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tighter text-zinc-900 leading-[1.05] mb-5">
              The wire in action.
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 font-normal leading-relaxed">
              Curated intelligence items streaming directly to your dashboard.
            </p>
          </motion.div>

          {/* Interactive Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className="bg-zinc-200/70 p-1 rounded-full flex gap-1 text-xs font-medium">
              {(["compute", "models", "policy"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {tab === "compute" ? "Compute & Power" : tab === "models" ? "Frontier Models" : "Sovereign AI"}
                </button>
              ))}
            </div>
          </div>

          {/* Hardware Frame (Simulated iPad / Screen) */}
          <motion.div
            {...fadeInUp}
            className="rounded-3xl md:rounded-[2.5rem] bg-white border border-black/[0.06] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.08)] p-6 sm:p-10 overflow-hidden"
          >
            {/* Screen Top Header */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  URIVALENT INTELLIGENCE WIRE · LIVE BROADCAST
                </span>
              </div>
              <Link
                href="/feeds"
                className="text-xs font-medium text-[#0066cc] hover:underline flex items-center gap-1"
              >
                Open Full Screen ↗
              </Link>
            </div>

            {/* Mock Item Content Based on Tab */}
            <div className="space-y-4">
              {activeTab === "compute" && (
                <>
                  <div className="p-5 rounded-2xl bg-[#f5f5f7] hover:bg-zinc-100 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-semibold">
                          Foundry Telemetry
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">14m ago</span>
                      </div>
                      <h4 className="text-base font-semibold text-zinc-900 tracking-tight">
                        3nm Packaging Bottlenecks Ease Ahead of Next-Gen Accelerator Ramp
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xl">
                        Interposer capacity expands 28% quarter-over-quarter as leading foundries allocate additional cleanroom floor space.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Conviction</span>
                      <span className="text-sm font-bold text-zinc-900">96.8 / 100</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#f5f5f7] hover:bg-zinc-100 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-100 text-amber-800 font-semibold">
                          Grid Infrastructure
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">1h ago</span>
                      </div>
                      <h4 className="text-base font-semibold text-zinc-900 tracking-tight">
                        Hyperscale Nuclear PPA Approvals Accelerate in Western Interconnect
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xl">
                        Two new 1.2 GW co-located data center permits pass environmental review with dedicated baseload generation.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Conviction</span>
                      <span className="text-sm font-bold text-zinc-900">94.2 / 100</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "models" && (
                <>
                  <div className="p-5 rounded-2xl bg-[#f5f5f7] hover:bg-zinc-100 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-semibold">
                          Reasoning Architectures
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">38m ago</span>
                      </div>
                      <h4 className="text-base font-semibold text-zinc-900 tracking-tight">
                        Test-Time Compute Scaling Law Validated on Complex Verification Tasks
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xl">
                        Dynamic search budgets show exponential error-rate reductions on competitive mathematics benchmarks without retraining base weights.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Conviction</span>
                      <span className="text-sm font-bold text-zinc-900">99.1 / 100</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "policy" && (
                <>
                  <div className="p-5 rounded-2xl bg-[#f5f5f7] hover:bg-zinc-100 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-100 text-purple-800 font-semibold">
                          Sovereign Compute
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">2h ago</span>
                      </div>
                      <h4 className="text-base font-semibold text-zinc-900 tracking-tight">
                        EU Sovereign Supercomputing Cluster Orders Reach Final Allocation Phase
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xl">
                        Over 25,000 indigenous accelerator nodes procured across three member states under shared compute pact.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Conviction</span>
                      <span className="text-sm font-bold text-zinc-900">92.5 / 100</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Screen Bar */}
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
              <span>Showing high-conviction signals from 24/7 stream</span>
              <Link
                href="/feeds"
                className="bg-black hover:bg-zinc-800 text-white font-medium px-4 py-2 rounded-full transition-all active:scale-95 text-xs"
              >
                Launch Live Dashboard ↗
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. CALL TO ACTION — CLEAN, MONUMENTAL                              */}
      {/* ================================================================== */}
      <section className="py-28 md:py-40 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 block mb-4">
              Ready to focus?
            </span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tighter text-zinc-900 leading-[0.98] mb-6">
              Don&apos;t get left behind.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-400">
                Start tracking today.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 font-normal max-w-lg mx-auto mb-10 leading-relaxed">
              Join founders, researchers, and technology allocators navigating the
              frontier with high-conviction intelligence.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/feeds"
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all active:scale-95 shadow-[0_4px_14px_rgba(0,113,227,0.3)] flex items-center gap-1.5"
              >
                <span>Join Urivalent</span>
                <span>↗</span>
              </Link>
              <a
                href="mailto:contact@urivalent.tech"
                className="text-zinc-600 hover:text-black text-sm font-medium px-6 py-3.5 rounded-full border border-zinc-200 hover:border-zinc-300 transition-all active:scale-95"
              >
                Talk to us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 7. APPLE MINIMALIST FOOTER                                         */}
      {/* ================================================================== */}
      <footer className="bg-[#f5f5f7] border-t border-zinc-200/60 py-12 px-6 text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white font-semibold text-[10px]">
              U
            </div>
            <span className="font-semibold text-zinc-900 tracking-tight">
              Urivalent Inc.
            </span>
            <span className="text-zinc-400">· Independent AI Intelligence</span>
          </div>

          {/* Navigation & Legal Links */}
          <div className="flex flex-wrap items-center gap-6 text-zinc-500">
            <Link href="/" className="text-zinc-800 font-medium hover:underline">
              Classic Landing Page
            </Link>
            <Link href="/about" className="hover:text-zinc-900 transition-colors">
              About
            </Link>
            <Link href="/feeds" className="hover:text-zinc-900 transition-colors">
              Public Feed
            </Link>
            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Terms</span>
            <a href="mailto:contact@urivalent.tech" className="hover:text-zinc-900 transition-colors">
              Contact
            </a>
            <Link href="/admin" className="text-zinc-700 hover:text-black font-semibold">
              Admin ↗
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-zinc-200/40 text-center md:text-left text-[11px] text-zinc-400">
          Copyright &copy; {new Date().getFullYear()} Urivalent. All rights reserved. Designed with Apple web aesthetic standards.
        </div>
      </footer>
    </div>
  );
}

