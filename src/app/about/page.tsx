"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";

export default function AboutPage() {
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60 && currentScrollY > lastScrollY) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const pillars = [
    {
      title: "Silicon & Nanotech",
      description:
        "Compute is the new global reserve currency. The physical limits of semiconductor manufacturing dictate the pace of AI advancement, from extreme ultraviolet (EUV) lithography to 2.5D packaging bottlenecks and next-gen wafer allocation.",
      tracked: "Tracked: NVDA, TSM, ASML, ARM",
    },
    {
      title: "Energy & Infra",
      description:
        "Intelligence is thermodynamically constrained. The transition demands dedicated baseload power, gigawatt-scale cluster campuses, behind-the-meter nuclear power purchase agreements, and ultra-high-density thermal management.",
      tracked: "Tracked: CEG, VRT, NEE, SPCX",
    },
    {
      title: "Models & Research",
      description:
        "Algorithmic velocity and architectural breakthroughs. Tracking frontier foundation models, reasoning scaling laws, test-time compute trade-offs, and multi-modal arXiv preprints directly from leading research laboratories.",
      tracked: "Tracked: GOOGL, META, MSFT, TSLA",
    },
    {
      title: "Agents & Tooling",
      description:
        "The translation of raw foundation models into autonomous economic agency. Monitoring workflow orchestrators, code-synthesis engines, embodied robotics, and developer ecosystems bridging models with real-world execution.",
      tracked: "Tracked: NOW, NET, PATH, FIGURE",
    },
    {
      title: "Capital & Markets",
      description:
        "The balance-sheet realities of the compute build-out. Tracking hyperscaler capex expenditures, private venture concentration across frontier clusters, public equity valuations, and specialized infrastructure debt financing.",
      tracked: "Tracked: SFTBY, BX, COIN",
    },
    {
      title: "Policy & Sovereignty",
      description:
        "The geopolitical contest for computational hegemony. Monitoring national compute clusters, strategic export controls on lithography and advanced accelerators, defense-grade data pipelines, and sovereign AI regulatory doctrines.",
      tracked: "Tracked: PLTR, BAH, LMT, ANDURIL",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 flex flex-col justify-between selection:bg-[#1a4537] selection:text-white">
      {/* ================================================================== */}
      {/* FLOATING GLASS ISLAND NAVIGATION DOCK                              */}
      {/* ================================================================== */}
      <header
        className={`fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-700 ease-out ${
          navVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1340px] mx-auto bg-[#0A1D16]/85 backdrop-blur-xl border border-white/[0.14] rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4">
          {/* Luminous Pearl Pod Logo */}
          <Link href="/" className="flex items-center gap-2 group min-h-[44px]" aria-label="Urivalent Homepage">
            <div className="bg-white/[0.94] px-3.5 py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-[1.03]">
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

          {/* Center Navigation Shortcuts */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-[11px] font-mono tracking-wider text-white/80">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-full text-[#d97706] bg-white/[0.08] font-bold"
            >
              About
            </Link>
            <Link
              href="/feeds"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Feeds
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action: Access Feed CTA */}
          <Link
            href="/feeds"
            className="bg-[#d97706] hover:bg-[#b45309] text-white text-[10px] font-bold font-mono uppercase tracking-[0.16em] px-4 py-2 min-h-[40px] rounded-full transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1 active:scale-95"
          >
            <span>Feed</span>
            <span className="text-xs">↗</span>
          </Link>
        </div>
      </header>

      {/* ================================================================== */}
      {/* HERO SECTION WITH about_page.jpg BACKGROUND                        */}
      {/* ================================================================== */}
      <section className="relative min-h-[400px] sm:min-h-[480px] flex flex-col justify-center pt-32 sm:pt-40 pb-16 sm:pb-20 overflow-hidden">
        {/* Full-width Background Image: about_page.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/about_page.jpg"
            alt="About Urivalent - The Edge of Tomorrow"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4 drop-shadow-md"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            About Urivalent<span className="text-[#d97706]">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base font-semibold tracking-[0.25em] text-[#d97706] uppercase font-mono drop-shadow-sm"
          >
            The Edge of Tomorrow
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-[#f3f4f6] py-16 sm:py-24 px-6 sm:px-12 flex-1">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-16"
        >
          {/* The Six Pillars Section */}
          <motion.section
            variants={itemVariants}
            className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-[#1a4537] mb-6">The Six Pillars of Intelligence</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The artificial intelligence transition is not a single software trend; it is a fundamental reorganization of global infrastructure, compute, and capital. Urivalent tracks this convergence across six definitive fields to provide a high-signal vantage point.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-white/50 backdrop-blur-md border border-white/60 rounded-xl p-6 transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-[#1a4537] text-base">{pillar.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {pillar.description}
                  </p>
                  <p className="text-xs font-medium text-[#d97706] mt-3">{pillar.tracked}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* The Selection Thesis Section */}
          <motion.section
            variants={itemVariants}
            className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-[#1a4537] mb-4">The Selection Thesis: Bottlenecks & Bellwethers</h2>
            <p className="text-gray-600 leading-relaxed">
              The equities tracked within the Urivalent pipeline are not selected by mere market capitalization or media hype, but by their structural criticality. We specifically isolate the monopolies, infrastructural bottlenecks, and pure-play bellwethers of the AI transition. Rather than tracking derivative software wrappers with low competitive moats, Urivalent monitors the entities that own the foundational layer—the extreme ultraviolet lithography machines, the gigawatt-scale nuclear power contracts, the frontier model weights, and the defense-grade data pipelines. We track these specific companies because they actively dictate the physical, computational, and capital limits of what the rest of the industry can build.
            </p>
          </motion.section>

          {/* Founder Section — A Note from the Architect */}
          <motion.section
            variants={itemVariants}
            className="bg-[#1a4537] text-white shadow-xl rounded-2xl p-8 md:p-12 relative overflow-hidden font-sans"
          >
            {/* Subtle gold accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#d97706]" />

            <h2 className="text-2xl font-bold tracking-tight mb-6 text-white not-italic">
              A Note from the Founder
            </h2>

            <div className="space-y-4 text-gray-200 leading-relaxed text-sm sm:text-base font-normal italic">
              <p className="font-normal leading-relaxed italic">
                &quot;I built Urivalent because the artificial intelligence transition is fundamentally misunderstood. It is not just a software trend; it is a physical and financial reorganization of the world.
              </p>
              <p className="font-normal leading-relaxed italic">
                My background is rooted in the physical world as a mechanical engineer, designing bio-inspired energy systems before transitioning into full-stack development and quantitative finance. That trajectory taught me one thing: the future of code is strictly bound by the realities of hardware and capital. I engineered the Urivalent pipeline to track that exact intersection.
              </p>
              <p className="font-normal leading-relaxed italic">
                My goal is to filter the noise and deliver high-signal telemetry that extends your vantage point <span className="text-[#d97706] font-semibold italic">as far as your eyes can see</span> giving you a clear view of the edge of tomorrow.&quot;
              </p>
            </div>

            <div className="mt-8 flex flex-col items-end text-right">
  <p className="text-white font-medium text-base">
    &mdash; Samuel Gathua, <span className="text-[#d97706]">Founder</span>
  </p>
  <div className="mt-1.5">
    <a
      href="https://www.linkedin.com/in/samuelgathua"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#d97706] hover:text-[#f59e0b] hover:underline transition-colors"
    >
      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
      <span> Connect with me on LinkedIn </span>
    </a>
  </div>
</div>
          </motion.section>
        </motion.main>
      </div>

      {/* ================================================================== */}
      {/* FOOTER — SLEEK DIRECTORY & SUBSCRIBE PIPELINE                      */}
      {/* ================================================================== */}
      <footer className="bg-[#0C241C] border-t border-[#9DC88D]/15 pt-10 sm:pt-14 pb-8 px-6 sm:px-10 lg:px-16 text-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <Link href="/" className="inline-block group" aria-label="Urivalent Homepage">
              <div className="bg-white/[0.94] hover:bg-white px-3.5 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-all group-hover:scale-[1.03] inline-block">
                <Image
                  src="/urivalent_logo.webp"
                  alt="Urivalent"
                  width={78}
                  height={26}
                  className="h-5 sm:h-5.5 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-[11px] text-white/60 leading-relaxed max-w-sm font-light">
              Autonomously tracking frontier models, silicon architecture, sovereign compute infrastructure, agent tooling, and capital markets.
            </p>
            <div className="text-[10px] font-mono text-white/40 pt-1">
              &copy; {new Date().getFullYear()} Urivalent. All rights reserved.
            </div>
          </div>

          {/* Column 2: Redirect Links (3 cols) */}
          <div className="md:col-span-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F1B24A] font-semibold block mb-3">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-xs font-mono text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px]">›</span>
                  <span>Overview</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#F1B24A] font-bold transition-colors inline-flex items-center gap-1.5">
                  <span className="text-[#F1B24A] text-[10px]">›</span>
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link href="/feeds" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px]">›</span>
                  <span>Live Feeds</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px]">›</span>
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px]">›</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px]">›</span>
                  <span>Contact Desk</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#F1B24A] hover:underline font-bold inline-flex items-center gap-1.5">
                  <span className="text-[#F1B24A]/50 text-[10px]">›</span>
                  <span>Admin Console ↗</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Subscribe form (5 cols) */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#F1B24A] text-[9px] font-mono font-semibold uppercase tracking-[0.2em]">
                DISPATCH BRIEFING
              </span>
            </div>
            <h4
              className="text-base sm:text-lg font-medium tracking-tight text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Subscribe to Sovereign Signals
            </h4>
            <p className="text-[11px] text-white/65 font-light leading-relaxed max-w-md">
              Daily synthesized intelligence on frontier AI models, silicon bottlenecks, and sovereign compute infrastructure.
            </p>
            <div className="pt-1 max-w-md">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
