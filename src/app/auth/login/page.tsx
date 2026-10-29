'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/data/translations';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Activity,
  Check,
  Building2,
  Cpu,
} from 'lucide-react';

// Multilingual translations for the Executive Admin Portal
const LOGIN_I18N = {
  ar: {
    portalBadge: 'بوابة الحماية المشددة • الدخول الإداري المركزي',
    portalTitle: 'لوحة الإدارة المركزية',
    portalSubtitle: 'التحقق متعدد العوامل لمنظومة أفيسينا للرعاية الصحية الدولية في تركيا',
    adminIdLabel: 'معرف المدير أو المسؤول',
    adminIdPlaceholder: 'اسم المستخدم الإداري',
    passwordLabel: 'كلمة المرور الرئيسية',
    passwordPlaceholder: '••••••••••••',
    pinLabel: 'رمز الأمان الرقمي (6 أرقام)',
    pinPlaceholder: 'أدخل 6 أرقام',
    pinHint: 'رمز أمان ثابت ومشفر مخصص لإدارة منظومة أفيسينا',
    signInButton: 'تسجيل الدخول الآمن للأدمن',
    signingIn: 'جاري التحقق وتشفير الجلسة...',
    successMessage: 'تم التحقق بنجاح من كافة عوامل الأمان. جاري فتح لوحة التحكم...',
    backToHome: 'العودة للموقع الرئيسي',
    encryptedBadge: 'تشفير فائق AES-256 GCM',
    threatMitigation: 'حماية نشطة ضد التخمين (Anti-Brute Force)',
    attemptsLeft: (n: number) => `${n} محاولات متبقية قبل الإغلاق الأمني`,
    lockedTitle: 'تم إغلاق البوابة مؤقتاً لحماية النظام!',
    lockedDesc: 'تم اكتشاف محاولات غير مصرح بها متكررة. تم تعليق تسجيل الدخول لهذا العنوان IP مؤقتاً.',
    cooldownIn: 'إعادة إتاحة الدخول بعد:',
    telemetryTitle: 'المنظومة المركزية للرعاية الصحية',
    telemetryDesc: 'بوابة إدارة متطورة تشرف على شبكة مستشفيات تركيا المعتمدة دولياً (JCI)، نخبة الجراحين والاستشاريين، والرحلات العلاجية الدولية بدقة فائقة.',
    stat1Title: 'شبكة المستشفيات المعتمدة',
    stat1Desc: '14 صرحاً طبياً مرخصاً (JCI)',
    stat2Title: 'بروتوكول الأمان الفيدرالي',
    stat2Desc: 'Zero-Trust MFA متعدد العوامل',
    stat3Title: 'جاهزية المنظومة المباشرة',
    stat3Desc: 'معدل تشغيل 99.99% نشط',
    complianceBadge: 'معتمد وفق معايير HIPAA و ISO/IEC 27001 لحماية البيانات الطبية',
    authRequired: 'منطقة محظورة: يقتصر الدخول على مسؤولي مجلس إدارة أفيسينا والكوادر الطبية المخولة.',
  },
  en: {
    portalBadge: 'High-Security Sentinel • Administrative Gateway',
    portalTitle: 'Administrative Core Portal',
    portalSubtitle: 'Multi-Factor Authentication for AVICINNA International Healthcare Turkey',
    adminIdLabel: 'Admin Identifier',
    adminIdPlaceholder: 'Enter admin username',
    passwordLabel: 'Master Password',
    passwordPlaceholder: '••••••••••••',
    pinLabel: 'Security Token PIN (6 digits)',
    pinPlaceholder: 'Enter 6 digits',
    pinHint: 'Dedicated static security token for platform administrators',
    signInButton: 'Authorize & Secure Sign In',
    signingIn: 'Verifying credentials & encrypting session...',
    successMessage: 'Security handshake verified. Launching administrative suite...',
    backToHome: 'Return to Public Website',
    encryptedBadge: 'AES-256 GCM Cryptography',
    threatMitigation: 'Active Anti-Brute Force & Threat Sentinel',
    attemptsLeft: (n: number) => `${n} attempts remaining before IP lockout`,
    lockedTitle: 'Administrative Gateway Temporarily Quarantined!',
    lockedDesc: 'Repeated unauthorized access attempts detected. This IP address has been temporarily suspended.',
    cooldownIn: 'Cooldown expires in:',
    telemetryTitle: 'Central Medical Operations Core',
    telemetryDesc: 'Unified enterprise healthcare gateway orchestrating Turkey’s premier network of JCI-accredited medical facilities, distinguished surgical chairs, and international patient journeys.',
    stat1Title: 'Accredited Hospital Network',
    stat1Desc: '14 JCI-Certified Hospital Centers',
    stat2Title: 'Zero-Trust Protocol',
    stat2Desc: 'Multi-Factor Enforced Session',
    stat3Title: 'System Availability',
    stat3Desc: '99.99% Operational Uptime',
    complianceBadge: 'HIPAA Compliant & ISO/IEC 27001 Certified Architecture',
    authRequired: 'Restricted Area: Access is strictly limited to authorized AVICINNA executive directors.',
  },
  fr: {
    portalBadge: 'Sentinelle Haute Sécurité • Passerelle Administrative',
    portalTitle: 'Portail d’Administration Centrale',
    portalSubtitle: 'Authentification multi-facteurs de la plateforme médicale AVICINNA Turquie',
    adminIdLabel: 'Identifiant Administrateur',
    adminIdPlaceholder: 'Entrez votre identifiant',
    passwordLabel: 'Mot de passe principal',
    passwordPlaceholder: '••••••••••••',
    pinLabel: 'Code PIN de Sécurité (6 chiffres)',
    pinPlaceholder: 'Entrez 6 chiffres',
    pinHint: 'Code de sécurité dédié aux administrateurs de la plateforme',
    signInButton: 'Connexion Sécurisée Administrateur',
    signingIn: 'Vérification des identifiants et chiffrement...',
    successMessage: 'Authentification validée. Chargement du tableau de bord...',
    backToHome: 'Retour au site public',
    encryptedBadge: 'Chiffrement AES-256 GCM',
    threatMitigation: 'Protection active contre les attaques par force brute',
    attemptsLeft: (n: number) => `${n} tentatives restantes avant verrouillage`,
    lockedTitle: 'Portail temporairement verrouillé !',
    lockedDesc: 'Tentatives non autorisées répétées détectées. Votre adresse IP a été suspendue temporairement.',
    cooldownIn: 'Réouverture automatique dans :',
    telemetryTitle: 'Noyau des Opérations Médicales Centrales',
    telemetryDesc: 'Passerelle d’administration unifiée reliant le réseau des meilleurs hôpitaux turcs accrédités JCI, professeurs de chirurgie et parcours de soins internationaux.',
    stat1Title: 'Réseau d’Hôpitaux Accrédités',
    stat1Desc: '14 Hôpitaux d’Excellence (JCI)',
    stat2Title: 'Protocole Zero-Trust',
    stat2Desc: 'MFA Multi-Facteurs Renforcé',
    stat3Title: 'Disponibilité Système',
    stat3Desc: '99.99% En Ligne & Actif',
    complianceBadge: 'Architecture conforme aux normes HIPAA et ISO/IEC 27001',
    authRequired: 'Zone Restreinte : Accès strictement réservé aux membres de la direction AVICINNA.',
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const { language, setLanguage, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const t = LOGIN_I18N[language] || LOGIN_I18N.ar;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState(''); // Honeypot bot-trap
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
        throw new Error(data.error || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Authentication failed'));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(from);
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during authentication');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutTimer !== null && lockoutTimer > 0;
  const pinLength = securityPin.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
      {/* Top Floating Utility Bar */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all backdrop-blur-xl shadow-lg hover:shadow-cyan-500/10"
        >
          {isRtl ? (
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-[#0097FB]" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#0097FB]" />
          )}
          <span>{t.backToHome}</span>
        </Link>

        {/* Security Badge & Language Switcher Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 backdrop-blur-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>TLS 1.3 • AES-256</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center p-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-md">
            {(['ar', 'en', 'fr'] as Language[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  language === lng
                    ? 'bg-[#0097FB] text-white shadow-[0_0_12px_rgba(0,151,251,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lng}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Brand Telemetry & Executive Platform Credentials */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-start">
          {/* Logo Showcase with Ambient Glow */}
          <div className="relative inline-block w-fit">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#0097FB]/25 to-teal-500/20 rounded-3xl blur-2xl opacity-75 pointer-events-none" />
            <div className="relative p-2 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
              <Logo variant="full-white" size="lg" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0097FB]" />
              <span>{t.portalBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {t.telemetryTitle}
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed font-normal">
              {t.telemetryDesc}
            </p>
          </div>

          {/* Real-Time Platform Status Cards */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 shadow-md hover:border-slate-700/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>{t.stat1Title}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{t.stat1Desc}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 shadow-md hover:border-slate-700/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[#0097FB] flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{t.stat2Title}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{t.stat2Desc}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3.5 shadow-md hover:border-slate-700/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{t.stat3Title}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{t.stat3Desc}</div>
              </div>
            </div>
          </div>

          {/* Compliance & Security Footnote */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-800/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{t.complianceBadge}</span>
          </div>
        </div>

        {/* Right Column: Executive Glassmorphic Gateway Card */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full relative rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-7 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(0,151,251,0.12)] overflow-hidden"
          >
            {/* Top Glowing Laser Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0097FB] to-transparent opacity-90" />
            
            {/* Ambient Background Light Cone */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#0097FB]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Portal Card Header */}
            <div className="relative mb-6 text-start">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0097FB]/20 to-teal-500/20 border border-[#0097FB]/40 flex items-center justify-center text-[#0097FB] shadow-[0_0_20px_rgba(0,151,251,0.3)]">
                  <Lock className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-medium text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.encryptedBadge}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {t.portalTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-normal leading-relaxed">
                {t.portalSubtitle}
              </p>
            </div>

            {/* Threat Mitigation Status Banner */}
            <div className="mb-5 p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0097FB] flex-shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">{t.threatMitigation}</span>
              </div>
              {remainingAttempts !== null && !isLocked && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {t.attemptsLeft(remainingAttempts)}
                </span>
              )}
            </div>

            {/* IP Lockout Warning Banner */}
            <AnimatePresence>
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-4 rounded-2xl bg-red-950/70 border-2 border-red-500/60 text-red-200 text-xs overflow-hidden shadow-lg shadow-red-950/50"
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-start">
                      <div className="font-bold text-sm text-red-300">{t.lockedTitle}</div>
                      <p className="mt-1 text-[11px] text-red-200/90 leading-relaxed">
                        {t.lockedDesc}
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-900/60 border border-red-700/50 text-xs font-mono font-bold text-red-100">
                        <Clock className="w-3.5 h-3.5 text-red-400" />
                        <span>
                          {t.cooldownIn} {Math.floor(lockoutTimer / 60)}:{(lockoutTimer % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Notification */}
            <AnimatePresence>
              {error && !isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 flex items-start gap-3 text-xs text-red-200 text-start"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Notification */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/80 flex items-center gap-3 text-xs text-emerald-200 text-start"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="font-medium">{t.successMessage}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-start">
              {/* Honeypot Decoy Input (Invisible to humans, catches malicious automated scripts) */}
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

              {/* Admin Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.adminIdLabel}
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0097FB] transition-colors`}>
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t.adminIdPlaceholder}
                    autoComplete="username"
                    className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0097FB]/50 focus:border-[#0097FB] transition-all shadow-inner disabled:opacity-50`}
                  />
                </div>
              </div>

              {/* Master Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.passwordLabel}
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0097FB] transition-colors`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLocked}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    autoComplete="current-password"
                    className={`w-full ${isRtl ? 'pr-10 pl-11' : 'pl-10 pr-11'} py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0097FB]/50 focus:border-[#0097FB] transition-all shadow-inner disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${isRtl ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer`}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 6-Digit Security Token PIN */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {t.pinLabel}
                  </label>
                  {/* Visual Tactile 6-Dot Indicator */}
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const isFilled = idx < pinLength;
                      return (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            isFilled
                              ? 'bg-[#0097FB] shadow-[0_0_8px_rgba(0,151,251,0.9)] scale-110'
                              : 'bg-slate-800 border border-slate-700/60'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="relative group">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0097FB] transition-colors`}>
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
                    placeholder={t.pinPlaceholder}
                    autoComplete="one-time-code"
                    className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0097FB]/50 focus:border-[#0097FB] transition-all shadow-inner disabled:opacity-50`}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 font-normal">
                  {t.pinHint}
                </p>
              </div>

              {/* Submit CTA Button */}
              <motion.button
                type="submit"
                disabled={loading || success || isLocked}
                whileHover={!loading && !isLocked ? { scale: 1.01 } : {}}
                whileTap={!loading && !isLocked ? { scale: 0.99 } : {}}
                className="w-full relative group mt-3 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#0097FB] via-[#0084dd] to-[#0266b8] hover:from-[#0aa0ff] hover:to-[#0372cc] shadow-[0_4px_25px_rgba(0,151,251,0.4)] hover:shadow-[0_4px_30px_rgba(0,151,251,0.6)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Button Shimmer Ray */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.signingIn}</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>{t.signInButton}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </>
                )}
              </motion.button>
            </form>

            {/* Bottom Security Notice */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
              <span className="text-center sm:text-start">{t.authRequired}</span>
              <span className="font-mono text-[10px] text-slate-500 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 flex-shrink-0">
                SENTINEL v2.4.8
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#070C18] relative overflow-hidden flex flex-col justify-center items-center selection:bg-[#0097FB] selection:text-white">
      {/* Dynamic Cyber-Medical Background Gradients & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_-10%,rgba(0,151,251,0.2),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_85%_105%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
      
      {/* Micro Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 70%, transparent 100%)',
        }}
      />

      {/* Center Subtle Radial Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-[#0097FB]/20 border-t-[#0097FB] rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-mono tracking-wider">INITIALIZING SENTINEL...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
