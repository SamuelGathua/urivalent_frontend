"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";

interface MarketStock {
  symbol: string;
  ticker?: string;
  name: string;
  category: string;
  last: number | null;
  close_price?: number;
  change: number | null;
  daily_change_pct?: number;
  change_pct: number | null;
  five_day_trend_pct?: number;
  volume_anomaly?: number;
  is_private: boolean;
  private_note?: string | null;
  tradingview_url?: string | null;
  yahoo_url?: string | null;
}

interface MarketTicker {
  ticker: string;
  close_price: number;
  daily_change_pct: number;
  five_day_trend_pct?: number;
  change?: number;
  tradingview_url?: string;
  yahoo_url?: string;
}

interface SourceLink {
  title?: string;
  link: string;
  source: string;
  badge?: string;
}

interface IntelItem {
  id?: number;
  cluster_id?: string;
  pillar_category: string;
  primary_entity: string;
  headline: string;
  what_happened: string;
  technical_summary: string;
  strategic_implication: string;
  hype_vs_substance: string;
  signal_score: number;
  parsed_sources?: SourceLink[];
  published_at?: string;
}

interface RepoSnapshot {
  repo_name: string;
  repo_url: string;
  language: string;
  stars_gained: number;
  total_stars: number;
  description: string;
}

interface PaperSnapshot {
  title: string;
  url: string;
  upvotes?: number;
  summary: string;
  source: string;
}

