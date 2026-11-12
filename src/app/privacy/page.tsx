"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";

export default function PrivacyPage() {
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

  const usageCategories = [
    {
      category: "Pipeline Delivery",
      purpose: "Generating, filtering, and delivering tailored AI intelligence feeds.",
      operation: "Automates context retrieval and output curation.",
    },
    {
      category: "Analytics & Tuning",
      purpose: "Monitoring system load, latency, and pipeline efficiency.",
      operation: "Refines algorithmic relevance and service performance.",
    },
    {
      category: "Security & Integrity",
      purpose: "Detecting unauthorized API usage, rate-limiting violations, and abuse.",
      operation: "Maintains structural safety across nodes.",
    },
    {
      category: "Account Management",
      purpose: "Administering subscriptions, billing, and system notifications.",
      operation: "Facilitates administrative communications.",
    },
  ];

  const userRights = [
    {
      title: "Right to Access",
      desc: "You may request confirmation of whether we process your personal data and obtain a copy of the specific information stored.",
    },
    {
      title: "Right to Rectification",
      desc: "You may request the correction or updating of inaccurate, incomplete, or outdated personal information.",
    },
    {
      title: "Right to Erasure (\"Right to be Forgotten\")",
      desc: "You may request the permanent deletion of your personal data, subject to legal retention obligations.",
    },
    {
      title: "Right to Object & Restrict",
      desc: "You may object to the processing of your data or request that we restrict processing under specific operational scenarios.",
    },
    {
      title: "Data Portability",
      desc: "You have the right to receive your personal data in a structured, commonly used, and machine-readable format.",
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
            <Link
              href="/terms"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Terms
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
            alt="Urivalent Privacy Architecture"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.18em] text-[#7CE5B4] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Privacy Architecture &amp; Data Protection</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-4 leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Privacy Policy<span className="text-[#F1B24A]">.</span>
          </h1>

          <p className="text-base sm:text-xl text-white/85 font-light leading-relaxed mb-6">
            Autonomous Pipeline Data Handling, Protection Standards, and Compliance with the Kenyan Data Protection Act, 2019
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/90">
            <span className="bg-[#0A1D16]/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full shadow-2xs">
              Statutory Basis: <strong className="text-white">Kenyan Data Protection Act, 2019</strong>
            </span>
            <span className="bg-[#0A1D16]/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full shadow-2xs">
              Global Standards: <strong className="text-white">GDPR Compatible</strong>
            </span>
            <span className="bg-[#0A1D16]/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full shadow-2xs">
              Last Updated: <strong className="text-white">Nov 10, 2026 12:00 AM GMT+3</strong>
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
            Policy Sections Quick Navigation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <a href="#section-1" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>1. Information We Collect</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-2" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>2. How We Use Your Information</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-3" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>3. Information Sharing & Disclosure</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-4" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>4. Cookies & Tracking Technologies</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-5" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>5. Data Security Safeguards</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-6" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>6. User Data Rights</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-7" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>7. Policy Modifications</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
            <a href="#section-8" className="p-2 rounded-lg hover:bg-[#FAF9F5] hover:text-[#F1B24A] transition-colors flex items-center justify-between">
              <span>8. Contact & Compliance Inquiries</span>
              <span className="text-gray-300">&rarr;</span>
            </a>
          </div>
        </nav>

        {/* Preamble / Introduction */}
        <section className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-8 shadow-sm text-sm sm:text-base text-[#4D774E] leading-relaxed space-y-3">
          <p>
            This Privacy Policy describes how <strong>Urivalent</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), an autonomous AI intelligence pipeline, collects, uses, processes, and protects your information when you interact with our platform, API services, and associated applications.
          </p>
          <p>
            We are committed to processing personal data in accordance with global privacy principles and the <strong>Kenyan Data Protection Act, 2019</strong>.
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section id="section-1" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-5 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              01
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Information We Collect
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            To operate the Urivalent autonomous pipeline and deliver personalized, high-integrity intelligence feeds, we process minimal and necessary data categories:
          </p>

          <div className="space-y-4 pt-1">
            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-5 space-y-2">
              <h3 className="font-mono font-bold text-xs sm:text-sm text-[#164A41] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F1B24A]"></span>
                A. Account Information
              </h3>
              <p className="text-xs sm:text-sm text-[#4D774E] leading-relaxed">
                When you register for an account or integrate with our pipeline, we collect identity and credential data, including:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4D774E] space-y-1">
                <li>Full name and primary contact details (email address).</li>
                <li>Authentication credentials, access keys, and tokens.</li>
                <li>Organizational affiliation and user role preferences.</li>
              </ul>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-5 space-y-2">
              <h3 className="font-mono font-bold text-xs sm:text-sm text-[#164A41] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F1B24A]"></span>
                B. Usage Data & Pipeline Metrics
              </h3>
              <p className="text-xs sm:text-sm text-[#4D774E] leading-relaxed">
                Our autonomous engine monitors operational metadata to optimize delivery efficiency, including:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4D774E] space-y-1">
                <li>Interaction logs, query parameters, and intelligence feed preferences.</li>
                <li>Timestamp logs of automated data ingest, model calls, and payload deliveries.</li>
                <li>System throughput, latency metrics, and feature utilization patterns.</li>
              </ul>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-5 space-y-2">
              <h3 className="font-mono font-bold text-xs sm:text-sm text-[#164A41] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F1B24A]"></span>
                C. Device & Network Data
              </h3>
              <p className="text-xs sm:text-sm text-[#4D774E] leading-relaxed">
                When accessing our web interface or API endpoints, automated systems collect technical telemetry:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4D774E] space-y-1">
                <li>Internet Protocol (IP) address and geographic region.</li>
                <li>Browser type, version, and operating system identifier.</li>
                <li>Network request headers, response metrics, and routing paths.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. How We Use Your Information */}
        <section id="section-2" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-6 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              02
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              How We Use Your Information
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            Urivalent utilizes collected data solely for legitimate operational, security, and service development purposes:
          </p>

          <div className="border border-[#164A41]/15 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-[#0C241C] text-white text-[11px] font-mono font-bold uppercase tracking-wider px-4 sm:px-6 py-3 grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 sm:col-span-3">Category</div>
              <div className="col-span-12 sm:col-span-5">Primary Purpose</div>
              <div className="col-span-12 sm:col-span-4">System Operation</div>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {usageCategories.map((item) => (
                <div key={item.category} className="px-4 sm:px-6 py-3.5 grid grid-cols-12 gap-3 items-center text-xs hover:bg-[#FAF9F5] transition-colors">
                  <div className="col-span-12 sm:col-span-3 font-bold text-[#164A41] font-mono">
                    {item.category}
                  </div>
                  <div className="col-span-12 sm:col-span-5 text-[#4D774E]">
                    {item.purpose}
                  </div>
                  <div className="col-span-12 sm:col-span-4 font-mono text-[11px] text-[#F1B24A] font-bold">
                    {item.operation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Information Sharing and Disclosure */}
        <section id="section-3" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-6 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              03
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Information Sharing and Disclosure
            </h2>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-emerald-950 font-mono text-xs leading-relaxed space-y-1">
            <div className="font-bold uppercase tracking-wider text-emerald-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Zero-Sale Commitment
            </div>
            <p>
              We maintain a strict posture regarding third-party data access. We strictly do not sell, rent, trade, or monetize your personal information or telemetry data to third parties under any circumstances.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-[#164A41] uppercase tracking-wider">
              Third-Party Infrastructure Services
            </h3>
            <p className="text-xs sm:text-sm text-[#4D774E] leading-relaxed">
              To ensure resilient, high-availability autonomous operations, Urivalent relies on vetted infrastructure providers who act strictly as data processors:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-[#4D774E] space-y-1.5">
              <li>
                <strong>Cloudflare:</strong> Content delivery network (CDN), DDoS mitigation, and edge security routing.
              </li>
              <li>
                <strong>Render:</strong> Cloud hosting, pipeline server execution, and deployment infrastructure.
              </li>
            </ul>
            <p className="text-xs text-[#4D774E] leading-relaxed pt-1">
              These providers process data strictly on our behalf, bound by data processing agreements requiring compliance with industry-standard privacy and security measures.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-[#164A41] uppercase tracking-wider">
              Legal Requirements
            </h3>
            <p className="text-xs sm:text-sm text-[#4D774E] leading-relaxed">
              We may disclose information if required to do so by law, court order, or governmental regulation, or if such disclosure is necessary to comply with a valid legal process served upon us or to protect the rights, property, or safety of Urivalent, its users, or the public.
            </p>
          </div>
        </section>

        {/* 4. Cookies and Tracking Technologies */}
        <section id="section-4" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-4 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              04
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Cookies and Tracking Technologies
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            Urivalent uses essential cookies and similar lightweight web technologies necessary for technical platform operation:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px]">
                ● Essential Cookies
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Required for user authentication, session security, and state persistence across pipeline requests.
              </p>
            </div>
            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
              <div className="font-bold font-mono text-[#164A41] uppercase tracking-wider text-[11px]">
                ● Performance Telemetry
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Anonymized, aggregate session cookies to monitor edge server performance and network routing integrity.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#4D774E] leading-relaxed pt-2">
            You can manage or disable non-essential cookie preferences via your web browser settings, though disabling essential session cookies may impair the functionality of the user interface.
          </p>
        </section>

        {/* 5. Data Security */}
        <section id="section-5" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-4 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              05
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Data Security Standards
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            We implement rigorous technical and organizational security controls to safeguard data against unauthorized access, alteration, disclosure, or destruction:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm pt-2">
            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1.5">
              <div className="font-mono font-bold text-[#164A41] uppercase tracking-wider text-[11px]">
                Encryption Standards
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Data in transit is secured using Transport Layer Security (TLS 1.3). Data at rest is encrypted using AES-256 standards across database clusters and storage volumes.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1.5">
              <div className="font-mono font-bold text-[#164A41] uppercase tracking-wider text-[11px]">
                Access Control
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                System access follows the principle of least privilege, requiring multi-factor authentication (MFA) and explicit authorization for backend access.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1.5">
              <div className="font-mono font-bold text-[#164A41] uppercase tracking-wider text-[11px]">
                Automated Safeguards
              </div>
              <p className="text-[#4D774E] leading-relaxed">
                Continuous security monitoring, vulnerability scanning, and isolated container environments protect the pipeline core.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#4D774E] leading-relaxed pt-1">
            While no electronic transmission or storage system can be guaranteed as 100% secure, we continuously evaluate and update our security posture to mitigate emerging risks.
          </p>
        </section>

        {/* 6. User Data Rights */}
        <section id="section-6" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-5 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              06
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              User Data Rights
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            Under the <strong>Kenyan Data Protection Act, 2019</strong> (and applicable global privacy laws such as GDPR where relevant), you possess specific legal rights regarding your personal data held by Urivalent:
          </p>

          <div className="space-y-3 pt-1">
            {userRights.map((r) => (
              <div key={r.title} className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 space-y-1">
                <div className="font-mono font-bold text-xs text-[#164A41] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
                  {r.title}
                </div>
                <p className="text-xs sm:text-sm text-[#4D774E] leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#FAF9F5] border-l-4 border-[#F1B24A] p-4 rounded-r-xl text-xs font-mono text-[#164A41] leading-relaxed">
            To exercise any of these rights, please submit a formal request to our Data Protection Officer using the contact details provided below.
          </div>
        </section>

        {/* 7. Changes to This Privacy Policy */}
        <section id="section-7" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-4 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              07
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Changes to This Privacy Policy
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            We may update this Privacy Policy periodically to reflect changes in our autonomous architecture, regulatory obligations, or service features. Material updates will be notified via prominent announcements on our platform interface or delivered directly to account administrators via email prior to taking effect. The &ldquo;Last Updated&rdquo; date at the top of this document indicates the latest revision.
          </p>
        </section>

        {/* 8. Contact Information */}
        <section id="section-8" className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-10 shadow-sm space-y-5 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-[#164A41]/10 pb-3">
            <span className="bg-[#164A41] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              08
            </span>
            <h2
              className="text-xl sm:text-2xl font-medium text-[#164A41]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Contact Information
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4D774E] leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please reach out to us:
          </p>

          <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-5 sm:p-6 space-y-3">
            <div className="space-y-1.5 text-xs sm:text-sm text-[#164A41]">
              <div>
                <strong>Data Protection Officer / Privacy Team:</strong>{" "}
                <span className="font-mono text-[#4D774E]">Urivalent Compliance</span>
              </div>
              <div>
                <strong>Email:</strong>{" "}
                <a href="mailto:contact@urivalent.tech" className="text-[#F1B24A] hover:underline font-mono font-bold">
                  contact@urivalent.tech
                </a>
              </div>
              <div>
                <strong>Primary Legal Venue:</strong>{" "}
                <span className="font-mono text-[#4D774E]">Nairobi, Kenya</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="mailto:contact@urivalent.tech"
                className="bg-[#164A41] hover:bg-[#0C241C] text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Submit Privacy Inquiry</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================== */}
      {/* FOOTER — EXACT MATCH TO LANDING PAGE (LUXURIOUS OBSIDIAN EMERALD)  */}
      {/* ================================================================== */}
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
                <Link href="/terms" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px]">›</span>
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#F1B24A] font-bold hover:underline inline-flex items-center gap-1.5">
                  <span className="text-[#F1B24A] text-[10px]">›</span>
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

