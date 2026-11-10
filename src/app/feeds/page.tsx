"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

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

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

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

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        let res: Response;
        try {
          res = await fetch(`${API_BASE_URL}/api/feed`, {
            cache: "no-store",
          });
        } catch (initialErr) {
          if (typeof window !== "undefined" && API_BASE_URL !== window.location.origin) {
            res = await fetch(`/api/feed`, { cache: "no-store" });
          } else {
            throw initialErr;
          }
        }
        if (!res.ok) {
          throw new Error(`Backend returned HTTP ${res.status}`);
        }
        const json: FeedData = await res.json();
        setData(json);
        setError(null);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Failed to load feed:", err);
        setError(`Unable to connect to intelligence API (${errorMsg}). Please ensure the FastAPI backend is running on port 8000.`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#164A41] flex flex-col font-sans antialiased">
        <header className="bg-[#164A41] border-b-4 border-[#F1B24A] shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center">
                <img
                  src="/urivalent_logo.png"
                  alt="Urivalent Logo"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <span className="text-xs font-bold tracking-widest uppercase text-[#9DC88D] border-l border-[#9DC88D]/40 pl-3">
                Frontier AI Intelligence
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F1B24A] border-r-transparent"></div>
            <div className="text-sm font-bold uppercase tracking-widest text-[#164A41]">
              Loading Intelligence Feed & Real-time Market Matrix...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-white text-[#164A41] flex flex-col font-sans antialiased">
        <header className="bg-[#164A41] border-b-4 border-[#F1B24A] shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center">
                <img
                  src="/urivalent_logo.png"
                  alt="Urivalent Logo"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `${API_BASE_URL}/assets/urivalent_logo.png`;
                  }}
                />
              </Link>
              <span className="text-xs font-bold tracking-widest uppercase text-[#9DC88D] border-l border-[#9DC88D]/40 pl-3">
                Frontier AI Intelligence
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-[#F8FAF8] border border-red-300 rounded-xl p-6 text-center space-y-4 shadow-sm">
            <div className="text-red-600 font-bold text-sm uppercase tracking-wider">
              Unable to Connect to Intelligence API
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{error}</p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-900 text-left font-mono">
              <strong>To start the backend server:</strong><br />
              1. Open terminal in <code className="bg-amber-100 px-1 py-0.5 rounded">urivalent_backend</code><br />
              2. Run: <code className="bg-amber-100 px-1 py-0.5 rounded">python main.py</code><br />
              3. Click &quot;Retry Connection&quot; below.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#164A41] hover:bg-[#0F352E] text-white text-xs uppercase font-bold px-4 py-2 rounded shadow transition"
            >
              Retry Connection
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-[#164A41] flex flex-col font-sans antialiased">
      {/* HEADER */}
      <header className="bg-[#164A41] border-b-4 border-[#F1B24A] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <img
                src="/urivalent_logo.png"
                alt="Urivalent Logo"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${API_BASE_URL}/assets/urivalent_logo.png`;
                }}
              />
            </Link>
            <span className="text-xs font-bold tracking-widest uppercase text-[#9DC88D] hidden md:inline-block border-l border-[#9DC88D]/40 pl-3">
              Frontier AI Intelligence
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#9DC88D] uppercase font-bold tracking-wider">
              {data?.metadata.formatted_date || "Live Feed"}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN INTELLIGENCE FEED */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        {/* ================================================================= */}
        {/* SECTION: SOVEREIGN AI & COMPUTE MARKET WATCHLIST                  */}
        {/* ================================================================= */}
        <section id="watchlist" className="scroll-mt-20">
          <div className="bg-white border-2 border-[#164A41]/15 rounded-xl shadow-sm overflow-hidden">
            {/* Watchlist Top Header */}
            <div className="bg-[#164A41] text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1B24A]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#F1B24A] text-[#164A41] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    Institutional Watchlist
                  </span>
                  <span className="text-xs text-[#9DC88D] font-mono">
                    24H Real-Time Equity & Capital Matrix
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                  Sovereign AI & Compute Watchlist
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  Tracking {totalTrackedCount} core assets across 7 sovereign frontier categories. Click any symbol for TradingView or Yahoo Finance.
                </p>
              </div>

              {/* Quick Actions / Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ticker or name..."
                    className="bg-white/10 text-white placeholder-white/50 text-xs px-3 py-1.5 pl-8 rounded border border-white/20 focus:outline-none focus:border-[#F1B24A] focus:bg-white/20 transition w-44 sm:w-56"
                  />
                  <svg
                    className="w-3.5 h-3.5 text-white/50 absolute left-2.5 top-2.5"
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
                      className="absolute right-2 top-2 text-white/60 hover:text-white text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded border border-white/20 text-[11px]">
                  <button
                    onClick={expandAll}
                    className="px-2 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition font-medium"
                    title="Expand all categories"
                  >
                    Expand All
                  </button>
                  <span className="text-white/30">|</span>
                  <button
                    onClick={collapseAll}
                    className="px-2 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition font-medium"
                    title="Collapse all categories"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            </div>

            {/* Category Selector Tabs */}
            <div className="bg-[#F8FAF8] border-b border-[#9DC88D]/40 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-3 py-1 rounded font-bold uppercase tracking-wider transition whitespace-nowrap ${
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
                    className={`px-2.5 py-1 rounded font-bold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#164A41] text-white shadow-sm"
                        : "text-[#4D774E] hover:bg-[#9DC88D]/20 hover:text-[#164A41]"
                    }`}
                  >
                    <span>{cat.split(" (")[0]}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
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
              {/* Header Bar matching user's reference image */}
              <div className="bg-[#F4F6F4] text-[#164A41] text-[11px] font-bold uppercase tracking-wider px-4 sm:px-6 py-2.5 grid grid-cols-12 items-center border-b border-[#9DC88D]/30 select-none">
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
                <div className="p-8 text-center text-gray-500 text-xs">
                  No assets found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                CATEGORY_ORDER.map((category) => {
                  const stocks = filteredCategories[category];
                  if (!stocks || stocks.length === 0) return null;
                  const isCollapsed = collapsedCategories[category];

                  return (
                    <div key={category} className="border-b border-gray-100 last:border-b-0">
                      {/* Collapsible Category Header matching user's image */}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full bg-[#FAFBF9] hover:bg-[#F2F5F2] px-4 sm:px-6 py-2 flex items-center justify-between text-left transition select-none group border-t border-gray-100 first:border-t-0"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-gray-400 group-hover:text-[#164A41] transition-transform duration-200 text-xs ${
                              isCollapsed ? "-rotate-90" : "rotate-0"
                            }`}
                          >
                            &#9660;
                          </span>
                          <span className="text-xs font-black uppercase tracking-wider text-gray-700 group-hover:text-[#164A41]">
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

                            // TradingView and Yahoo links
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
                                  {/* Circular Badge matching user's image */}
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs ${badge.bg} ${badge.text}`}
                                  >
                                    {badge.label}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <a
                                        href={primaryUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-sm text-[#164A41] hover:text-[#0D9488] transition group-hover:underline flex items-center gap-1"
                                        title={`Open ${stock.symbol} on TradingView`}
                                      >
                                        <span>{stock.symbol}</span>
                                      </a>

                                      {/* Delayed / Exchange indicator matching user's image */}
                                      <span
                                        className={`text-[9px] font-black px-1 py-0.2 rounded uppercase ${
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
                                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-sans uppercase font-bold">
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
                                      className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-[#164A41]/10 hover:bg-[#164A41] text-[#164A41] hover:text-white transition"
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
                                      className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-[#F1B24A]/20 hover:bg-[#F1B24A] text-[#164A41] transition"
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
            <div className="bg-[#FAFBF9] border-t border-[#9DC88D]/30 p-3 sm:p-4 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
                <span>Green indicates 24h positive move; Red indicates 24h pullback.</span>
              </div>
              <div className="flex items-center gap-3">
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
        <section>
          <div className="flex items-center justify-between border-b-2 border-[#F1B24A] pb-2.5 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#F1B24A]">
                [ Priority Intelligence ]
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-mono hidden sm:inline-block">
              High-Impact Verification
            </span>
          </div>

          {data.tier1_items && data.tier1_items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {data.tier1_items.map((item, idx) => (
                <article
                  key={item.id || item.cluster_id || idx}
                  className="bg-white border border-[#F1B24A] border-t-4 border-t-[#F1B24A] rounded-lg shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#164A41] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {item.pillar_category}
                      </span>
                      <span className="bg-[#9DC88D]/25 text-[#164A41] text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                        {item.primary_entity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#4D774E] border border-[#9DC88D] px-2 py-0.5 rounded bg-white">
                        {item.hype_vs_substance}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#164A41] leading-snug mb-3">
                    {item.headline}
                  </h3>

                  <p className="text-sm text-[#4D774E] leading-relaxed mb-4">
                    {item.what_happened}
                  </p>

                  <div className="bg-[#F8FAF8] border-l-4 border-[#F1B24A] p-4 rounded-r-md space-y-2 mb-4 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-[#4D774E] uppercase tracking-wider">
                        Technical Summary:
                      </span>
                      <span className="text-[#164A41] ml-1">{item.technical_summary}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#F1B24A] uppercase tracking-wider">
                        Market Impact:
                      </span>
                      <span className="text-[#164A41] ml-1">{item.strategic_implication}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 text-xs gap-2">
                    <span className="text-gray-400 font-mono">
                      Published: {item.published_at ? item.published_at.slice(0, 10) : "Recent"}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {item.parsed_sources && item.parsed_sources.length > 0 ? (
                        item.parsed_sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F1B24A] hover:text-[#164A41] font-bold uppercase tracking-wider transition"
                          >
                            Read on {src.source} &rarr;
                          </a>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Verified Intelligence</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-[#F8FAF8] border border-[#9DC88D] rounded-md p-6 text-center text-sm text-[#4D774E]">
              No Priority Intelligence items recorded in this cycle.
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* SECTION 2: SECTOR BREAKDOWN                                       */}
        {/* ================================================================= */}
        <section>
          <div className="flex items-center justify-between border-b border-[#9DC88D] pb-2 mb-6">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#164A41]">
              [ Sector Breakdown ]
            </h2>
            <span className="text-xs text-[#4D774E]">Categorical Intelligence Matrix</span>
          </div>

          <div className="space-y-8">
            {Object.entries(data.pillar_groups || {}).map(([pillarName, items]) => {
              if (!items || items.length === 0) return null;
              return (
                <div key={pillarName}>
                  <div className="inline-block border-b-2 border-[#9DC88D] pb-1 mb-4">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#164A41]">
                      {pillarName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-[#9DC88D] rounded-md p-4 shadow-sm hover:border-[#F1B24A] transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase bg-[#164A41] text-white px-2 py-0.5 rounded">
                              {item.primary_entity}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#164A41] mb-1.5 leading-snug">
                            {item.headline}
                          </h4>
                          <p className="text-xs text-[#4D774E] leading-relaxed mb-3">
                            {item.what_happened}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 font-mono">{item.hype_vs_substance}</span>
                          <div className="flex gap-2">
                            {item.parsed_sources?.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#F1B24A] hover:text-[#164A41] font-bold uppercase"
                              >
                                {src.source} &rarr;
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
        <section className="bg-[#F8FAF8] border border-[#9DC88D] rounded-lg p-6">
          <div className="border-b border-[#9DC88D] pb-2 mb-6">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#164A41]">
              [ Repository & Research Radar ]
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GitHub Repos */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4D774E] border-b border-gray-200 pb-2 mb-3">
                ⭐ High-Velocity Repositories (GitHub)
              </h3>
              <div className="space-y-3">
                {data.trending_repos?.map((repo) => (
                  <div
                    key={repo.repo_name}
                    className="bg-white border border-[#9DC88D]/60 rounded p-3 shadow-sm hover:border-[#F1B24A] transition"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <a
                        href={repo.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-[#F1B24A] hover:text-[#164A41] transition"
                      >
                        {repo.repo_name}
                      </a>
                      <span className="text-[11px] font-bold text-[#4D774E]">
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4D774E] border-b border-gray-200 pb-2 mb-3">
                📑 Trending Preprints (arXiv & Hugging Face)
              </h3>
              <div className="space-y-3">
                {data.trending_papers?.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#9DC88D]/60 rounded p-3 shadow-sm hover:border-[#F1B24A] transition"
                  >
                    <div className="mb-1">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#164A41] hover:text-[#F1B24A] transition leading-snug block"
                      >
                        {p.title}
                      </a>
                    </div>
                    <p className="text-[11px] text-[#4D774E] line-clamp-2 mb-2">
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
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#164A41] border-t-2 border-[#F1B24A] text-white/80 py-4 px-4 text-center mt-auto">
        <div className="max-w-6xl mx-auto text-xs text-[#9DC88D]/80">
          &copy; 2026 Urivalent. All systems nominal.
        </div>
      </footer>
    </div>
  );
}