interface FeedData {
  status: string;
  metadata: {
    service: string;
    formatted_date: string;
    greeting: string;
    logo_url: string;
    total_arxiv_count: number;
  };
  market_tickers: MarketTicker[];
  market_categories?: Record<string, MarketStock[]>;
  tier1_items: IntelItem[];
  pillar_groups: Record<string, IntelItem[]>;
  trending_repos: RepoSnapshot[];
  trending_papers: PaperSnapshot[];
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.urivalent.tech").replace(/\/$/, "");

const CATEGORY_ORDER = [
  "Silicon & Nanotech",
  "Energy & Infra (including Space & Power)",
  "Models & Research (including Autonomous AI)",
  "Bio-Intelligence & Medicine",
  "Agents & Tooling (including Embodied Robotics)",
  "Capital & Markets",
  "Policy & Sovereignty (Defense & State Tech)",
];

const STOCK_BADGES: Record<string, { bg: string; text: string; label: string; exchange: string }> = {
  NVDA: { bg: "bg-emerald-600", text: "text-white", label: "NV", exchange: "NASDAQ" },
  ASML: { bg: "bg-indigo-600", text: "text-white", label: "AS", exchange: "NASDAQ" },
  TSM: { bg: "bg-blue-600", text: "text-white", label: "TS", exchange: "NYSE" },
  ARM: { bg: "bg-cyan-600", text: "text-white", label: "AR", exchange: "NASDAQ" },
  CEG: { bg: "bg-amber-600", text: "text-white", label: "CE", exchange: "NASDAQ" },
  VRT: { bg: "bg-emerald-700", text: "text-white", label: "VR", exchange: "NYSE" },
  SPCX: { bg: "bg-rose-700", text: "text-white", label: "SX", exchange: "NASDAQ" },
  SPACEX: { bg: "bg-rose-700", text: "text-white", label: "SX", exchange: "NASDAQ" },
  NEE: { bg: "bg-green-700", text: "text-white", label: "NE", exchange: "NYSE" },
  GOOGL: { bg: "bg-blue-500", text: "text-white", label: "GO", exchange: "NASDAQ" },
  META: { bg: "bg-sky-600", text: "text-white", label: "ME", exchange: "NASDAQ" },
  MSFT: { bg: "bg-blue-700", text: "text-white", label: "MS", exchange: "NASDAQ" },
  TSLA: { bg: "bg-red-600", text: "text-white", label: "TS", exchange: "NASDAQ" },
  RXRX: { bg: "bg-purple-600", text: "text-white", label: "RX", exchange: "NASDAQ" },
  TEM: { bg: "bg-violet-600", text: "text-white", label: "TE", exchange: "NASDAQ" },
  SDGR: { bg: "bg-fuchsia-600", text: "text-white", label: "SD", exchange: "NASDAQ" },
  LLY: { bg: "bg-rose-600", text: "text-white", label: "LL", exchange: "NYSE" },
  NOW: { bg: "bg-slate-700", text: "text-white", label: "NW", exchange: "NYSE" },
  NET: { bg: "bg-orange-600", text: "text-white", label: "CF", exchange: "NYSE" },
  FIGURE: { bg: "bg-stone-700", text: "text-white", label: "FG", exchange: "PRIVATE" },
  PATH: { bg: "bg-sky-500", text: "text-white", label: "PA", exchange: "NYSE" },
  SFTBY: { bg: "bg-amber-700", text: "text-white", label: "SB", exchange: "OTC" },
  BX: { bg: "bg-zinc-700", text: "text-white", label: "BX", exchange: "NYSE" },
  COIN: { bg: "bg-blue-600", text: "text-white", label: "CB", exchange: "NASDAQ" },
  PLTR: { bg: "bg-slate-800", text: "text-white", label: "PL", exchange: "NASDAQ" },
  BAH: { bg: "bg-teal-700", text: "text-white", label: "BA", exchange: "NYSE" },
  ANDURIL: { bg: "bg-black", text: "text-white", label: "AN", exchange: "PRIVATE" },
  LMT: { bg: "bg-blue-900", text: "text-white", label: "LM", exchange: "NYSE" },
};

function formatCurrency(val: number | null | undefined): string {
  if (val === null || val === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function formatChangeAmount(val: number | null | undefined): string {
  if (val === null || val === undefined) return "—";
  const sign = val > 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}`;
}

function formatChangePct(val: number | null | undefined): string {
  if (val === null || val === undefined) return "—";
  const sign = val > 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}

export default function PublicDashboard() {
  const [data, setData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeroIdle, setIsHeroIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth floating navbar hide/show on scroll
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

  // Cinematic 5-Second Inactivity Fade on Hero Section (as done in landing page)
  useEffect(() => {
    const resetIdleTimer = () => {
      setIsHeroIdle(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (typeof window !== "undefined" && window.scrollY < window.innerHeight * 0.5) {
        idleTimerRef.current = setTimeout(() => {
          if (window.scrollY < window.innerHeight * 0.5) {
            setIsHeroIdle(true);
          }
        }, 5000);
      }
    };

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

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        let res: Response;
        try {
          res = await fetch(`${API_BASE_URL}/api/feed`, {
            cache: "no-store",
          });
          if (!res.ok && typeof window !== "undefined" && API_BASE_URL !== window.location.origin) {
            res = await fetch(`/api/feed`, { cache: "no-store" });
          }
        } catch {
          if (typeof window !== "undefined" && API_BASE_URL !== window.location.origin) {
            res = await fetch(`/api/feed`, { cache: "no-store" });
          } else {
            throw new Error(`Unable to reach intelligence API at ${API_BASE_URL}`);
          }
        }
        if (!res.ok) {
          throw new Error(`Intelligence feed returned HTTP ${res.status}`);
        }
        const json: FeedData = await res.json();
        setData(json);
        setError(null);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Failed to load feed:", err);
        setError(`Unable to connect to intelligence API (${errorMsg}). Please check the status of https://api.urivalent.tech.`);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    CATEGORY_ORDER.forEach((cat) => {
      next[cat] = true;
    });
    setCollapsedCategories(next);
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  // Filtered categories and stocks
  const marketCategories = data?.market_categories;

  const filteredCategories = useMemo(() => {
    if (!marketCategories) return {};
    const query = searchQuery.trim().toLowerCase();
    const result: Record<string, MarketStock[]> = {};

    Object.entries(marketCategories).forEach(([category, stocks]) => {
      if (selectedCategory !== "ALL" && selectedCategory !== category) {
        return;
      }
      const matchingStocks = stocks.filter((s) => {
        if (!query) return true;
        return (
          s.symbol.toLowerCase().includes(query) ||
          s.name.toLowerCase().includes(query) ||
          (s.category && s.category.toLowerCase().includes(query))
        );
      });

      if (matchingStocks.length > 0) {
        result[category] = matchingStocks;
      }
    });

    return result;
  }, [marketCategories, selectedCategory, searchQuery]);

