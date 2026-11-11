"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";

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

export interface SubscriberUser {
  id: number;
  email: string;
  username?: string | null;
  is_active?: number;
  is_verified?: number;
  is_subscribed?: number;
  created_at?: string | null;
}

function formatSubscribedDate(dateString?: string | null): { date: string; time: string; relative: string } {
  if (!dateString) {
    return { date: "Date unavailable", time: "", relative: "" };
  }
  try {
    const normalized = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T") + (dateString.endsWith("Z") ? "" : "Z");
    const d = new Date(normalized);

    if (isNaN(d.getTime())) {
      return { date: dateString.slice(0, 10), time: dateString.slice(11, 19), relative: "" };
    }

    const date = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Nairobi",
    }) + " EAT";

    const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    let relative = "";
    if (diffDays === 0) relative = "Today";
    else if (diffDays === 1) relative = "Yesterday";
    else if (diffDays > 1) relative = `${diffDays}d ago`;

    return { date, time, relative };
  } catch {
    return { date: String(dateString).slice(0, 10), time: "", relative: "" };
  }
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.urivalent.tech").replace(/\/$/, "");

/**
 * Resilient Admin API Dispatcher:
 * Attempts direct call to cloud API first; automatically falls back to same-origin
 * Edge proxy (/api/admin-proxy/...) if browser encounters CORS blocks or network errors.
 * Also gracefully falls back to direct Next.js Edge route for database subscribers.
 */
async function callAdminApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok && (res.status >= 500 || res.status === 404) && endpoint.includes('/admin/users')) {
      throw new Error(`Direct API returned status ${res.status}`);
    }
    return res;
  } catch (directErr) {
    try {
      const res = await fetch(`/api/admin-proxy${endpoint}`, options);
      if (res.status === 502 && endpoint.includes('/admin/users')) {
        return await fetch(`/api${endpoint}`, options);
      }
      return res;
    } catch {
      if (endpoint.includes('/admin/users')) {
        try {
          return await fetch(`/api${endpoint}`, options);
        } catch {
          throw directErr;
        }
      }
      throw directErr;
    }
  }
}

// Security: Maximum login trials configuration
const MAX_LOGIN_TRIALS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15-minute lockout

