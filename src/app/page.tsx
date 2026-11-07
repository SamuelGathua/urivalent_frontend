"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MarketTicker {
  ticker: string;
  close_price: number;
  daily_change_pct: number;
  five_day_trend_pct?: number;
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
  tier1_items: IntelItem[];
  pillar_groups: Record<string, IntelItem[]>;
  trending_repos: RepoSnapshot[];
  trending_papers: PaperSnapshot[];
}

export default function PublicDashboard() {
  const [data, setData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/feed", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Backend returned HTTP ${res.status}`);
        }
        const json: FeedData = await res.json();
        setData(json);
        setError(null);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Failed to load feed:", err);
        setError(`Unable to connect to intelligence API (${errorMsg}). Please ensure FastAPI is running on port 8000.`);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#164A41] flex flex-col font-sans antialiased">
      {/* HEADER */}
      <header className="bg-[#164A41] border-b-4 border-[#F1B24A] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <img
                src="/urivalent_logo.jfif"
                alt="Urivalent Logo"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "http://localhost:8000/assets/urivalent_logo.jfif";
                }}
              />
            </Link>
            <span className="text-xs font-bold tracking-widest uppercase text-[#9DC88D] hidden md:inline-block border-l border-[#9DC88D]/40 pl-3">
              Frontier AI Intelligence
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#9DC88D] uppercase font-bold tracking-wider hidden sm:inline-block">
              {data?.metadata.formatted_date || "Live Feed"}
            </span>
            <a
              href="http://localhost:8000/preview-brief"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#F1B24A] transition font-semibold"
            >
              Email HTML
            </a>
            <Link
              href="/admin"
              className="bg-[#F1B24A] hover:bg-[#F1B24A]/90 text-[#164A41] font-bold px-3 py-1.5 rounded transition shadow-sm uppercase tracking-wider"
            >
              Admin Portal &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* ROTATING GREETING BANNER */}
      {data?.metadata.greeting && (
        <div className="bg-[#0F352E] text-white/90 border-b border-[#9DC88D]/30 py-2 px-4 text-center text-xs sm:text-sm font-light italic">
          &ldquo;{data.metadata.greeting}&rdquo;
        </div>
      )}

      {/* THE COMPUTE & CAPITAL TICKER */}
      <section className="bg-[#F8FAF8] border-b border-[#9DC88D] px-4 py-3 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4D774E] bg-[#9DC88D]/20 px-2 py-0.5 rounded">
              24H Market Pulse
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs overflow-x-auto">
            {data?.market_tickers && data.market_tickers.length > 0 ? (
              data.market_tickers.map((t) => (
                <div
                  key={t.ticker}
                  className="bg-white border border-[#9DC88D] px-2.5 py-1 rounded shadow-sm font-mono flex items-center gap-1.5"
                >
                  <span className="font-bold text-[#164A41]">{t.ticker}</span>
                  <span className="text-gray-500">${t.close_price.toFixed(2)}</span>
                  <span
                    className={`font-bold ${
                      t.daily_change_pct >= 0 ? "text-[#4D774E]" : "text-red-600"
                    }`}
                  >
                    {t.daily_change_pct >= 0 ? "+" : ""}
                    {t.daily_change_pct.toFixed(2)}%
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-500 font-mono">Syncing market ticker data...</span>
            )}

            <div className="bg-white border border-[#F1B24A] text-[#F1B24A] font-bold px-3 py-1 rounded shadow-sm text-xs flex items-center gap-1 whitespace-nowrap">
              <span>Total arXiv Preprints:</span>
              <span className="underline decoration-[#F1B24A]">
                {data?.metadata.total_arxiv_count ?? 778}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN INTELLIGENCE FEED */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F1B24A] border-r-transparent"></div>
            <div className="text-sm font-bold uppercase tracking-widest text-[#164A41]">
              Aggregating Global AI Intelligence Pipeline...
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-900 rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Backend Connection Notice</h3>
            <p className="text-xs leading-relaxed">{error}</p>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#164A41] text-white text-xs font-bold uppercase px-4 py-2 rounded hover:bg-[#0F352E] transition"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* SECTION 1: PRIORITY INTELLIGENCE (TIER-1 BREAKTHROUGHS) */}
            <section>
              <div className="flex items-center justify-between border-b-2 border-[#F1B24A] pb-2.5 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#F1B24A]">
                    [ Priority Intelligence ]
                  </h2>
                  <span className="text-xs font-semibold text-[#4D774E] bg-[#9DC88D]/20 px-2.5 py-0.5 rounded-full">
                    Signal Score &ge; 8/10
                  </span>
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
                          <span className="text-[11px] font-bold text-[#F1B24A] border border-[#F1B24A] px-2 py-0.5 rounded bg-white">
                            SIGNAL: {item.signal_score}/10
                          </span>
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
                  No Priority Intelligence items recorded above the 8/10 signal threshold in this cycle.
                </div>
              )}
            </section>

            {/* SECTION 2: SECTOR BREAKDOWN */}
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
                                <span className="text-[10px] font-semibold text-[#4D774E]">
                                  Signal: {item.signal_score}/10
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

            {/* SECTION 3: REPOSITORY & RESEARCH RADAR */}
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
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#164A41] border-t-2 border-[#F1B24A] text-white/80 py-8 px-4 text-center mt-auto">
        <div className="max-w-6xl mx-auto space-y-3 text-xs">
          <div className="font-bold tracking-widest uppercase text-[#9DC88D]">
            Urivalent AI Intelligence Pipeline
          </div>
          <p className="text-white/60 max-w-lg mx-auto">
            Automated intelligence compiled daily at 08:50 AM EAT. Tracking frontier models, hyperscaler silicon, energy grids, and open-source velocity.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-2">
            <a href="http://localhost:8000/preview-brief" target="_blank" rel="noreferrer" className="text-[#F1B24A] hover:underline">
              Live HTML Brief
            </a>
            <span>&bull;</span>
            <a href="http://localhost:8000/health" target="_blank" rel="noreferrer" className="text-[#9DC88D] hover:underline">
              API Health
            </a>
            <span>&bull;</span>
            <Link href="/admin" className="text-[#F1B24A] hover:underline">
              Operations Command
            </Link>
          </div>
          <div className="text-[10px] text-[#9DC88D]/70 pt-2">
            &copy; 2026 Urivalent. Zero-Cost Full-Stack Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
}