  const totalTrackedCount = useMemo(() => {
    if (!marketCategories) return 0;
    return Object.values(marketCategories).reduce((acc, curr) => acc + curr.length, 0);
  }, [marketCategories]);

  // =========================================================================
  // 1. LOADING SCREEN — LUXURY GLASS DOCK & WARM IVORY PALETTE
  // =========================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#164A41] flex flex-col font-sans antialiased selection:bg-[#F1B24A] selection:text-[#164A41]">
        {/* Floating Glass Island Navigation Dock */}
        <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8">
          <div className="max-w-[1340px] mx-auto bg-[#0A1D16]/85 backdrop-blur-xl border border-white/[0.14] rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group min-h-[44px]">
              <div className="bg-white/[0.94] px-3.5 py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
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
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 pt-36">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#164A41]/15 border-t-[#F1B24A] animate-spin"></div>
              <div className="w-8 h-8 rounded-full bg-[#0A1D16] text-[#7CE5B4] text-[10px] font-mono font-bold flex items-center justify-center absolute">
                AI
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#F1B24A]">
                AUTONOMOUS INTEL CYCLE
              </div>
              <h2
                className="text-2xl sm:text-3xl font-medium text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Connecting to Frontier Feed
              </h2>
              <p className="text-xs sm:text-sm text-[#4D774E] max-w-sm mx-auto leading-relaxed">
                Aggregating real-time sovereign compute tickers, arXiv preprints, and verified priority intelligence.
              </p>
            </div>
          </div>
        </main>

