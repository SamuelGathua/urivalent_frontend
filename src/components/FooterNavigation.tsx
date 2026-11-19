"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterNavigation() {
  const pathname = usePathname();
  const [showAdmin, setShowAdmin] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSecretTrigger = () => {
    clickCount.current += 1;

    // Reset the count if they take too long between clicks (800ms)
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 800);

    // If clicked 3 times rapidly, toggle Admin Console link visibility
    if (clickCount.current >= 3) {
      setShowAdmin((prev) => !prev);
      clickCount.current = 0;
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Overview", isMatch: pathname === "/" },
    { href: "/about", label: "About", isMatch: pathname === "/about" },
    { href: "/feeds", label: "Live Feeds", isMatch: pathname === "/feeds" },
    { href: "/terms", label: "Terms & Conditions", isMatch: pathname === "/terms" },
    { href: "/privacy", label: "Privacy Policy", isMatch: pathname === "/privacy" },
    { href: "/contact", label: "Contact Desk", isMatch: pathname === "/contact" },
  ];

  return (
    <div className="md:col-span-3">
      {/* The Trigger: Triple-click / tap this word to toggle visibility */}
      <p
        onClick={handleSecretTrigger}
        className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F1B24A] font-semibold block mb-3 select-none cursor-default active:opacity-80 transition-opacity"
        title="" // ensures no desktop "interactive" hover titles appear
      >
        NAVIGATION
      </p>

      <ul className="space-y-2 text-xs font-mono text-white/80">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${
                link.isMatch ? "text-[#F1B24A] font-bold" : ""
              }`}
            >
              <span
                className={`text-[10px] ${
                  link.isMatch ? "text-[#F1B24A]" : "text-white/30"
                }`}
              >
                ›
              </span>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}

        {/* Hidden Admin Link - revealed by triple click / tap on NAVIGATION */}
        {showAdmin && (
          <li className="transition-all duration-300 animate-in fade-in">
            <Link
              href="/admin"
              className="text-[#F1B24A] hover:underline font-bold inline-flex items-center gap-1.5"
            >
              <span className="text-[#F1B24A]/70 text-[10px]">›</span>
              <span>Admin Console ↗</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
