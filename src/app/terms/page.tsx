"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";

export default function TermsPage() {
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

  const verticalVectors = [
    {
      name: "Silicon & Nanotech",
      scope: "Fab capacity, lithography patents, wafer pricing, packaging innovations",
      output: "Technical Briefs & Supply Chain Signals",
    },
    {
      name: "Energy & Infra",
      scope: "Grid allocations, datacenter power contracts, cooling & SMR deployments",
      output: "Infrastructure Readiness Metrics",
    },
    {
      name: "Models & Research",
      scope: "ArXiv preprints, benchmark verification, weight release tracking",
      output: "Algorithmic Synthesis Reports",
    },
    {
      name: "Agents & Tooling",
      scope: "Repository velocity, SDK updates, protocol adoption metrics",
      output: "Ecosystem Dependency Maps",
    },
    {
      name: "Capital & Markets",
      scope: "Capex filings, public tickers (e.g., NVDA, CEG), private round data",
      output: "Quantitative Market Intelligence",
    },
    {
      name: "Policy & Sovereignty",
      scope: "Regulatory filings, trade controls, state compute procurement",
      output: "Geopolitical Risk Indexes",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#164A41] flex flex-col font-sans antialiased selection:bg-[#F1B24A] selection:text-[#164A41]">
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
        <div className="max-w-[1340px] mx-auto bg-[#0A1D16]/80 hover:bg-[#0A1D16]/90 backdrop-blur-xl border border-white/[0.14] rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6),0_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-between gap-3 sm:gap-4 transition-all">
          {/* Left: Brand Logo in luminous pearl pod */}
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

          {/* Center Navigation Shortcuts */}
          <nav className="hidden sm:flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-white/75">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              About
            </Link>
            <Link
              href="/feeds"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Intelligence Feed
            </Link>
          </nav>

          {/* Right Action: Access Feed CTA */}
          <Link
            href="/feeds"
            className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] font-bold font-mono uppercase tracking-[0.16em] px-4 py-2 min-h-[40px] rounded-full transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1 active:scale-95"
          >
            <span>Feed</span>
            <span className="text-xs">↗</span>
          </Link>
        </div>
      </header>

      {/* ================================================================== */}
      {/* DOCUMENT HEADER / HERO BANNER WITH contact_page.jpg               */}
      {/* ================================================================== */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-center pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden">
        {/* Full-width Background Image: contact_page.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact_page.jpg"
            alt="Urivalent Legal Framework & Terms"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Subtle gradient overlay to ensure crystal clear typography */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1D16]/80 via-[#0A1D16]/50 to-[#0A1D16]" />
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.18em] text-[#F1B24A] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A]"></span>
            <span>Legal Framework & Terms of Use</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-4 leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Terms and Conditions<span className="text-[#F1B24A]">.</span>
          </h1>

          <p className="text-base sm:text-xl text-white/85 font-light leading-relaxed mb-6">
            Master Services Agreement & Terms of Use for the Urivalent Autonomous AI Intelligence Pipeline
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/90">
            <span className="bg-[#0A1D16]/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full shadow-2xs">
              Jurisdiction: <strong className="text-white">Nairobi, Kenya</strong>
            </span>
            <span className="bg-[#0A1D16]/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full shadow-2xs">
              Status: <strong className="text-white">Legally Binding</strong>
            </span>
            <span className="bg-[#0A1D16]/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full shadow-2xs">
              Last Updated: <strong className="text-white">2026</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* LEGAL DOCUMENT CONTENT                                             */}
      {/* ================================================================== */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Table of Contents Jump Grid */}
        <nav aria-label="Table of contents" className="bg-white/80 border border-[#164A41]/10 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4D774E] mb-3">
            Document Sections Quick Navigation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <a href="#section-1" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>1. Introduction & Acceptance</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-2" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>2. Description of Service</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-3" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>3. No Financial Advice Disclaimer</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-4" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>4. Intellectual Property Rights</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-5" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>5. Third-Party Data & Accuracy</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-6" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>6. Acceptable Use Policy</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-7" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>7. Liability & Warranties</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-8" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>8. Governing Law & Inquiries</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
          </div>
        </nav>

        {/* 1. Introduction & Acceptance of Terms */}
        <section id="section-1" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-4 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              01
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Introduction & Acceptance of Terms
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            Welcome to Urivalent. These Terms and Conditions (&ldquo;Terms&rdquo;, &ldquo;Agreement&rdquo;) govern your access to and use of the platform, algorithms, web interfaces, APIs, data feeds, and intelligence pipelines operated by Urivalent (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
          </p>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            By accessing, subscribing to, indexing, or otherwise utilizing the Urivalent platform or any of its associated data feeds, you (&ldquo;User&rdquo;, &ldquo;Subscriber&rdquo;, &ldquo;Entity&rdquo;) agree to be bound by these Terms in full. If you are entering into this Agreement on behalf of a corporate entity, fund, or research institution, you represent and warrant that you have the legal authority to bind such entity to these Terms.
          </p>
          <div className="bg-[#FAF9F5] border-l-4 border-[#F1B24A] p-4 rounded-r-xl text-xs sm:text-sm text-[#164A41]">
            If you do not agree to all of the provisions set forth herein, you must immediately cease all access to and use of the Urivalent autonomous intelligence pipeline.
          </div>
        </section>

        {/* 2. Description of Service */}
        <section id="section-2" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-6 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              02
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Description of Service
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            Urivalent operates an autonomous, real-time artificial intelligence intelligence pipeline designed to aggregate, parse, synthesize, and evaluate high-velocity technological, industrial, and financial signals. The service provides structured intelligence, telemetry, and automated analysis across six primary verticals:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A]"></span>
                Silicon & Nanotech
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Automated tracking of semiconductor manufacturing, fabrication facilities, lithography breakthroughs, microarchitectures, wafer allocation metrics, and advanced material research.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A]"></span>
                Energy & Infrastructure
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Real-time data processing concerning power grids, nuclear and small modular reactor (SMR) deployments, data center capacity expansion, thermal management systems, and compute-utility load dynamics.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A]"></span>
                Models & Research
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Automated ingestion and synthesis of academic preprints, architectural advancements, training paradigms, loss curves, benchmark evaluations, and open-source model releases.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A]"></span>
                Agents & Tooling
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Tracking of autonomous agent frameworks, orchestration layers, execution environments, API ecosystems, developer tooling adoption, and execution primitives.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A]"></span>
                Capital & Markets
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Structured signal generation tracking corporate capital expenditures, equity performance of ecosystem enablers, private market valuations, venture flows, sovereign wealth allocations, and supply chain pricing.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1B24A]"></span>
                Policy & Sovereignty
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Monitoring of international trade restrictions, export controls, sovereign compute initiatives, AI governance frameworks, national security mandates, and regulatory compliance shifts.
              </p>
            </div>
          </div>

          {/* Structured Telemetry Matrix Table */}
          <div className="border border-[#164A41]/15 rounded-xl overflow-hidden shadow-2xs mt-4">
            <div className="bg-[#0C241C] text-white text-[11px] font-mono font-bold uppercase tracking-wider px-4 sm:px-6 py-3 grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 sm:col-span-4">Vertical Vector</div>
              <div className="col-span-12 sm:col-span-4">Core Telemetry & Ingestion Scope</div>
              <div className="col-span-12 sm:col-span-4">Primary Output Type</div>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {verticalVectors.map((item) => (
                <div key={item.name} className="px-4 sm:px-6 py-3 grid grid-cols-12 gap-3 items-center text-xs hover:bg-[#FAF9F5] transition-colors">
                  <div className="col-span-12 sm:col-span-4 font-bold text-[#164A41] font-mono">
                    {item.name}
                  </div>
                  <div className="col-span-12 sm:col-span-4 text-[#4D774E]">
                    {item.scope}
                  </div>
                  <div className="col-span-12 sm:col-span-4 font-mono text-[11px] text-[#F1B24A] font-bold uppercase">
                    {item.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. No Financial Advice Disclaimer */}
        <section id="section-3" className="bg-white rounded-2xl border border-amber-300 p-6 sm:p-10 shadow-sm space-y-5 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-amber-200 pb-3">
            <span className="bg-[#F1B24A] text-[#164A41] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              03
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              No Financial Advice Disclaimer
            </h2>
          </div>

          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 sm:p-5 text-amber-950 font-mono text-xs leading-relaxed space-y-1">
            <div className="font-bold uppercase tracking-wider text-amber-900 text-sm">
              CRITICAL NOTICE
            </div>
            <p>
              Urivalent is an automated data processing and technological intelligence engine. It does not provide investment, financial, legal, or tax advice.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4D774E] leading-relaxed">
            <div className="space-y-1">
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block">
                ● Informational Purposes Only:
              </strong>
              <p>
                All output generated by Urivalent—including market signals, automated summaries, volatility metrics, momentum scores, and stock tickers (including but not limited to Nvidia Corporation [NASDAQ: NVDA], Constellation Energy Corporation [NASDAQ: CEG], or any other public equity, fixed-income instrument, or commodity)—is provided strictly for general informational and research purposes.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block">
                ● Not an Offer or Solicitation:
              </strong>
              <p>
                Content displayed on Urivalent does not constitute an offer to buy or sell securities, options, futures, or any other financial instrument, nor does it constitute a recommendation of any investment strategy.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block">
                ● Automated Processing:
              </strong>
              <p>
                Signals are generated via automated algorithms without human oversight or assessment of your individual financial situation, risk tolerance, or investment objectives.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block">
                ● Consultation Required:
              </strong>
              <p>
                You must conduct your own independent due diligence and consult with a licensed financial advisor, broker, or legal professional before making any financial or operational decisions.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Intellectual Property Rights */}
        <section id="section-4" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-4 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              04
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Intellectual Property Rights
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            The Urivalent service, its underlying architecture, autonomous algorithms, proprietary scraping engines, data transformation pipelines, user interface designs, visual layouts, dynamic visualizations, and branding elements are the exclusive intellectual property of Urivalent and its licensors, protected under international copyright, trademark, trade secret, and patent laws.
          </p>

          <div className="space-y-3 text-xs sm:text-sm text-[#4D774E] leading-relaxed pt-2">
            <div>
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block mb-1">
                ● Proprietary Systems:
              </strong>
              You acknowledge that Urivalent&apos;s custom web-scraping agents, data parsing heuristics, weightings, and real-time indexing models constitute trade secrets of Urivalent.
            </div>

            <div>
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block mb-1">
                ● Limited License:
              </strong>
              Subject to compliance with these Terms, Urivalent grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and view the data feeds for your internal research or personal use.
            </div>

            <div>
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block mb-1">
                ● Restrictions:
              </strong>
              You shall not copy, modify, distribute, sell, lease, perform, display, publish, or create derivative works from any part of the Urivalent platform, proprietary data formats, or underlying source code without explicit prior written consent from Urivalent.
            </div>
          </div>
        </section>

        {/* 5. Third-Party Data & Accuracy Disclaimer */}
        <section id="section-5" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-4 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              05
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Third-Party Data & Accuracy Disclaimer
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            Urivalent relies on complex automated ingestion pipelines that continuously aggregate data from diverse public and semi-public third-party sources, including but not limited to academic repositories (e.g., arXiv), code hosting platforms (e.g., GitHub), corporate financial filings, regulatory databases, news feeds, and public market data providers.
          </p>

          <div className="space-y-3 text-xs sm:text-sm text-[#4D774E] leading-relaxed pt-2">
            <div>
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block mb-1">
                ● Upstream Inaccuracies:
              </strong>
              Urivalent does not generate baseline third-party factual data. Consequently, Urivalent accepts no responsibility or liability for errors, omissions, misstatements, hallucinations, or inaccuracies present in upstream raw data or resulting synthesized output.
            </div>

            <div>
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block mb-1">
                ● No Verification Guarantee:
              </strong>
              While our autonomous models employ verification heuristics, Urivalent does not guarantee the completeness, timeliness, accuracy, or availability of any data point or signal displayed on the platform.
            </div>

            <div>
              <strong className="text-[#164A41] font-mono uppercase tracking-wider text-xs block mb-1">
                ● System Delays:
              </strong>
              Real-time feeds may experience latency, interruptions, or outages due to upstream API alterations, network disruptions, or target platform structural updates.
            </div>
          </div>
        </section>

        {/* 6. Acceptable Use Policy */}
        <section id="section-6" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-4 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              06
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Acceptable Use Policy
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            You agree to use the Urivalent intelligence pipeline solely for lawful purposes and in strict accordance with this Agreement. You explicitly agree <strong>NOT</strong> to:
          </p>

          <ol className="list-decimal pl-5 space-y-3 text-xs sm:text-sm text-[#4D774E] leading-relaxed">
            <li>
              <strong className="text-[#164A41]">Malicious Extraction:</strong> Deploy automated crawlers, bots, scrapers, or extraction tools against Urivalent&apos;s web applications, APIs, or data structures without prior authorization.
            </li>
            <li>
              <strong className="text-[#164A41]">Reverse Engineering:</strong> Decompile, reverse engineer, disassemble, or attempt to derive the underlying algorithmic structures, prompt engineering techniques, model weights, or source code of Urivalent.
            </li>
            <li>
              <strong className="text-[#164A41]">Unauthorized Redistribution:</strong> Resell, redistribute, syndicate, re-stream, or expose Urivalent’s structured outputs, API endpoints, or raw signal streams to third parties for commercial gain or as a competing standalone feed.
            </li>
            <li>
              <strong className="text-[#164A41]">Platform Disruption:</strong> Launch denial-of-service (DoS) attacks, inject malicious payloads, bypass authentication mechanisms, or overload the platform&apos;s infrastructure.
            </li>
            <li>
              <strong className="text-[#164A41]">System Evasion:</strong> Circumvent rate limits, IP restrictions, or access control parameters instituted by Urivalent.
            </li>
          </ol>

          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-mono">
            Violation of these provisions will result in immediate termination of your access without notice and may subject you to legal proceedings and monetary damages.
          </div>
        </section>

        {/* 7. Limitation of Liability and Disclaimer of Warranties */}
        <section id="section-7" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-6 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              07
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Limitation of Liability and Disclaimer of Warranties
            </h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#164A41]">
              7.1 &ldquo;As-Is&rdquo; and &ldquo;As-Available&rdquo; Provision
            </h3>
            <p className="text-xs font-mono leading-relaxed bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 text-[#164A41]/90 uppercase">
              THE URIVALENT SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS. URIVALENT DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND UNINTERRUPTED OR ERROR-FREE OPERATION.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#164A41]">
              7.2 Limitation of Damages
            </h3>
            <p className="text-xs font-mono leading-relaxed text-[#164A41]/90 uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL URIVALENT, ITS DIRECTORS, EMPLOYEES, AFFILIATES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-5 text-xs font-mono space-y-1 text-[#4D774E]">
              <li>LOSS OF PROFITS, REVENUE, OR SAVINGS;</li>
              <li>TRADING LOSSES OR BAD INVESTMENT DECISIONS;</li>
              <li>LOSS OF DATA, GOODWILL, OR BUSINESS OPPORTUNITIES;</li>
              <li>SYSTEM DOWNTIME OR INABILITY TO ACCESS THE FEED.</li>
            </ul>

            <div className="bg-[#FAF9F5] border-l-4 border-[#164A41] p-4 rounded-r-xl text-xs font-mono text-[#164A41] leading-relaxed uppercase mt-3">
              URIVALENT&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE USE OF THE SERVICE SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU TO URIVALENT FOR THE SERVICE IN THE THREE (3) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED US DOLLARS ($100 USD), WHICHEVER IS GREATER.
            </div>
          </div>
        </section>

        {/* 8. Governing Law and Dispute Resolution */}
        <section id="section-8" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-5 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              08
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Governing Law and Dispute Resolution
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            These Terms, their interpretation, and any disputes arising out of or in connection with your use of Urivalent shall be governed by, construed, and enforced in accordance with the laws of the <strong>Republic of Kenya</strong>, without regard to its conflict of law principles.
          </p>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            Any legal suit, action, or proceeding arising out of or related to these Terms or the Urivalent platform shall be instituted exclusively in the competent courts located in <strong>Nairobi, Kenya</strong>. You hereby irrevocably submit to the personal jurisdiction and venue of such courts and waive any objection based on an inconvenient forum.
          </p>

          {/* Contact and Legal Inquiries */}
          <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-5 sm:p-6 space-y-2 mt-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#164A41]">
              Contact and Legal Inquiries
            </div>
            <p className="text-xs sm:text-sm text-[#4D774E] leading-relaxed">
              For questions regarding these Terms and Conditions or to request commercial API licensing, please direct inquiries to the legal compliance team via the official Urivalent administrative channels:
            </p>
            <div className="pt-2">
              <a
                href="mailto:contact@urivalent.tech"
                className="bg-[#164A41] hover:bg-[#0C241C] text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>contact@urivalent.tech</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================== */}
      {/* FOOTER — SLEEK DIRECTORY & SUBSCRIBE PIPELINE                      */}
      {/* ================================================================== */}
      <footer className="bg-[#0C241C] border-t border-[#9DC88D]/15 pt-10 sm:pt-14 pb-8 px-6 sm:px-10 lg:px-16 text-white mt-auto">
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

          {/* Column 2: Redirect Links rearranged into a list (3 cols) */}
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
                <Link href="/about" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px]">›</span>
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
                <Link href="/terms" className="text-[#F1B24A] font-bold hover:underline inline-flex items-center gap-1.5">
                  <span className="text-[#F1B24A] text-[10px]">›</span>
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

          {/* Column 3: Subscribe form just beside the redirect links (5 cols) */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
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