function formatLockout(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function AdminPortal() {
  // Authentication & Lock State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string>("");
  const [adminUser, setAdminUser] = useState<string>("");

  // Lock Screen Form State
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPasscode, setLoginPasscode] = useState<string>("");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Maximum 3 login trials state
  const [failedTrials, setFailedTrials] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Initialize lockout state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncStorageTimer = setTimeout(() => {
      const savedAttempts = parseInt(localStorage.getItem("urivalent_admin_failed_trials") || "0", 10);
      const savedLockout = parseInt(localStorage.getItem("urivalent_admin_lockout_until") || "0", 10);
      const now = Date.now();

      if (savedLockout && savedLockout > now) {
        setFailedTrials(savedAttempts || MAX_LOGIN_TRIALS);
        setRemainingSeconds(Math.ceil((savedLockout - now) / 1000));
      } else if (savedLockout && savedLockout <= now) {
        localStorage.removeItem("urivalent_admin_lockout_until");
        localStorage.removeItem("urivalent_admin_failed_trials");
        setFailedTrials(0);
        setRemainingSeconds(0);
      } else {
        setFailedTrials(savedAttempts || 0);
      }
    }, 0);

    return () => clearTimeout(syncStorageTimer);
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (typeof window !== "undefined") {
            localStorage.removeItem("urivalent_admin_lockout_until");
            localStorage.removeItem("urivalent_admin_failed_trials");
          }
          setFailedTrials(0);
          setLoginError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  // Dashboard State
  const [testEmail, setTestEmail] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  // Subscribers Directory State
  const [subscribers, setSubscribers] = useState<SubscriberUser[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState<boolean>(false);
  const [subscribersError, setSubscribersError] = useState<string | null>(null);
  const [subscriberSearch, setSubscriberSearch] = useState<string>("");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<SubscriberUser | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Floating navbar state
  const [navVisible, setNavVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

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

  // 1. Verify existing session on mount
  useEffect(() => {
    async function verifyExistingSession() {
      setIsCheckingAuth(true);
      const savedToken = typeof window !== "undefined" ? localStorage.getItem("urivalent_admin_token") : null;
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("urivalent_admin_username") : null;

      if (!savedToken) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const res = await callAdminApi("/admin/verify", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAdminToken(savedToken);
          setAdminUser(data.username || savedUser || "admin");
          setIsAuthenticated(true);
          fetchHealth();
          fetchUsers();
        } else {
          // Token expired or invalid
          localStorage.removeItem("urivalent_admin_token");
          localStorage.removeItem("urivalent_admin_username");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn("Could not verify session with backend:", err);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    verifyExistingSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1b. Real-time Database Polling & Focus Synchronization
  useEffect(() => {
    if (!isAuthenticated) return;

    // Background live check every 5 seconds for immediate real-time sync
    const pollTimer = setInterval(() => {
      fetchUsers(true);
    }, 5000);

    const handleFocusSync = () => {
      fetchUsers(true);
      fetchHealth();
    };

    window.addEventListener("focus", handleFocusSync);
    document.addEventListener("visibilitychange", handleFocusSync);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener("focus", handleFocusSync);
      document.removeEventListener("visibilitychange", handleFocusSync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 2. Fetch live system health
  async function fetchHealth() {
    try {
      const res = await callAdminApi("/health");
      if (res.ok) {
        const json = await res.json();
        setHealth(json);
      }
    } catch (err) {
      console.warn("Could not fetch health telemetry:", err);
    }
  }

  // 3. Unlock Admin Console (Login)
  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();

    // Check if terminal is currently locked out
    if (remainingSeconds > 0) {
      setLoginError(`Terminal locked due to 3 failed attempts. Please wait ${formatLockout(remainingSeconds)}.`);
      return;
    }

    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await callAdminApi("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPasscode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        const token = data.access_token;
        const username = data.username || loginUsername;
        setAdminToken(token);
        setAdminUser(username);
        setIsAuthenticated(true);
        localStorage.setItem("urivalent_admin_token", token);
        localStorage.setItem("urivalent_admin_username", username);

        // Reset trial counters on successful login
        setFailedTrials(0);
        setRemainingSeconds(0);
        localStorage.removeItem("urivalent_admin_failed_trials");
        localStorage.removeItem("urivalent_admin_lockout_until");

        setLoginPasscode("");
        fetchHealth();
        fetchUsers();
      } else {
        const nextFailed = failedTrials + 1;
        setFailedTrials(nextFailed);
        localStorage.setItem("urivalent_admin_failed_trials", String(nextFailed));

        if (nextFailed >= MAX_LOGIN_TRIALS || res.status === 429) {
          const lockTime = Date.now() + LOCKOUT_DURATION_MS;
          setRemainingSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));
          localStorage.setItem("urivalent_admin_lockout_until", String(lockTime));
          setLoginError("Maximum login trials exceeded (3/3). Terminal locked for 15 minutes for security.");
        } else {
          const trialsLeft = MAX_LOGIN_TRIALS - nextFailed;
          setLoginError(
            data.detail ||
            `Invalid administrator credentials. ${trialsLeft} trial${trialsLeft === 1 ? "" : "s"} remaining.`
          );
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setLoginError(`Connection failure: ${errorMsg}. Please verify your connection to https://api.urivalent.tech.`);
    } finally {
      setLoginLoading(false);
    }
  }

  // 4. Lock Admin Console (Logout)
  async function handleLock() {
    try {
      await callAdminApi("/admin/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem("urivalent_admin_token");
    localStorage.removeItem("urivalent_admin_username");
    setAdminToken("");
    setAdminUser("");
    setIsAuthenticated(false);
    setMessage(null);
  }

  // Helper for authenticated headers
  function getAuthHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
      "X-Admin-Key": "urivalent_admin_secret_key",
    };
  }

  // Handle unauthorized response
  function handleUnauthorized() {
    setMessage({ type: "error", text: "Session expired or unauthorized. Please unlock the terminal again." });
    handleLock();
  }

  // 5. Trigger Test Email
  async function handleSendTestEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail) return;

    setLoadingAction("test_email");
    setMessage(null);

    try {
      const res = await callAdminApi("/admin/test-email", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: testEmail }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

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

  // 6. Trigger Force News Ingestion
  async function handleForceNews() {
    setLoadingAction("force_news");
    setMessage(null);

    try {
      const res = await callAdminApi("/admin/force-news", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

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

  // 7. Trigger Full Morning Delivery Cycle
  async function handleSendMorningBrief() {
    if (!confirm("Are you sure you want to trigger the full Morning Briefing dispatch to all active subscribers?")) {
      return;
    }

    setLoadingAction("morning_brief");
    setMessage(null);

    try {
      const res = await callAdminApi("/admin/send-morning-brief", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

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

  // 8. Fetch Subscriber Records Directly From Database (Live Cloudflare D1 with automatic instant sync)
  async function fetchUsers(silent = false) {
    if (!silent) {
      setSubscribersLoading(true);
    }
    setSubscribersError(null);
    try {
      const timestamp = Date.now();
      let res: Response;

      // 1. Direct Edge call to Cloudflare D1 (source of truth) with no-store cache
      try {
        res = await fetch(`/api/admin/users?_t=${timestamp}`, {
          headers: getAuthHeaders(),
          cache: "no-store",
        });
        if (!res.ok && res.status !== 401) {
          throw new Error(`Direct Edge DB returned ${res.status}`);
        }
      } catch {
        // Fallback to API dispatcher
        res = await callAdminApi(`/admin/users?_t=${timestamp}`, {
          headers: getAuthHeaders(),
          cache: "no-store",
        });
      }

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.users)) {
        setSubscribers(data.users);
        const activeCount = data.users.filter(
          (u: SubscriberUser) => u.is_active !== 0 && u.is_subscribed !== 0
        ).length;
        setHealth((prev) =>
          prev ? { ...prev, counts: { ...prev.counts, active_users: activeCount } } : prev
        );
      } else if (!silent) {
        setSubscribersError(data.detail || data.error || "Failed to retrieve subscriber registry from database.");
      }
    } catch (err: unknown) {
      if (!silent) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setSubscribersError(`Database telemetry offline: ${errorMsg}`);
      }
    } finally {
      if (!silent) {
        setSubscribersLoading(false);
      }
    }
  }

  // 9. Master Unsubscribe / Delete Subscriber Command Handler
  async function handleMasterUnsubscribe(user: SubscriberUser) {
    setDeletingUserId(user.id);
    setMessage(null);

    try {
      // 1. Delete on direct Edge D1 route
      let res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        cache: "no-store",
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await callAdminApi(`/admin/users/${user.id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
      } else {
        // Also sync deletion with backend
        callAdminApi(`/admin/users/${user.id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        }).catch(() => {});
      }

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || `Subscriber ${user.email} permanently removed and master-unsubscribed from database.`,
        });
        // Optimistically remove from local state immediately
        setSubscribers((prev) => {
          const updated = prev.filter((item) => item.id !== user.id);
          const activeCount = updated.filter(
            (u) => u.is_active !== 0 && u.is_subscribed !== 0
          ).length;
          setHealth((h) =>
            h ? { ...h, counts: { ...h.counts, active_users: activeCount } } : h
          );
          return updated;
        });
        setConfirmDeleteUser(null);
        fetchHealth();
        fetchUsers(true);
      } else {
        setMessage({
          type: "error",
          text: data.detail || data.error || `Failed to delete subscriber ${user.email}.`,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage({
        type: "error",
        text: `Error during subscriber deletion: ${errorMsg}`,
      });
    } finally {
      setDeletingUserId(null);
    }
  }

  function copyToClipboard(email: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  }

  // Filtered subscribers list for search query
  const filteredSubscribers = subscribers.filter((sub) => {
    if (!subscriberSearch.trim()) return true;
    const query = subscriberSearch.toLowerCase();
    const emailMatch = sub.email?.toLowerCase().includes(query);
    const userMatch = sub.username?.toLowerCase().includes(query);
    return Boolean(emailMatch || userMatch);
  });

  // ---------------------------------------------------------------------------
  // RENDER: LOADING CHECK
  // ---------------------------------------------------------------------------
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0A1D16] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-[#F1B24A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase font-mono font-bold tracking-widest text-[#9DC88D]">
            Authenticating Console Security...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: EXECUTIVE LOCK SCREEN (LOCKED)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1D16] text-white flex flex-col font-sans antialiased selection:bg-[#F1B24A] selection:text-[#164A41] relative">
        {/* Subtle ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(22,74,65,0.45),transparent_75%)] pointer-events-none" />

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
                className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-full text-[#F1B24A] bg-white/[0.08] font-bold"
              >
                Admin
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
        {/* MAIN BODY: SPLIT-CARD DESIGN INSPIRED BY IMAGE 1                   */}
        {/* ================================================================== */}
        <main className="relative z-10 flex-1 flex items-center justify-center pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[940px] w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.55)] border border-white/20 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* LEFT HALF: ARTWORK PANEL WITH login.jpeg */}
            <div className="md:col-span-6 relative min-h-[280px] md:min-h-[580px] bg-[#161412] overflow-hidden">
              <Image
                src="/login.jpeg"
                alt="Urivalent Frontier"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
              {/* Artistic subtle overlay matching Image 1 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F1B24A] font-bold">
                    URIVALENT
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-[0.25em] uppercase text-white font-sans drop-shadow-md">
                    WELCOME
                  </h2>
                  <p className="text-xs text-white/75 font-light leading-relaxed max-w-xs">
                    Autonomous intelligence synthesis and sovereign compute telemetry console.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT HALF: LOGIN FORM */}
            <div className="md:col-span-6 bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center text-[#164A41]">
              {/* Title & Subtitle */}
              <h1
                className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A1D16] mb-2 leading-[1.1]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Login
              </h1>
              <p className="text-xs text-gray-500 font-sans mb-8">
                Enter your institutional credentials to authenticate.
              </p>

              {/* Security Lockout Alert */}
              {remainingSeconds > 0 ? (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-xs text-red-900 flex items-start gap-3">
                  <span className="text-lg shrink-0">⏳</span>
                  <div className="space-y-1">
                    <p className="font-bold uppercase tracking-wider font-mono text-[10px] text-red-900">
                      Terminal Locked (3/3 Trials Exceeded)
                    </p>
                    <p className="leading-relaxed text-red-800 text-[11px]">
                      Access temporarily suspended for security. Cooldown expires in{" "}
                      <span className="font-mono font-bold text-red-950 bg-red-200/70 px-2 py-0.5 rounded-md">
                        {formatLockout(remainingSeconds)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : failedTrials > 0 && failedTrials < MAX_LOGIN_TRIALS ? (
                <div className="mb-5 flex items-center justify-between text-[11px] font-mono text-amber-900 bg-amber-500/15 border border-amber-500/30 px-3.5 py-2 rounded-xl">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                    <span>Attempt {failedTrials} of {MAX_LOGIN_TRIALS} used</span>
                  </span>
                  <span className="font-bold text-amber-950">
                    {MAX_LOGIN_TRIALS - failedTrials} trial{MAX_LOGIN_TRIALS - failedTrials === 1 ? "" : "s"} left
                  </span>
                </div>
              ) : null}

              {/* Error Alert */}
              {loginError && remainingSeconds === 0 && (
                <div className="mb-6 bg-red-50/90 border border-red-200/80 p-3.5 rounded-xl text-xs text-red-900 flex items-start gap-2.5">
                  <span className="font-bold text-red-600 shrink-0">✕</span>
                  <span className="leading-relaxed">{loginError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleUnlock} className="space-y-5">
                <div>
                  <label
                    htmlFor="admin_user"
                    className="block text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[#164A41]/80 mb-2 pl-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="admin_user"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    disabled={remainingSeconds > 0 || loginLoading}
                    autoComplete="username"
                    placeholder="Enter username"
                    className="w-full bg-[#F5F7F6] border border-gray-200 focus:border-[#164A41] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#164A41] font-sans focus:outline-none transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin_pass"
                    className="block text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[#164A41]/80 mb-2 pl-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasscode ? "text" : "password"}
                      id="admin_pass"
                      value={loginPasscode}
                      onChange={(e) => setLoginPasscode(e.target.value)}
                      required
                      disabled={remainingSeconds > 0 || loginLoading}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      className="w-full bg-[#F5F7F6] border border-gray-200 focus:border-[#164A41] focus:bg-white rounded-xl pl-4 pr-11 py-3 text-sm text-[#164A41] font-sans focus:outline-none transition-all placeholder:text-gray-400 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      disabled={remainingSeconds > 0}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#164A41] p-1.5 rounded-lg transition-colors focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={showPasscode ? "Hide password" : "Show password"}
                    >
                      {showPasscode ? (
                        /* Eye-slash icon (Hide) */
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        /* Eye icon (Show) */
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={remainingSeconds > 0 || loginLoading}
                    className="w-full bg-[#0A1D16] hover:bg-[#164A41] text-white rounded-full py-3.5 px-6 font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loginLoading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Authenticating...</span>
                      </>
                    ) : remainingSeconds > 0 ? (
                      <span>Locked ({formatLockout(remainingSeconds)})</span>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-4 text-center">
                <Link
                  href="/"
                  className="text-xs text-gray-400 hover:text-[#164A41] transition-colors inline-flex items-center gap-1 font-mono"
                >
                  <span>←</span>
                  <span>Return to public feed</span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* ================================================================== */}
        {/* FOOTER — MATCHING LANDING PAGE                                     */}
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

  // ---------------------------------------------------------------------------
  // RENDER: UNLOCKED ADMIN OPERATIONS DASHBOARD (LANDING PAGE THEME)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#164A41] overflow-x-hidden selection:bg-[#F1B24A] selection:text-[#164A41]">
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
            <div className="bg-white/[0.94] hover:bg-white px-3.5 py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-[1.03]">
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-[11px] font-mono tracking-wider text-white/80">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Overview
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
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-full text-[#F1B24A] bg-white/[0.08] font-bold"
            >
              Admin
            </Link>
          </nav>

          {/* Right Action: Operator Status & Lock Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 bg-white/[0.08] border border-white/15 px-3 py-1 rounded-full text-[10px] font-mono text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white/60">Operator:</span>
              <span className="text-[#F1B24A] font-bold uppercase">{adminUser || "ADMIN"}</span>
            </div>

            <a
              href={`${API_BASE_URL}/health`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-2.5 py-1.5 rounded-full transition-colors"
            >
              <span>/health</span>
              <span className="text-[10px]">↗</span>
            </a>

            <button
              onClick={handleLock}
              className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] font-bold font-mono uppercase tracking-[0.16em] px-4 py-2 min-h-[40px] rounded-full transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Lock Console & Sign Out"
            >
              <span>🔒</span>
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* 1. HERO SECTION WITH admin_page.jpeg BACKGROUND                     */}
      {/* ================================================================== */}
      <section className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] flex flex-col justify-center pt-28 sm:pt-36 pb-12 overflow-hidden border-b border-[#164A41]/10">
        {/* Full-width Background Image: admin_page.jpeg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/admin_page.jpeg"
            alt="Urivalent Sovereign Synthesis & Touch Artwork"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Directional gradient overlay preserving landing page lighting & typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D16]/95 via-[#0A1D16]/80 to-[#0A1D16]/40 sm:via-[#0A1D16]/65 sm:to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D16] via-transparent to-black/55" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full my-auto">
          <div className="max-w-2xl">
            {/* Main Headline — Exact match to Landing Page styling */}
            <h1
              className="text-4xl sm:text-6xl lg:text-[4.75rem] font-medium leading-[1.02] tracking-tight text-white mb-4 sm:mb-6 drop-shadow-md"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Commanding the
              <br />
              <span className="italic text-[#7CE5B4] font-normal">
                Sovereign Frontier
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-white/90 text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-8 max-w-xl">
              Real-time pipeline orchestration, autonomous intelligence clustering, and morning briefing delivery dispatch.
            </p>

            {/* Quick Action Button */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#control-suite"
                className="bg-[#F1B24A] hover:bg-[#dfa23c] text-[#164A41] text-[10px] sm:text-[11px] font-bold font-mono uppercase tracking-[0.16em] px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1.5 active:scale-95"
              >
                <span>Console Controls</span>
                <span className="text-xs">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. CONTROL SUITE — INTERACTIVE OPERATIONS SECTION                  */}
      {/* ================================================================== */}
      <section id="control-suite" className="bg-[#FAF9F5] pt-10 sm:pt-14 pb-16 sm:pb-28 border-b border-[#164A41]/10 flex-1">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          {/* SNAPSHOT METRICS CARDS — PUSHED JUST ABOVE CONTROL SUITE */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#164A41]/10 shadow-[0_2px_12px_rgba(22,74,65,0.04)]">
              <span className="text-[10px] font-mono text-[#164A41]/60 uppercase tracking-widest block mb-1">
                Intelligence Items
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#164A41]">
                {health?.counts.ai_intelligence_items ?? "--"}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#164A41]/10 shadow-[0_2px_12px_rgba(22,74,65,0.04)]">
              <span className="text-[10px] font-mono text-[#164A41]/60 uppercase tracking-widest block mb-1">
                Active Subscribers
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#2C5E54]">
                {subscribers.length > 0
                  ? subscribers.filter((s) => s.is_subscribed !== 0).length
                  : (health?.counts.active_users ?? "--")}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#164A41]/10 shadow-[0_2px_12px_rgba(22,74,65,0.04)]">
              <span className="text-[10px] font-mono text-[#164A41]/60 uppercase tracking-widest block mb-1">
                Market Snapshots
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#164A41]">
                {health?.counts.compute_market_snapshots ?? "--"}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#164A41]/10 shadow-[0_2px_12px_rgba(22,74,65,0.04)] flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#164A41]/60 uppercase tracking-widest block mb-1">
                Pipeline Status
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-emerald-700 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>OPERATIONAL</span>
              </span>
            </div>
          </div>
          {/* Eyebrow & Headline matching landing page style */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#164A41]/80 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
                01 &nbsp; CONTROL SUITE — PIPELINE ORCHESTRATION &amp; TELEMETRY
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-16 items-start">
              <div className="lg:col-span-12">
                <h2
                  className="text-2xl sm:text-4xl lg:text-[3rem] font-medium leading-[1.08] tracking-tight text-[#164A41]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Autonomous pipelines,
                  <br />
                  <span className="italic text-[#2C5E54]">
                    beneath direct command.
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* STATUS TOAST / ALERT NOTIFICATION */}
          {message && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex items-center justify-between gap-4 transition-all ${
                message.type === "success"
                  ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                  : "bg-red-50/90 border-red-300 text-red-950"
              }`}
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                <span className={`w-2.5 h-2.5 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
                <span>{message.text}</span>
              </div>
              <button
                onClick={() => setMessage(null)}
                className="text-xs font-mono uppercase font-bold text-[#164A41] hover:underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* MAIN TWO-COLUMN DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT 7 COLS: INTERACTIVE ACTION CARDS */}
            <div className="lg:col-span-7 space-y-8">
              {/* CARD 1: TEST BRIEFING DISPATCH */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(22,74,65,0.06)] border border-[#164A41]/10 space-y-6">
                <div className="flex items-start justify-between border-b border-[#164A41]/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#F1B24A] block mb-1">
                      SANDBOX SAFE
                    </span>
                    <h3
                      className="text-xl sm:text-2xl font-medium text-[#164A41] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Test Briefing Dispatch
                    </h3>
                    <p className="text-xs text-[#2C5E54] mt-1 leading-relaxed">
                      Compiles and dispatches the live HTML briefing directly to a test inbox without altering subscriber dispatch flags.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendTestEmail} className="space-y-4">
                  <div>
                    <label
                      htmlFor="test_email"
                      className="block text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[#164A41]/80 mb-2 pl-1"
                    >
                      Destination Email
                    </label>
                    <input
                      type="email"
                      id="test_email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      required
                      placeholder="Enter destination email..."
                      className="w-full bg-[#F5F7F6] border border-gray-200 focus:border-[#164A41] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#164A41] font-sans focus:outline-none transition-all placeholder:text-gray-400"
                    />
                    <p className="text-[11px] text-gray-500 mt-2 font-mono">
                      Dispatched using configured Resend delivery credentials.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loadingAction === "test_email"}
                      className="bg-[#0A1D16] hover:bg-[#164A41] disabled:opacity-50 text-white rounded-full py-3.5 px-6 font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loadingAction === "test_email" ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Compiling &amp; Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Test Briefing</span>
                          <span>↗</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* CARD 2: MANUAL EXECUTION TRIGGERS */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(22,74,65,0.06)] border border-[#164A41]/10 space-y-6">
                <div className="border-b border-[#164A41]/10 pb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#F1B24A] block mb-1">
                    MANUAL OVERRIDE
                  </span>
                  <h3
                    className="text-xl sm:text-2xl font-medium text-[#164A41] tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Pipeline Execution Triggers
                  </h3>
                  <p className="text-xs text-[#2C5E54] mt-1 leading-relaxed">
                    Trigger individual ingestion or delivery pipeline jobs immediately outside the scheduled cron timetable.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Trigger 1: Force News */}
                  <div className="bg-[#F8FAF8] border border-[#164A41]/15 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#164A41] bg-[#164A41]/10 px-2 py-0.5 rounded-full inline-block mb-2">
                        Scrape &amp; Cluster
                      </span>
                      <h4 className="text-sm font-bold text-[#164A41] mb-1">
                        News Ingestion Cycle
                      </h4>
                      <p className="text-xs text-[#2C5E54] mb-4 leading-relaxed font-light">
                        Fetches RSS, HN, Telegram, Market Pulse, and GitHub, then synthesizes into the database without sending emails.
                      </p>
                    </div>

                    <button
                      onClick={handleForceNews}
                      disabled={loadingAction === "force_news"}
                      className="w-full bg-[#164A41] hover:bg-[#0A1D16] disabled:opacity-50 text-white font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      {loadingAction === "force_news" ? "Running Ingestion..." : "Execute News Cycle"}
                    </button>
                  </div>

                  {/* Trigger 2: Morning Dispatch */}
                  <div className="bg-[#F8FAF8] border border-[#F1B24A]/40 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#164A41] bg-[#F1B24A]/30 px-2 py-0.5 rounded-full inline-block mb-2">
                        Full Dispatch
                      </span>
                      <h4 className="text-sm font-bold text-[#164A41] mb-1">
                        Morning Briefing Batch
                      </h4>
                      <p className="text-xs text-[#2C5E54] mb-4 leading-relaxed font-light">
                        Executes full scraping, synthesis pass, and batches the briefing email to all active verified subscribers.
                      </p>
                    </div>

                    <button
                      onClick={handleSendMorningBrief}
                      disabled={loadingAction === "morning_brief"}
                      className="w-full bg-[#F1B24A] hover:bg-[#dfa23c] disabled:opacity-50 text-[#164A41] font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      {loadingAction === "morning_brief" ? "Dispatching Batch..." : "Trigger Morning Dispatch"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: SYSTEM TELEMETRY & CRON SCHEDULES */}
            <div id="telemetry" className="lg:col-span-5 space-y-8">
              {/* PANEL 1: LIVE SYSTEM TELEMETRY */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(22,74,65,0.06)] border border-[#164A41]/10 space-y-4">
                <div className="flex items-center justify-between border-b border-[#164A41]/10 pb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#F1B24A]">
                    INFRASTRUCTURE HEARTBEAT
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Database Engine:</span>
                    <span className="font-bold text-[#164A41]">
                      {health?.database.mode || "Syncing..."}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Intelligence Items:</span>
                    <span className="font-bold text-[#164A41]">
                      {health?.counts.ai_intelligence_items ?? "--"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Active Subscribers:</span>
                    <span className="font-bold text-[#164A41]">
                      {subscribers.length > 0
                        ? subscribers.filter((s) => s.is_subscribed !== 0).length
                        : (health?.counts.active_users ?? "--")}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Market Snapshots:</span>
                    <span className="font-bold text-[#164A41]">
                      {health?.counts.compute_market_snapshots ?? "--"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">GitHub Snapshots:</span>
                    <span className="font-bold text-[#164A41]">
                      {health?.counts.github_trending_snapshots ?? "--"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">Scheduler Timezone:</span>
                    <span className="font-bold text-[#164A41]">
                      {health?.scheduler.timezone || "Africa/Nairobi"}
                    </span>
                  </div>
                </div>
              </div>

              {/* PANEL 2: SCHEDULER CRON TIMETABLE */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(22,74,65,0.06)] border border-[#164A41]/10 space-y-4">
                <div className="border-b border-[#164A41]/10 pb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#F1B24A] block mb-1">
                    AUTOMATED CRON
                  </span>
                  <h4
                    className="text-lg font-medium text-[#164A41]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Scheduler Timetable
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  {health?.scheduler.jobs && health.scheduler.jobs.length > 0 ? (
                    health.scheduler.jobs.map((job) => (
                      <div
                        key={job.id}
                        className="border-l-2 border-[#F1B24A] pl-3 py-1 bg-[#FAF9F5] rounded-r-xl"
                      >
                        <div className="font-bold text-[#164A41]">{job.name}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                          Next: {job.next_run_time ? job.next_run_time.slice(0, 19).replace("T", " ") : "Active"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 font-mono py-2">
                      Loading cron timetable...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* 3. SUBSCRIBER INTELLIGENCE & ACCESS REGISTRY TABLE                 */}
          {/* ================================================================== */}
          <div
            id="subscribers-registry"
            className="bg-[#164A41] rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(22,74,65,0.28)] border border-[#9DC88D]/25 space-y-6 text-white"
          >
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#F1B24A] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.25em]">
                    02 &nbsp; DATABASE REGISTRY — SUBSCRIBERS DIRECTORY
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-medium tracking-tight text-white drop-shadow-sm"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Subscriber Telemetry &amp; Access Controls
                </h3>
                <p className="text-xs text-white/80 mt-1.5 max-w-2xl leading-relaxed font-light">
                  Direct database extraction of all active intelligence subscribers. Master Administrative Controls allow immediate subscriber deletion and irreversible termination of daily dispatch pipelines.
                </p>
              </div>

              {/* Action Toolbar: Search + Refresh + Total Count */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
                {/* Search Bar */}
                <div className="relative min-w-[220px] sm:min-w-[260px]">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-xs">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    placeholder="Search by email..."
                    className="w-full bg-[#0A1D16]/80 border border-[#9DC88D]/30 focus:border-[#F1B24A] rounded-full pl-9 pr-8 py-2 text-xs text-white font-mono focus:outline-none transition-all placeholder:text-white/45 shadow-sm"
                  />
                  {subscriberSearch && (
                    <button
                      onClick={() => setSubscriberSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs cursor-pointer"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Live Count Pill */}
                <div className="bg-[#0A1D16]/80 border border-[#9DC88D]/30 px-3.5 py-2 rounded-full text-[11px] font-mono text-white shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-[#F1B24A]">{subscribers.length}</span>
                  <span className="text-white/70 text-[10px] uppercase tracking-wider">Subscribers</span>
                </div>

                {/* Refresh Database Button */}
                <button
                  onClick={() => fetchUsers()}
                  disabled={subscribersLoading}
                  className="bg-[#F1B24A] hover:bg-[#dfa23c] active:scale-95 text-[#164A41] px-4 py-2 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Reload subscriber list directly from database"
                >
                  <span className={`text-xs ${subscribersLoading ? "animate-spin" : ""}`}>🔄</span>
                  <span>{subscribersLoading ? "Syncing..." : "Sync DB"}</span>
                </button>
              </div>
            </div>

            {/* Error Message if Fetch Failed */}
            {subscribersError && (
              <div className="bg-amber-500/15 border border-amber-400/40 text-amber-200 p-4 rounded-2xl text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono">
                  <span>⚠️</span>
                  <span>{subscribersError}</span>
                </div>
                <button
                  onClick={() => fetchUsers()}
                  className="underline font-bold text-[#F1B24A] hover:text-white uppercase text-[10px] font-mono cursor-pointer shrink-0"
                >
                  Retry Query
                </button>
              </div>
            )}

            {/* SUBSCRIBERS TABLE CONTAINER */}
            <div className="bg-[#0A1D16] rounded-2xl shadow-2xl border border-[#9DC88D]/25 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#081812] border-b border-[#9DC88D]/20 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#F1B24A]">
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6 w-14"># ID</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Subscriber Email</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">Day Subscribed</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-center">Status</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-right">Master Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans text-xs sm:text-sm">
                    {subscribersLoading && subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="h-7 w-7 border-3 border-[#F1B24A] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-mono text-[#9DC88D] uppercase tracking-wider">
                              Reading Subscriber Records from Database...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="max-w-sm mx-auto text-center space-y-2">
                            <div className="text-2xl">📬</div>
                            <p className="font-bold text-white text-sm">
                              {subscriberSearch ? "No matching subscribers found" : "No subscribers recorded in database"}
                            </p>
                            <p className="text-xs text-white/60 font-light">
                              {subscriberSearch
                                ? `No subscriber email matches "${subscriberSearch}". Try a different search term.`
                                : "Subscribers who submit their email on the public portal will appear here in real-time."}
                            </p>
                            {subscriberSearch && (
                              <button
                                onClick={() => setSubscriberSearch("")}
                                className="text-xs font-mono text-[#F1B24A] hover:underline font-bold pt-1 cursor-pointer"
                              >
                                Clear search query
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((user, idx) => {
                        const dateInfo = formatSubscribedDate(user.created_at);
                        const isSubscribed = user.is_subscribed === 1 || user.is_subscribed === undefined;
                        const isDeletingThis = deletingUserId === user.id;

                        return (
                          <tr
                            key={user.id || idx}
                            className="hover:bg-[#164A41]/40 transition-colors group"
                          >
                            {/* Column 1: Record ID */}
                            <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#9DC88D]/70 font-medium whitespace-nowrap">
                              #{user.id}
                            </td>

                            {/* Column 2: Subscriber Email & Username */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-white text-xs sm:text-sm tracking-tight">
                                  {user.email}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(user.email)}
                                  className="text-[10px] font-mono text-white/50 hover:text-white p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                  title="Copy email address"
                                >
                                  {copiedEmail === user.email ? "✓ Copied" : "📋"}
                                </button>
                              </div>
                              {user.username && user.username !== user.email.split("@")[0] && (
                                <div className="text-[11px] text-[#9DC88D]/70 font-mono mt-0.5">
                                  User handle: @{user.username}
                                </div>
                              )}
                            </td>

                            {/* Column 3: Day Subscribed */}
                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white">
                                  {dateInfo.date}
                                </span>
                                {dateInfo.relative && (
                                  <span className="text-[10px] font-mono bg-[#164A41] text-[#9DC88D] border border-[#9DC88D]/30 px-2 py-0.5 rounded-full font-semibold">
                                    {dateInfo.relative}
                                  </span>
                                )}
                              </div>
                              {dateInfo.time && (
                                <div className="text-[11px] font-mono text-white/45 mt-0.5">
                                  {dateInfo.time}
                                </div>
                              )}
                            </td>

                            {/* Column 4: Subscription Status */}
                            <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                              {isSubscribed ? (
                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                  <span>Subscribed</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                  <span>Unsubscribed</span>
                                </span>
                              )}
                            </td>

                            {/* Column 5: Master Command Action Button */}
                            <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                              <button
                                onClick={() => setConfirmDeleteUser(user)}
                                disabled={isDeletingThis}
                                className="inline-flex items-center gap-1.5 bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/35 hover:border-rose-600 disabled:opacity-50 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer ml-auto"
                                title="Irreversibly delete subscriber details & master unsubscribe"
                              >
                                {isDeletingThis ? (
                                  <>
                                    <span className="h-3 w-3 border-2 border-rose-300 border-t-transparent rounded-full animate-spin"></span>
                                    <span>Unsubscribing...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>✕</span>
                                    <span>Master Unsubscribe</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="bg-[#081812] border-t border-[#9DC88D]/20 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#9DC88D]/70">
                <div className="flex items-center gap-2">
                  <span>Source: Institutional Database (users table)</span>
                  <span>•</span>
                  <span>{filteredSubscribers.length} of {subscribers.length} shown</span>
                </div>
                <div className="text-[11px] text-white/40">
                  Deletion executes permanent unsubscription &amp; database cascade purge.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER — MATCHING LANDING PAGE                                     */}
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

      {/* ================================================================== */}
      {/* MASTER UNSUBSCRIBE CONFIRMATION MODAL                              */}
      {/* ================================================================== */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-200 text-[#164A41] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg font-bold shrink-0">
                ⚠️
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-rose-600 block">
                  CRITICAL ADMINISTRATIVE COMMAND
                </span>
                <h4
                  className="text-lg sm:text-xl font-bold text-[#164A41] tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Confirm Master Unsubscribe
                </h4>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#2C5E54] leading-relaxed bg-[#F8FAF8] border border-gray-200/80 p-4 rounded-2xl">
              <p>
                You are about to irreversibly purge all subscription credentials and database records for:
              </p>
              <div className="p-2.5 bg-white border border-[#164A41]/10 rounded-xl font-mono text-xs font-bold text-[#164A41] break-all">
                {confirmDeleteUser.email}
              </div>
              <p className="text-[11px] text-gray-500 font-light">
                This subscriber will immediately cease receiving daily morning intelligence briefings. Both the user account and subscriber tracking row will be deleted from the database.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteUser(null)}
                disabled={deletingUserId !== null}
                className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 text-xs font-mono font-semibold text-gray-700 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleMasterUnsubscribe(confirmDeleteUser)}
                disabled={deletingUserId !== null}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deletingUserId === confirmDeleteUser.id ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Unsubscribe</span>
                    <span>🗑️</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
