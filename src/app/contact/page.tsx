"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import SubscribeForm from "@/components/SubscribeForm";

export default function ContactPage() {
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

  return (
    <div className="min-h-screen bg-[#0A1D16] text-white flex flex-col font-sans antialiased selection:bg-[#F1B24A] selection:text-[#164A41]">
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

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-[11px] font-mono tracking-wider text-white/80">
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
              Feeds
            </Link>
            <Link
              href="/terms"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-full text-[#F1B24A] bg-white/[0.08] font-bold"
            >
              Contact
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
      {/* HERO SECTION WITH contact_page.jpg BACKGROUND IMAGE (JUST ABOVE FORM)*/}
      {/* ================================================================== */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-center pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden">
        {/* Background Image: contact_page.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact_page.jpg"
            alt="Urivalent Contact & Institutional Outreach"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Subtle gradient overlay to ensure crystal clear typography */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1D16]/80 via-[#0A1D16]/50 to-[#0A1D16]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-4 leading-[1.08]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Direct Institutional Outreach<span className="text-[#F1B24A]">.</span>
          </h1>

          <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-2xl mx-auto mb-6">
            Inquire about custom sovereign compute intelligence feeds, research synthesis, enterprise telemetry integrations, or technical partnerships.
          </p>

          {/* Telemetry / Direct Channel Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-white/90 max-w-2xl mx-auto">
            <a
              href="mailto:contact@urivalent.tech"
              className="bg-[#0A1D16]/65 backdrop-blur-md hover:bg-[#0A1D16]/85 border border-white/20 px-4 py-2 rounded-full transition-colors inline-flex items-center gap-2"
            >
              <span className="text-[#F1B24A]">Desk:</span>
              <span className="text-white font-medium">contact@urivalent.tech</span>
            </a>
            <span className="bg-[#0A1D16]/65 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full inline-flex items-center gap-2">
              <span className="text-[#9DC88D]">Response SLA:</span>
              <span className="text-white font-medium">&lt; 24 Hours</span>
            </span>
            <span className="bg-[#0A1D16]/65 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full inline-flex items-center gap-2">
              <span className="text-[#F1B24A]">Status:</span>
              <span className="text-white font-medium">24/7 Intake Active</span>
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FORM SECTION (IMMEDIATELY BELOW HERO)                              */}
      {/* ================================================================== */}
      <main className="relative z-10 -mt-6 sm:-mt-10 pb-20 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-xl mx-auto">
          <ContactForm />
        </div>
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
                <Link href="/contact" className="hover:text-white text-[#F1B24A] font-bold transition-colors inline-flex items-center gap-1.5">
                  <span className="text-[#F1B24A] text-[10px]">›</span>
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
