"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SystemHealth {
  status: string;
  database: {
    mode: string;
    sqlite_path?: string;
  };
  counts: {
    ai_intelligence_items: number;
    active_users: number;
    compute_market_snapshots: number;
    github_trending_snapshots: number;
    research_paper_snapshots: number;
  };
  scheduler: {
    running: boolean;
    timezone: string;
    jobs: Array<{
      id: string;
      name: string;
      next_run_time: string;
    }>;
  };
}

export default function AdminPortal() {
  const [adminKey, setAdminKey] = useState<string>("urivalent_admin_secret_key");
  const [testEmail, setTestEmail] = useState<string>("gathuamwangi45@gmail.com");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  // Load telemetry
  useEffect(() => {
    fetchHealth();
  }, []);

  async function fetchHealth() {
    try {
      const res = await fetch("http://localhost:8000/health");
      if (res.ok) {
        const json = await res.json();
        setHealth(json);
      }
    } catch (err) {
      console.warn("Could not fetch health:", err);
    }
  }

  // Trigger Test Email
  async function handleSendTestEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail) return;

    setLoadingAction("test_email");
    setMessage(null);

    try {
      const res = await fetch("http://localhost:8000/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey,
        },
        body: JSON.stringify({ email: testEmail, admin_key: adminKey }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || `Test briefing successfully dispatched to ${testEmail}!`,
        });
      } else {
        setMessage({
          type: "error",
          text: data.detail || data.error || "Failed to dispatch test email.",
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage({ type: "error", text: `Connection error: ${errorMsg}` });
    } finally {
      setLoadingAction(null);
      fetchHealth();
    }
  }

  // Trigger Force News
  async function handleForceNews() {
    setLoadingAction("force_news");
    setMessage(null);

    try {
      const res = await fetch("http://localhost:8000/admin/force-news", {
        method: "POST",
        headers: { "X-Admin-Key": adminKey },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Ingestion cycle completed successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.detail || data.error || "Ingestion cycle failed.",
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage({ type: "error", text: `Connection error: ${errorMsg}` });
    } finally {
      setLoadingAction(null);
      fetchHealth();
    }
  }

  // Trigger Morning Brief
  async function handleSendMorningBrief() {
    if (!confirm("Are you sure you want to trigger the full Morning Briefing dispatch to all active subscribers?")) {
      return;
    }

    setLoadingAction("morning_brief");
    setMessage(null);

    try {
      const res = await fetch("http://localhost:8000/admin/send-morning-brief", {
        method: "POST",
        headers: { "X-Admin-Key": adminKey },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Morning briefing cycle dispatched to all subscribers!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.detail || data.error || "Morning brief execution failed.",
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage({ type: "error", text: `Connection error: ${errorMsg}` });
    } finally {
      setLoadingAction(null);
      fetchHealth();
    }
  }

  return (
    <div className="min-h-screen bg-[#164A41] text-white flex flex-col font-sans antialiased">
      {/* HEADER */}
      <header className="bg-[#0F352E] border-b-2 border-[#F1B24A] shadow-lg py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
            <div className="border-l border-[#9DC88D]/40 pl-3">
              <h1 className="text-sm font-black tracking-widest uppercase text-[#F1B24A]">
                Operations Command
              </h1>
              <div className="text-[10px] text-[#9DC88D] tracking-wider uppercase font-mono">
                Pipeline Control & Test Dispatch
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/" className="text-[#9DC88D] hover:text-white transition uppercase tracking-wider">
              &larr; Public Feed
            </Link>
            <a
              href="http://localhost:8000/preview-brief"
              target="_blank"
              rel="noreferrer"
              className="text-[#F1B24A] hover:underline uppercase tracking-wider"
            >
              Email HTML
            </a>
            <a
              href="http://localhost:8000/health"
              target="_blank"
              rel="noreferrer"
              className="bg-[#164A41] border border-[#9DC88D] text-white px-2.5 py-1 rounded hover:bg-[#4D774E] transition font-mono"
            >
              /health
            </a>
          </div>
        </div>
      </header>

      {/* MAIN ADMIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* TOAST / STATUS ALERT */}
        {message && (
          <div
            className={`border-2 px-5 py-3.5 rounded-lg shadow-md flex items-center justify-between transition ${
              message.type === "success"
                ? "bg-[#4D774E] border-[#F1B24A] text-white"
                : "bg-red-900 border-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="font-bold text-lg">
                {message.type === "success" ? "✓" : "⚠"}
              </span>
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-xs uppercase font-bold text-[#F1B24A] hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SECURITY & ADMIN KEY INPUT */}
        <div className="bg-[#0F352E] border border-[#9DC88D]/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔐</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#F1B24A]">
                Admin Authorization Token
              </div>
              <div className="text-[11px] text-[#9DC88D]">
                Passed via X-Admin-Key header for sensitive operational triggers.
              </div>
            </div>
          </div>
          <div className="w-full sm:w-80">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin secret key"
              className="w-full bg-[#164A41] border border-[#9DC88D] px-3 py-1.5 rounded text-xs text-white focus:border-[#F1B24A] focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: CONTROL PANELS */}
          <div className="lg:col-span-2 space-y-8">
            {/* CONTROL PANEL 1: TEST EMAIL DISPATCH */}
            <div className="bg-white text-[#164A41] rounded-xl p-6 sm:p-8 shadow-xl border-t-4 border-[#F1B24A]">
              <div className="flex items-center justify-between border-b border-[#9DC88D]/40 pb-3 mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#164A41]">
                    Test Briefing Dispatch
                  </h2>
                  <p className="text-xs text-[#4D774E] mt-0.5">
                    Instantly compiles and dispatches a live briefing strictly to your email address without affecting the subscriber dispatch state.
                  </p>
                </div>
                <span className="text-[10px] bg-[#F1B24A]/20 text-[#164A41] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Sandbox Safe
                </span>
              </div>

              <form onSubmit={handleSendTestEmail} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#164A41] mb-1.5">
                    Destination Test Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    required
                    placeholder="gathamwangi45@gmail.com"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-[#9DC88D] text-[#164A41] font-medium focus:border-[#F1B24A] focus:outline-none transition text-sm bg-[#F8FAF8]"
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Dispatches using your live Resend API key (<code className="bg-gray-100 px-1 py-0.5 rounded font-mono">re_ExEV...</code>).
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loadingAction === "test_email"}
                    className="w-full sm:w-auto bg-[#F1B24A] hover:bg-[#F1B24A]/90 disabled:opacity-50 text-[#164A41] font-black uppercase tracking-wider px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    {loadingAction === "test_email" ? (
                      <>
                        <span className="h-4 w-4 border-2 border-[#164A41] border-r-transparent rounded-full animate-spin"></span>
                        <span>Compiling & Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Test Briefing</span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* CONTROL PANEL 2: MANUAL WORKFLOW TRIGGERS */}
            <div className="bg-white text-[#164A41] rounded-xl p-6 sm:p-8 shadow-xl border-t-4 border-[#4D774E]">
              <div className="border-b border-[#9DC88D]/40 pb-3 mb-6">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#164A41]">
                  Manual Execution Triggers
                </h2>
                <p className="text-xs text-[#4D774E] mt-0.5">
                  Execute individual pipeline tasks on demand outside the scheduled cron jobs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trigger Force News */}
                <div className="border border-[#9DC88D] rounded-lg p-5 flex flex-col justify-between bg-[#F8FAF8]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D774E] bg-[#9DC88D]/20 px-2 py-0.5 rounded">
                      Scrape & Cluster Only
                    </span>
                    <h3 className="text-sm font-bold text-[#164A41] mt-2 mb-1">
                      Run News Ingestion Cycle
                    </h3>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                      Fetches all 5 streams (RSS, HN, Telegram, Market Pulse, GitHub), clusters, and updates the database without emailing.
                    </p>
                  </div>

                  <button
                    onClick={handleForceNews}
                    disabled={loadingAction === "force_news"}
                    className="w-full bg-[#164A41] hover:bg-[#0F352E] disabled:opacity-50 text-white font-bold uppercase tracking-wider px-4 py-2.5 rounded text-xs transition shadow-sm"
                  >
                    {loadingAction === "force_news" ? "Running Cycle..." : "Execute News Cycle"}
                  </button>
                </div>

                {/* Trigger Morning Dispatch */}
                <div className="border border-[#F1B24A] rounded-lg p-5 flex flex-col justify-between bg-[#F8FAF8]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#164A41] bg-[#F1B24A]/30 px-2 py-0.5 rounded">
                      Full Dispatch
                    </span>
                    <h3 className="text-sm font-bold text-[#164A41] mt-2 mb-1">
                      Run Morning Delivery Cycle
                    </h3>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                      Executes full scraping, synthesis pass, and batches the briefing email to all active verified subscribers via Resend.
                    </p>
                  </div>

                  <button
                    onClick={handleSendMorningBrief}
                    disabled={loadingAction === "morning_brief"}
                    className="w-full bg-[#F1B24A] hover:bg-[#F1B24A]/90 disabled:opacity-50 text-[#164A41] font-black uppercase tracking-wider px-4 py-2.5 rounded text-xs transition shadow-sm"
                  >
                    {loadingAction === "morning_brief" ? "Dispatching..." : "Trigger Morning Dispatch"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SYSTEM TELEMETRY */}
          <div className="space-y-6">
            <div className="bg-white text-[#164A41] rounded-xl p-6 shadow-xl border border-[#9DC88D]">
              <div className="flex items-center justify-between border-b border-[#9DC88D]/40 pb-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#164A41]">
                  Live System Telemetry
                </h3>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Database Engine:</span>
                  <span className="font-bold text-[#164A41]">{health?.database.mode || "Syncing..."}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Intelligence Items:</span>
                  <span className="font-bold text-[#164A41]">
                    {health?.counts.ai_intelligence_items ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Active Subscribers:</span>
                  <span className="font-bold text-[#164A41]">
                    {health?.counts.active_users ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Market Snapshots:</span>
                  <span className="font-bold text-[#164A41]">
                    {health?.counts.compute_market_snapshots ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">GitHub Snapshots:</span>
                  <span className="font-bold text-[#164A41]">
                    {health?.counts.github_trending_snapshots ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Timezone:</span>
                  <span className="font-bold text-[#164A41]">
                    {health?.scheduler.timezone || "Africa/Nairobi"}
                  </span>
                </div>
              </div>
            </div>

            {/* TIMETABLE */}
            <div className="bg-white text-[#164A41] rounded-xl p-6 shadow-xl border border-[#9DC88D]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#164A41] border-b border-[#9DC88D]/40 pb-3 mb-4">
                Scheduler Cron Timetable
              </h3>

              <div className="space-y-3 text-xs">
                {health?.scheduler.jobs && health.scheduler.jobs.length > 0 ? (
                  health.scheduler.jobs.map((job) => (
                    <div key={job.id} className="border-l-2 border-[#F1B24A] pl-3">
                      <div className="font-bold text-[#164A41]">{job.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        Next: {job.next_run_time ? job.next_run_time.slice(0, 19).replace("T", " ") : "Active"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400">Loading cron timetable...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0F352E] border-t border-[#9DC88D]/30 py-4 px-6 text-center text-xs text-[#9DC88D]/70 mt-auto">
        Urivalent Operations Command &bull; Decoupled Next.js + FastAPI Pure Architecture
      </footer>
    </div>
  );
}
