"use client";

import React, { useState } from 'react';

// Common typo domains to block
const BLOCKED_DOMAINS = [
  'gmail.co', 'gamil.com', 'gmai.com', 'gmail.com.co',
  'yahoo.cm', 'yaho.com', 'yahoo.co',
  'hotmail.co', 'hotmal.com',
  'outlook.co'
];

// RFC 5322 compliant regex for lightweight client-side email format validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validateSubscriberEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return "Email address is required";
  }
  if (trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) {
    return "Invalid email address format";
  }
  const parts = trimmed.split('@');
  const domain = parts[1];
  if (domain && BLOCKED_DOMAINS.includes(domain)) {
    return "Check your email domain for typos (e.g., .co instead of .com)";
  }
  return null;
}

interface SubscribeFormProps {
  className?: string;
}

export default function SubscribeForm({ className = "" }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate_limited'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Real-time onBlur validation (Apple-style instant feedback)
  const handleBlur = () => {
    if (!email.trim()) {
      setError(null);
      return;
    }
    const validationError = validateSubscriberEmail(email);
    setError(validationError);
  };

  // Real-time onChange: instantly clear error so red warning disappears as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Frontend validation pre-check
    const validationError = validateSubscriberEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setError(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setStatus('rate_limited');
        setErrorMessage(data.error || 'Too many requests. Please try again in 48 hours.');
        return;
      }

      if (!res.ok) {
        setStatus('error');
        const msg = data.error || 'Unable to complete subscription. Please check your email.';
        setErrorMessage(msg);
        setError(msg);
        return;
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Network error occurred. Please try again.'
      );
    }
  };

  return (
    <div
      className={`bg-[#7E9387]/35 sm:bg-[#7E9387]/40 backdrop-blur-xl border border-white/30 p-2 sm:p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] w-full transition-all duration-300 ${
        error ? 'rounded-2xl sm:rounded-[1.75rem]' : 'rounded-full'
      } ${className}`}
    >
      {status === 'success' ? (
        <div
          className="flex items-center justify-center gap-2.5 py-2 px-4 text-center transition-all duration-300"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-medium text-white tracking-tight font-sans">
            Subscribed to Sovereign Signals. Intelligence wire active.
          </span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col transition-opacity duration-200"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 w-full">
            <div className="flex-1 min-w-0">
              <input
                type="email"
                required
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your institutional email..."
                className={`w-full rounded-full px-4 sm:px-5 py-2.5 sm:py-3 font-sans text-xs sm:text-sm transition-all focus:outline-none ${
                  error
                    ? 'border border-red-500/50 focus:ring-2 focus:ring-red-500/20 text-red-900 bg-red-50/90 placeholder:text-red-400'
                    : 'border border-transparent bg-[#DDE2E0] text-[#122A22] placeholder:text-[#7A8E85] focus:ring-2 focus:ring-gray-900/20'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#0C1521] hover:bg-black text-white rounded-full px-5 sm:px-7 py-2.5 sm:py-3 font-medium font-sans text-xs sm:text-sm whitespace-nowrap active:scale-95 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center shrink-0"
            >
              {status === 'loading' ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Subscribe'
              )}
            </button>
          </div>

          {/* Apple-style Animated Error Message directly below input */}
          {error && (
            <p
              className="text-red-300 text-xs mt-2 ml-2 sm:ml-3 tracking-wide font-sans overflow-hidden transition-all duration-200"
            >
              {error}
            </p>
          )}
        </form>
      )}

      {status === 'rate_limited' && (
        <div
          className="text-[11px] text-amber-200 bg-amber-950/60 border border-amber-500/30 rounded-full px-4 py-1.5 mt-2 text-center font-sans transition-all"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

