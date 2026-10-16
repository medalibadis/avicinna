'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState(''); // Honeypot decoy
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // Countdown timer for IP lockout
  useEffect(() => {
    if (!lockoutTimer || lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer && lockoutTimer > 0) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: username,
          password,
          securityPin,
          company_website: companyWebsite, // Bot trap
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.locked && data.retryAfter) {
          setLockoutTimer(data.retryAfter);
        }
        if (typeof data.remainingAttempts === 'number') {
          setRemainingAttempts(data.remainingAttempts);
        }
        throw new Error(data.error || 'فشل تسجيل الدخول / Authentication failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(from);
        router.refresh();
      }, 400);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutTimer !== null && lockoutTimer > 0;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0097FB] to-[#0f766e]"></div>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex justify-center mb-3">
          <Logo size="md" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          لوحة الإدارة المركزية
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          AVICINNA Multi-Factor Administrative Portal
        </p>
      </div>

      {/* Security Advisory Badge */}
      <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0097FB] flex-shrink-0" />
          <span>حماية مشددة ضد التخمين (Anti-Brute-Force)</span>
        </div>
        {remainingAttempts !== null && !isLocked && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
            {remainingAttempts} محاولات
          </span>
        )}
      </div>

      {/* IP Lockout Warning Banner */}
      {isLocked && (
        <div className="mb-5 p-4 bg-red-100 border-2 border-red-300 rounded-xl flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">تم إغلاق البوابة مؤقتاً لحماية النظام!</div>
            <p className="mt-1 text-[11px] text-red-800">
              تم اكتشاف محاولات غير مصرح بها متكررة. تم حظر عنوان IP تلقائياً.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-red-950">
              <Clock className="w-3.5 h-3.5 text-red-700" />
              <span>إعادة الفتح بعد: {Math.floor(lockoutTimer / 60)}:{(lockoutTimer % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && !isLocked && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>تم التحقق بنجاح من كافة العوامل. جاري الدخول...</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot Hidden Input (Bots fill this, humans never see it) */}
        <input
          type="text"
          name="company_website"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none', height: 0, width: 0 }}
          aria-hidden="true"
        />

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-start">
            اسم المستخدم / Admin Identifier
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              disabled={isLocked}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097FB] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-start">
            كلمة المرور / Master Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLocked}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097FB] focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 6-Digit Master Security PIN */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-start">
            رمز الأمان الإداري (6 أرقام) / 6-Digit Security PIN
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              required
              disabled={isLocked}
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              autoComplete="one-time-code"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#0097FB] focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-start">
            رمز أمان ثابت مخصص فقط لإدارة منصة أفيسينا
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || success || isLocked}
          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-[#032654] to-[#0097FB] hover:from-[#021f44] hover:to-[#0086df] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>تسجيل الدخول الآمن / Secure Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <Link href="/" className="hover:text-[#0097FB] transition-colors">
          ← العودة للرئيسية / Return to Home
        </Link>
        <span className="font-mono text-[10px] text-slate-400">Rate-Limited & Encrypted</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a192f] via-[#0f172a] to-[#1e293b] flex items-center justify-center p-4 selection:bg-[#0097FB] selection:text-white">
      <Suspense fallback={<div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
