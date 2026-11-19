"use client";

import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";
import FooterNavigation from "@/components/FooterNavigation";

export default function Footer() {
  return (
    <footer className="bg-[#0C241C] border-t border-[#9DC88D]/15 pt-10 sm:pt-14 pb-8 px-6 sm:px-10 lg:px-16 text-white mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
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

        {/* Column 2: Redirect Links with Secret Gesture Trigger (3 cols) */}
        <FooterNavigation />

        {/* Column 3: Subscribe form (5 cols) */}
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
  );
}
