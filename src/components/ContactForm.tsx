"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate_limited'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setStatus('rate_limited');
        setErrorMessage(data.error || 'Too many requests. Please try again in 48 hours.');
        return;
      }

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to dispatch inquiry. Please try again.');
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
    <div className="bg-[#72877C]/45 backdrop-blur-xl border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-9 shadow-[0_16px_50px_rgba(0,0,0,0.25)] w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-center py-8"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight font-sans">
              Message received.
            </h3>
            <p className="text-sm text-white/70 mt-2 font-sans">
              Thank you for reaching out. Our research dispatch desk will be in touch shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#A5B9AF] uppercase tracking-[0.18em] mb-2 pl-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Alexander Vance"
                className="w-full bg-[#DDE2E0] border border-white/10 rounded-2xl px-5 py-3.5 text-[#122A22] focus:outline-none focus:ring-2 focus:ring-[#F1B24A]/40 transition-all font-sans text-sm placeholder:text-[#889890]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#A5B9AF] uppercase tracking-[0.18em] mb-2 pl-1">
                Institutional Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alexander@institute.org"
                className="w-full bg-[#DDE2E0] border border-white/10 rounded-2xl px-5 py-3.5 text-[#122A22] focus:outline-none focus:ring-2 focus:ring-[#F1B24A]/40 transition-all font-sans text-sm placeholder:text-[#889890]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#A5B9AF] uppercase tracking-[0.18em] mb-2 pl-1">
                Message / Inquiry
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Inquiring about institutional compute telemetry and sovereign model feeds..."
                className="w-full bg-[#DDE2E0] border border-white/10 rounded-2xl px-5 py-3.5 text-[#122A22] focus:outline-none focus:ring-2 focus:ring-[#F1B24A]/40 transition-all font-sans text-sm placeholder:text-[#889890] resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto bg-[#0C1521] hover:bg-black text-white rounded-full px-8 py-3.5 font-medium active:scale-95 transition-all font-sans text-sm shadow-md disabled:opacity-50 flex items-center justify-center min-w-[150px]"
              >
                {status === 'loading' ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Message'
                )}
              </button>
            </div>

            {status === 'rate_limited' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-amber-200 bg-amber-950/60 border border-amber-500/30 rounded-xl px-4 py-2.5 text-center font-sans"
              >
                {errorMessage}
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-200 bg-rose-950/60 border border-rose-500/30 rounded-xl px-4 py-2.5 text-center font-sans"
              >
                {errorMessage}
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