        <footer className="bg-[#0C241C] border-t border-[#9DC88D]/15 py-4 px-6 text-white text-center text-xs font-mono text-white/60">
          &copy; 2026 Urivalent.
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 2. ERROR SCREEN — LUXURY GLASS DOCK & GRACEFUL FALLBACK
  // =========================================================================
  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#164A41] flex flex-col font-sans antialiased selection:bg-[#F1B24A] selection:text-[#164A41]">
        {/* Floating Glass Island Navigation Dock */}
        <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8">
          <div className="max-w-[1340px] mx-auto bg-[#0A1D16]/85 backdrop-blur-xl border border-white/[0.14] rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group min-h-[44px]">
              <div className="bg-white/[0.94] px-3.5 py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
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
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 pt-36">
          <div className="max-w-lg w-full bg-white border border-[#164A41]/10 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-[0_12px_40px_-8px_rgba(22,74,65,0.08)]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-rose-600 mb-1">
                Connection Standby
              </div>
              <h2
                className="text-2xl font-medium text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Unable to Connect to Intelligence API
              </h2>
            </div>
            <p className="text-xs text-[#4D774E] leading-relaxed max-w-sm mx-auto">
              {error}
            </p>
            <div className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 text-[11px] text-[#164A41] text-left font-mono space-y-1.5">
              <div className="font-bold text-[#F1B24A] uppercase tracking-wider mb-1">To start backend service:</div>
              <div>1. Open terminal in <code className="bg-black/5 px-1 py-0.5 rounded font-bold">urivalent_backend</code></div>
              <div>2. Run: <code className="bg-black/5 px-1 py-0.5 rounded font-bold">python main.py</code></div>
              <div>3. Click &ldquo;Retry Connection&rdquo; below.</div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-xs font-mono font-bold uppercase tracking-[0.14em] px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition active:scale-95 cursor-pointer"
              >
                Retry Connection
              </button>
              <Link
                href="/"
                className="bg-gray-100 hover:bg-gray-200 text-[#164A41] text-xs font-mono font-bold uppercase tracking-[0.14em] px-5 py-2.5 rounded-full transition"
              >
                Return Home
              </Link>
            </div>
          </div>
        </main>

        <footer className="bg-[#0C241C] border-t border-[#9DC88D]/15 py-4 px-6 text-white text-center text-xs font-mono text-white/60">
          &copy; 2026 Urivalent.
        </footer>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // =========================================================================
  // 3. MAIN DASHBOARD VIEW — FULL EDITORIAL EXPERIENCE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#164A41] flex flex-col font-sans antialiased selection:bg-[#F1B24A] selection:text-[#164A41]">
      {/* ================================================================== */}
      {/* FLOATING GLASS ISLAND NAVIGATION DOCK (MATCHING LANDING PAGE)      */}
      {/* ================================================================== */}
      <header
        className={`fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-700 ease-out ${
          navVisible && !isHeroIdle
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[1340px] mx-auto bg-[#0A1D16]/80 hover:bg-[#0A1D16]/90 backdrop-blur-xl border border-white/[0.14] rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6),0_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-between gap-3 sm:gap-4 transition-all">
          {/* Left: Brand Logo in luminous pearl pod for maximum contrast & luxury */}
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

          {/* Right: In-Feed Jump Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/75 overflow-x-auto">
            <a
              href="#watchlist"
              className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Watchlist
            </a>
            <a
              href="#priority"
              className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Breakthroughs
            </a>
            <a
              href="#sectors"
              className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Sectors
            </a>
            <a
              href="#radar"
              className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Radar
            </a>
          </nav>
        </div>
      </header>

      {/* ================================================================== */}
      {/* 1. CINEMATIC HERO SECTION                                          */}
      {/* ================================================================== */}
      <section className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] flex flex-col justify-center pt-24 sm:pt-28 pb-10 sm:pb-12 overflow-hidden">
        {/* Full-width Background Image: feeds_page.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/feeds_page.jpg"
            alt="Frontier Intelligence Vision"
            fill
            sizes="100vw"
            className="object-cover object-[70%_center] sm:object-center"
            priority
            quality={85}
          />
          {/* Very small, subtle dark gradient for depth and text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Container — Moved higher & centered */}
        <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Main Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-3 sm:mb-4 leading-[1.05] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Intelligence Feed<span className="text-[#F1B24A]">.</span>
            </h1>

            {/* Subtitle broken into 3 lines in theme mint color (#7CE5B4) */}
            <p className="text-base sm:text-xl lg:text-2xl text-[#7CE5B4] font-light leading-relaxed tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Autonomously tracking frontier models, silicon architecture,<br />
              sovereign compute infrastructure, agent tooling,<br />
              and capital markets.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. MAIN INTELLIGENCE FEED BODY                                     */}
      {/* ================================================================== */}
      <main className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-12 sm:space-y-16">

        {/* ================================================================= */}
        {/* SECTION: SOVEREIGN AI & COMPUTE MARKET WATCHLIST                  */}
        {/* ================================================================= */}
        <section id="watchlist" className="scroll-mt-28">
          <div className="bg-white/95 backdrop-blur-sm border border-[#164A41]/10 rounded-2xl shadow-[0_8px_30px_rgba(22,74,65,0.06)] overflow-hidden">
            {/* Watchlist Top Header */}
            <div className="bg-[#0C241C] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#9DC88D]/20">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#F1B24A] text-[#164A41] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Institutional Watchlist
                  </span>
                  <span className="text-xs text-[#9DC88D] font-mono">
                    24H Real-Time Equity & Capital Matrix
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-medium text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Sovereign AI & Compute Watchlist
                </h2>
                <p className="text-xs text-white/70 mt-1">
                  Tracking {totalTrackedCount} core assets across 7 sovereign frontier categories. Click any symbol for TradingView or Yahoo Finance.
                </p>
              </div>

              {/* Quick Actions / Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ticker or name..."
                    className="bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/50 text-xs px-3.5 py-2 pl-9 rounded-full border border-white/20 focus:outline-none focus:border-[#F1B24A] transition w-48 sm:w-60"
                  />
                  <svg
                    className="w-3.5 h-3.5 text-white/50 absolute left-3 top-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2 text-white/60 hover:text-white text-xs cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full border border-white/20 text-[11px] font-mono">
                  <button
                    onClick={expandAll}
                    className="px-2.5 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition font-medium cursor-pointer"
                    title="Expand all categories"
                  >
                    Expand
                  </button>
                  <span className="text-white/30">|</span>
                  <button
                    onClick={collapseAll}
                    className="px-2.5 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition font-medium cursor-pointer"
                    title="Collapse all categories"
                  >
                    Collapse
                  </button>
                </div>
              </div>
            </div>

            {/* Category Selector Tabs */}
            <div className="bg-[#FAF9F5] border-b border-[#164A41]/10 px-4 sm:px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-3 py-1.5 rounded-full font-mono font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === "ALL"
                    ? "bg-[#164A41] text-white shadow-sm"
                    : "text-[#4D774E] hover:bg-[#9DC88D]/20 hover:text-[#164A41]"
                }`}
              >
                All Sectors ({totalTrackedCount})
              </button>
              {CATEGORY_ORDER.map((cat) => {
                const count = data?.market_categories?.[cat]?.length || 0;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-mono font-bold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#164A41] text-white shadow-sm"
                        : "text-[#4D774E] hover:bg-[#9DC88D]/20 hover:text-[#164A41]"
                    }`}
                  >
                    <span>{cat.split(" (")[0]}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? "bg-[#F1B24A] text-[#164A41]" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Watchlist Table Body */}
            <div className="divide-y divide-gray-100">
              {/* Header Bar */}
              <div className="bg-[#F4F6F4] text-[#164A41] text-[11px] font-mono font-bold uppercase tracking-wider px-4 sm:px-6 py-2.5 grid grid-cols-12 items-center border-b border-[#164A41]/10 select-none">
                <div className="col-span-6 sm:col-span-5 flex items-center gap-1.5">
                  <span className="text-[#164A41]">Symbol</span>
                  <span className="text-[10px] font-normal text-gray-400 font-mono">(Asset / Co.)</span>
                </div>
                <div className="col-span-3 sm:col-span-2 text-right pr-2">
                  <span>Last</span>
                </div>
                <div className="col-span-3 sm:col-span-2 text-right pr-2">
                  <span>Chg</span>
                </div>
                <div className="hidden sm:block sm:col-span-2 text-right pr-2">
                  <span>Chg%</span>
                </div>
                <div className="hidden sm:block sm:col-span-1 text-right">
                  <span>Charts</span>
                </div>
              </div>

              {/* Categorized Stock Rows */}
              {Object.keys(filteredCategories).length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs font-mono">
                  No assets found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                CATEGORY_ORDER.map((category) => {
                  const stocks = filteredCategories[category];
                  if (!stocks || stocks.length === 0) return null;
                  const isCollapsed = collapsedCategories[category];

                  return (
                    <div key={category} className="border-b border-gray-100 last:border-b-0">
                      {/* Collapsible Category Header */}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full bg-[#FAFBF9] hover:bg-[#F2F5F2] px-4 sm:px-6 py-2 flex items-center justify-between text-left transition select-none group border-t border-gray-100 first:border-t-0 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-gray-400 group-hover:text-[#164A41] transition-transform duration-200 text-xs ${
                              isCollapsed ? "-rotate-90" : "rotate-0"
                            }`}
                          >
                            &#9660;
                          </span>
                          <span className="text-xs font-bold font-mono uppercase tracking-wider text-gray-700 group-hover:text-[#164A41]">
                            {category}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-gray-400">
                          {stocks.length} {stocks.length === 1 ? "asset" : "assets"}
                        </span>
                      </button>

                      {/* Stock List Rows */}
                      {!isCollapsed && (
                        <div className="divide-y divide-gray-50">
                          {stocks.map((stock) => {
                            const badge = STOCK_BADGES[stock.symbol] || {
                              bg: stock.is_private ? "bg-stone-700" : "bg-[#164A41]",
                              text: "text-white",
                              label: stock.symbol.slice(0, 2),
                              exchange: stock.is_private ? "PVT" : "US",
                            };

                            const isPositive = (stock.change_pct ?? stock.daily_change_pct ?? 0) > 0;
                            const isNegative = (stock.change_pct ?? stock.daily_change_pct ?? 0) < 0;

                            const tvUrl = stock.tradingview_url;
                            const yahooUrl = stock.yahoo_url;
                            const primaryUrl = tvUrl || yahooUrl || `https://finance.yahoo.com/quote/${stock.symbol}/`;

                            return (
                              <div
                                key={stock.symbol}
                                className="px-4 sm:px-6 py-3 grid grid-cols-12 items-center hover:bg-[#F9FCF9] transition text-xs group"
                              >
                                {/* Symbol Column */}
                                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                                  {/* Circular Badge */}
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0 shadow-xs ${badge.bg} ${badge.text}`}
                                  >
                                    {badge.label}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <a
                                        href={primaryUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-sm text-[#164A41] hover:text-[#0D9488] transition group-hover:underline flex items-center gap-1 font-mono"
                                        title={`Open ${stock.symbol} chart`}
                                      >
                                        <span>{stock.symbol}</span>
                                      </a>

                                      {/* Indicator */}
                                      <span
                                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                          stock.is_private
                                            ? "bg-stone-100 text-stone-700 border border-stone-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}
                                      >
                                        {stock.is_private ? "PVT" : badge.exchange === "NASDAQ" ? "D" : badge.exchange.slice(0, 2)}
                                      </span>

                                      <span className="text-gray-300 text-xs hidden sm:inline">&bull;</span>

                                      <span className="text-[11px] text-gray-500 truncate hidden md:inline max-w-[170px]">
                                        {stock.name}
                                      </span>
                                    </div>

                                    {/* Company name visible on mobile */}
                                    <div className="text-[11px] text-gray-400 truncate md:hidden">
                                      {stock.name}
                                    </div>
                                  </div>
                                </div>

                                {/* Last Price Column */}
                                <div className="col-span-3 sm:col-span-2 text-right pr-2 font-mono">
                                  {stock.is_private ? (
                                    <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                                      {stock.private_note || "Private"}
                                    </span>
                                  ) : (
                                    <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                      {formatCurrency(stock.last ?? stock.close_price)}
                                    </span>
                                  )}
                                </div>

                                {/* Chg (Absolute) Column */}
                                <div className="col-span-3 sm:col-span-2 text-right pr-2 font-mono">
                                  {stock.is_private ? (
                                    <span className="text-gray-400 text-xs">—</span>
                                  ) : (
                                    <div
                                      className={`font-semibold text-xs sm:text-sm ${
                                        isPositive
                                          ? "text-[#0D9488]"
                                          : isNegative
                                          ? "text-rose-600"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {formatChangeAmount(stock.change)}
                                    </div>
                                  )}

                                  {/* Mobile Chg% shown underneath Chg on small screens */}
                                  <div className="sm:hidden text-[10px] font-mono">
                                    {!stock.is_private && (
                                      <span
                                        className={`font-bold ${
                                          isPositive
                                            ? "text-[#0D9488]"
                                            : isNegative
                                            ? "text-rose-600"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {formatChangePct(stock.change_pct ?? stock.daily_change_pct)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Chg% Column (Desktop) */}
                                <div className="hidden sm:block sm:col-span-2 text-right pr-2 font-mono">
                                  {stock.is_private ? (
                                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase font-bold font-mono">
                                      Private
                                    </span>
                                  ) : (
                                    <span
                                      className={`font-bold text-xs sm:text-sm ${
                                        isPositive
                                          ? "text-[#0D9488]"
                                          : isNegative
                                          ? "text-rose-600"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {formatChangePct(stock.change_pct ?? stock.daily_change_pct)}
                                    </span>
                                  )}
                                </div>

                                {/* Direct Chart Links Column */}
                                <div className="hidden sm:flex sm:col-span-1 justify-end items-center gap-1.5">
                                  {tvUrl && (
                                    <a
                                      href={tvUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Open interactive TradingView chart"
                                      className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full bg-[#164A41]/10 hover:bg-[#164A41] text-[#164A41] hover:text-white transition"
                                    >
                                      TV
                                    </a>
                                  )}
                                  {yahooUrl && (
                                    <a
                                      href={yahooUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Open Yahoo Finance quote"
                                      className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full bg-[#F1B24A]/20 hover:bg-[#F1B24A] text-[#164A41] transition"
                                    >
                                      YF
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Watchlist Footer Note */}
            <div className="bg-[#FAFBF9] border-t border-[#164A41]/10 p-3.5 sm:p-4 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
                <span>Green indicates 24h positive move; Red indicates 24h pullback.</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="text-gray-400">Institutional Charting Powered by</span>
                <span className="font-bold text-[#164A41]">TradingView</span>
                <span className="text-gray-300">&bull;</span>
                <span className="font-bold text-[#164A41]">Yahoo Finance</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 1: PRIORITY INTELLIGENCE (TIER-1 BREAKTHROUGHS)           */}
        {/* ================================================================= */}
        <section id="priority" className="scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#164A41]/10 pb-3 mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F1B24A]/20 text-[#164A41] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <span>Tier 1 Verification</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-medium text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Priority Breakthroughs
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              High-Impact Verified Signal
            </span>
          </div>

          {data.tier1_items && data.tier1_items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {data.tier1_items.map((item, idx) => (
                <article
                  key={item.id || item.cluster_id || idx}
                  className="bg-white rounded-2xl border border-[#164A41]/10 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(22,74,65,0.06)] hover:shadow-[0_12px_36px_-4px_rgba(22,74,65,0.1)] transition-all hover:border-[#F1B24A]/40 group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#164A41] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {item.pillar_category}
                      </span>
                      <span className="bg-[#9DC88D]/25 text-[#164A41] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                        {item.primary_entity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium text-[#4D774E] border border-[#9DC88D]/50 px-2.5 py-1 rounded-full bg-[#FAF9F5]">
                        {item.hype_vs_substance}
                      </span>
                    </div>
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-medium text-[#164A41] leading-snug mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {item.headline}
                  </h3>

                  <p className="text-sm sm:text-base text-[#4D774E] font-light leading-relaxed mb-5">
                    {item.what_happened}
                  </p>

                  <div className="bg-[#FAF9F5] border-l-4 border-[#F1B24A] p-4 sm:p-5 rounded-r-xl space-y-2.5 mb-5 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-[#164A41] font-mono uppercase tracking-wider text-[11px]">
                        Technical Summary:
                      </span>
                      <span className="text-[#164A41] ml-2 leading-relaxed">{item.technical_summary}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#F1B24A] font-mono uppercase tracking-wider text-[11px]">
                        Strategic Implication:
                      </span>
                      <span className="text-[#164A41] ml-2 leading-relaxed">{item.strategic_implication}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 text-xs gap-3">
                    <span className="text-gray-400 font-mono text-[11px]">
                      Published: {item.published_at ? item.published_at.slice(0, 10) : "Recent"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.parsed_sources && item.parsed_sources.length > 0 ? (
                        item.parsed_sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F1B24A]/15 hover:bg-[#F1B24A] text-[#164A41] font-mono font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                          >
                            <span>Read on {src.source}</span>
                            <span>↗</span>
                          </a>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 font-mono">Verified Intelligence</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#164A41]/10 rounded-2xl p-8 text-center text-sm text-[#4D774E] font-mono">
              No Priority Intelligence items recorded in this cycle.
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* SECTION 2: SECTOR BREAKDOWN                                       */}
        {/* ================================================================= */}
        <section id="sectors" className="scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#164A41]/10 pb-3 mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#9DC88D]/20 text-[#164A41] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <span>Domain Breakdown</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-medium text-[#164A41]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Sector-by-Sector Intelligence
              </h2>
            </div>
            <span className="text-xs text-[#4D774E] font-mono">Categorical Matrix</span>
          </div>

          <div className="space-y-8 sm:space-y-10">
            {Object.entries(data.pillar_groups || {}).map(([pillarName, items]) => {
              if (!items || items.length === 0) return null;
              return (
                <div key={pillarName} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#164A41]"></span>
                    <h3 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-[#164A41]">
                      {pillarName}
                    </h3>
                    <span className="text-xs font-mono text-gray-400">({items.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-[#164A41]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(22,74,65,0.04)] hover:shadow-md hover:border-[#F1B24A]/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span className="text-[10px] font-mono font-bold uppercase bg-[#164A41] text-white px-2.5 py-0.5 rounded-full">
                              {item.primary_entity}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {item.hype_vs_substance}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-[#164A41] mb-2 leading-snug">
                            {item.headline}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#4D774E] font-light leading-relaxed mb-4">
                            {item.what_happened}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-gray-400 text-[10px]">Verified Source</span>
                          <div className="flex gap-2">
                            {item.parsed_sources?.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#F1B24A] hover:text-[#164A41] font-bold uppercase transition flex items-center gap-1"
                              >
                                <span>{src.source}</span>
                                <span>↗</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3: REPOSITORY & RESEARCH RADAR                            */}
        {/* ================================================================= */}
        <section id="radar" className="scroll-mt-28">
          <div className="bg-white/95 backdrop-blur-sm border border-[#164A41]/10 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(22,74,65,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#164A41]/10 pb-4 mb-6 gap-2">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#164A41]/10 text-[#164A41] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  <span>Open Source & Preprints</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-medium text-[#164A41]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Repository & Research Radar
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                Code Velocity & ArXiv Signals
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* GitHub Repos */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#164A41] border-b border-gray-100 pb-2.5 mb-3 flex items-center justify-between">
                  <span>⭐ High-Velocity Repositories</span>
                  <span className="text-gray-400 font-normal">GitHub</span>
                </h3>
                <div className="space-y-3">
                  {data.trending_repos?.map((repo) => (
                    <div
                      key={repo.repo_name}
                      className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 shadow-2xs hover:border-[#F1B24A] hover:bg-white transition"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <a
                          href={repo.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-bold text-[#164A41] hover:text-[#F1B24A] transition font-mono"
                        >
                          {repo.repo_name} ↗
                        </a>
                        <span className="text-[11px] font-mono font-bold text-[#4D774E]">
                          ★ {repo.total_stars.toLocaleString()} (+{repo.stars_gained})
                        </span>
                      </div>
                      <p className="text-xs text-[#4D774E] leading-relaxed line-clamp-2">
                        {repo.description}
                      </p>
                      <div className="text-[10px] text-gray-400 mt-2 font-mono uppercase">
                        Language: {repo.language}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Preprints */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#164A41] border-b border-gray-100 pb-2.5 mb-3 flex items-center justify-between">
                  <span>📑 Trending Preprints</span>
                  <span className="text-gray-400 font-normal">arXiv & HF</span>
                </h3>
                <div className="space-y-3">
                  {data.trending_papers?.map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF9F5] border border-[#164A41]/10 rounded-xl p-4 shadow-2xs hover:border-[#F1B24A] hover:bg-white transition"
                    >
                      <div className="mb-1.5">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#164A41] hover:text-[#F1B24A] transition leading-snug block"
                        >
                          {p.title} ↗
                        </a>
                      </div>
                      <p className="text-[11px] text-[#4D774E] line-clamp-2 mb-2 leading-relaxed">
                        {p.summary}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[#F1B24A] font-bold uppercase font-mono">
                        <span>{p.source}</span>
                        {p.upvotes ? <span>▲ {p.upvotes} Upvotes</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                <Link href="/feeds" className="hover:text-white text-[#F1B24A] font-bold transition-colors inline-flex items-center gap-1.5">
                  <span className="text-[#F1B24A] text-[10px]">›</span>
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
