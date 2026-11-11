'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { ActivityLogEntry, AdminRole, SafeAdminUser } from '@/types/cms';
import {
  ShieldCheck,
  KeyRound,
  UserPlus,
  Smartphone,
  Activity,
  Lock,
  CheckCircle2,
  Trash2,
  Copy,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const secDict = {
  ar: {
    pageTitle: 'الأمان، حسابات الفريق، 2FA وسجل النشاط',
    pageSub: 'حسابات منفصلة بصلاحيات محددة، تحقق ثنائي حقيقي عبر تطبيق المصادقة، إدارة كلمات المرور، ومراقبة كافة الإجراءات.',
    changePwTitle: 'تغيير كلمة المرور الخاصة بي',
    currentPwPlaceholder: 'كلمة المرور الحالية',
    newPwPlaceholder: 'كلمة المرور الجديدة (8 أحرف على الأقل)',
    updatePwBtn: 'تحديث كلمة المرور',
    pwUpdated: 'تم تحديث كلمة المرور بنجاح',
    pwUpdateFail: 'فشل تحديث كلمة المرور',
    twoFaTitle: 'المصادقة الثنائية (تطبيق Authenticator TOTP)',
    twoFaActive: 'مفعّل',
    twoFaDisabled: 'معطّل',
    twoFaProtected: 'الحساب محمي عبر تطبيق المصادقة (Google Authenticator / Authy).',
    disable2faPlaceholder: 'أدخل كلمة المرور الحالية لتعطيل 2FA',
    disable2faBtn: 'تعطيل المصادقة الثنائية',
    twoFaDisabledToast: 'تم تعطيل المصادقة الثنائية',
    twoFaEnabledToast: 'تم تفعيل تطبيق المصادقة 2FA بنجاح!',
    invalidCodeToast: 'رمز التحقق غير صحيح (6 أرقام)',
    pwVerifyFail: 'فشل التحقق من كلمة المرور',
    step1Scan: '1. امسح رمز QR بتطبيق المصادقة',
    secretLabel: 'المفتاح السري:',
    copySecret: 'نسخ المفتاح',
    secretCopied: 'تم نسخ المفتاح السري',
    step2Placeholder: '2. أدخل الرمز المكوّن من 6 أرقام للتأكيد',
    verifyActivateBtn: 'تأكيد وتفعيل 2FA',
    cancelSetupBtn: 'إلغاء',
    twoFaDesc: 'امسح رمز الاستجابة السريعة باستخدام Google Authenticator أو 1Password أو Authy لحماية الملفات الطبية للمرضى.',
    setup2faBtn: 'إعداد تطبيق المصادقة 2FA',
    teamTitle: 'حسابات الفريق والصلاحيات (RBAC)',
    usernamePlaceholder: 'اسم المستخدم',
    fullNamePlaceholder: 'الاسم الكامل',
    emailPlaceholder: 'البريد الإلكتروني',
    initPwPlaceholder: 'كلمة مرور مبدئية (8+)',
    roleCoord: 'منسق (الطلبات)',
    roleEditor: 'محرر (المحتوى والسيو)',
    roleAdmin: 'مدير عام',
    addUserBtn: 'إضافة مستخدم',
    userCreated: (u: string) => `تم إنشاء حساب ${u} بنجاح`,
    createFail: 'فشل إنشاء حساب العضو',
    colUser: 'المستخدم',
    colEmail: 'البريد الإلكتروني',
    colRole: 'الصلاحية',
    col2fa: '2FA',
    colStatus: 'الحالة',
    colActions: 'إجراءات',
    on: 'مفعّل',
    off: 'غير مفعّل',
    active: 'نشط',
    suspended: 'معلّق',
    statusUpdated: 'تم تحديث حالة الحساب',
    roleChanged: (r: string) => `تم تغيير الصلاحية إلى ${r}`,
    userRemoved: 'تم حذف المستخدم بنجاح',
    logTitle: 'سجل التدقيق والنشاط الأمني والإداري',
    noLogs: 'لا توجد أنشطة مسجلة حتى الآن.',
  },
  fr: {
    pageTitle: 'Sécurité, Comptes Équipe, 2FA & Journal d’Activité',
    pageSub: 'Comptes individuels avec rôles RBAC, double authentification TOTP, gestion des mots de passe et piste d’audit.',
    changePwTitle: 'Changer mon mot de passe',
    currentPwPlaceholder: 'Mot de passe actuel',
    newPwPlaceholder: 'Nouveau mot de passe (min 8 caractères)',
    updatePwBtn: 'Mettre à jour',
    pwUpdated: 'Mot de passe mis à jour avec succès',
    pwUpdateFail: 'Échec de mise à jour du mot de passe',
    twoFaTitle: 'Double Authentification (App TOTP)',
    twoFaActive: 'ACTIF',
    twoFaDisabled: 'DÉSACTIVÉ',
    twoFaProtected: 'Protégé par application Authenticator (Google Authenticator / Authy).',
    disable2faPlaceholder: 'Mot de passe actuel pour désactiver la 2FA',
    disable2faBtn: 'Désactiver la 2FA',
    twoFaDisabledToast: '2FA désactivée',
    twoFaEnabledToast: '2FA Authenticator activée avec succès !',
    invalidCodeToast: 'Code de vérification à 6 chiffres invalide',
    pwVerifyFail: 'Échec de vérification du mot de passe',
    step1Scan: '1. Scanner le QR code dans votre application',
    secretLabel: 'Clé secrète :',
    copySecret: 'Copier la clé',
    secretCopied: 'Clé secrète copiée',
    step2Placeholder: '2. Saisissez le code à 6 chiffres pour confirmer',
    verifyActivateBtn: 'Vérifier & Activer 2FA',
    cancelSetupBtn: 'Annuler',
    twoFaDesc: 'Scannez un QR code avec Google Authenticator, 1Password ou Authy pour sécuriser les dossiers médicaux.',
    setup2faBtn: 'Configurer 2FA Authenticator',
    teamTitle: 'Comptes Équipe & Rôles RBAC',
    usernamePlaceholder: 'Nom d’utilisateur',
    fullNamePlaceholder: 'Nom complet',
    emailPlaceholder: 'Email',
    initPwPlaceholder: 'Mot de passe initial (8+)',
    roleCoord: 'Coordinateur (Leads)',
    roleEditor: 'Éditeur (CMS / SEO)',
    roleAdmin: 'Administrateur',
    addUserBtn: 'Ajouter',
    userCreated: (u: string) => `Compte ${u} créé avec succès`,
    createFail: 'Impossible de créer le compte',
    colUser: 'Utilisateur',
    colEmail: 'Email',
    colRole: 'Rôle',
    col2fa: '2FA',
    colStatus: 'Statut',
    colActions: 'Actions',
    on: 'Activée',
    off: 'Désactivée',
    active: 'Actif',
    suspended: 'Suspendu',
    statusUpdated: 'Statut du compte mis à jour',
    roleChanged: (r: string) => `Rôle modifié vers ${r}`,
    userRemoved: 'Utilisateur supprimé',
    logTitle: 'Journal d’Audit de Sécurité & Édition',
    noLogs: 'Aucune activité enregistrée pour le moment.',
  },
  en: {
    pageTitle: 'Security, Team Accounts, 2FA & Activity Audit Log',
    pageSub: 'Individual accounts with role-based permissions, TOTP authenticator app 2FA, password controls, and full activity auditing.',
    changePwTitle: 'Change My Password',
    currentPwPlaceholder: 'Current Password',
    newPwPlaceholder: 'New Password (min 8 characters)',
    updatePwBtn: 'Update Password',
    pwUpdated: 'Password updated cleanly',
    pwUpdateFail: 'Password update failed',
    twoFaTitle: 'Two-Factor Authentication (TOTP App)',
    twoFaActive: 'ACTIVE',
    twoFaDisabled: 'DISABLED',
    twoFaProtected: 'Protected by Authenticator App (Google Authenticator / Authy).',
    disable2faPlaceholder: 'Enter current password to disable 2FA',
    disable2faBtn: 'Disable 2FA',
    twoFaDisabledToast: '2FA disabled',
    twoFaEnabledToast: 'Authenticator App 2FA enabled!',
    invalidCodeToast: 'Invalid 6-digit code',
    pwVerifyFail: 'Password verification failed',
    step1Scan: '1. Scan QR in Authenticator App',
    secretLabel: 'Secret:',
    copySecret: 'Copy Secret',
    secretCopied: 'Secret copied to clipboard',
    step2Placeholder: '2. Enter 6-digit code to confirm',
    verifyActivateBtn: 'Verify & Activate 2FA',
    cancelSetupBtn: 'Cancel',
    twoFaDesc: 'Scan a QR code with Google Authenticator, 1Password, or Authy to protect patient medical data.',
    setup2faBtn: 'Setup Authenticator App 2FA',
    teamTitle: 'Team User Accounts & RBAC Roles',
    usernamePlaceholder: 'Username',
    fullNamePlaceholder: 'Full Name',
    emailPlaceholder: 'Email',
    initPwPlaceholder: 'Initial Password (8+)',
    roleCoord: 'Coordinator (Leads)',
    roleEditor: 'Editor (CMS / SEO)',
    roleAdmin: 'Administrator',
    addUserBtn: 'Add User',
    userCreated: (u: string) => `Team user ${u} created`,
    createFail: 'Failed to create team member',
    colUser: 'User',
    colEmail: 'Email',
    colRole: 'Role',
    col2fa: '2FA',
    colStatus: 'Status',
    colActions: 'Actions',
    on: 'Enabled',
    off: 'Off',
    active: 'Active',
    suspended: 'Suspended',
    statusUpdated: 'Account status updated',
    roleChanged: (r: string) => `Role changed to ${r}`,
    userRemoved: 'User removed',
    logTitle: 'Security & Editorial Activity Audit Log',
    noLogs: 'No activity recorded yet.',
  },
};

export default function AdminSecurityPage() {
  const { language, direction } = useLanguage();
  const langKey = language === 'fr' || language === 'en' ? language : 'ar';
  const t = secDict[langKey];

  const [me, setMe] = useState<SafeAdminUser | null>(null);
  const [users, setUsers] = useState<SafeAdminUser[]>([]);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [totpSetup, setTotpSetup] = useState<{ secret: string; qrDataUrl: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [disablePw, setDisablePw] = useState('');

  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'coordinator' as AdminRole,
  });

  const loadAll = async () => {
    const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
    if (meRes.ok) {
      const meData = await meRes.json();
      setMe(meData.user);

      if (meData.user?.role === 'admin') {
        const [uRes, aRes] = await Promise.all([
          fetch('/api/users', { cache: 'no-store' }),
          fetch('/api/activity?limit=150', { cache: 'no-store' }),
        ]);
        if (uRes.ok) setUsers((await uRes.json()).users || []);
        if (aRes.ok) setLogs((await aRes.json()).logs || []);
      }
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_password', currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.pwUpdateFail);
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    toast.success(t.pwUpdated);
  };

  const handleStart2fa = async () => {
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setup_2fa' }),
    });
    const data = await res.json();
    if (res.ok && data.qrDataUrl) {
      setTotpSetup({ secret: data.secret, qrDataUrl: data.qrDataUrl });
    }
  };

  const handleEnable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpSetup) return;
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'enable_2fa', secret: totpSetup.secret, code: totpCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.invalidCodeToast);
      return;
    }
    setTotpSetup(null);
    setTotpCode('');
    toast.success(t.twoFaEnabledToast);
    loadAll();
  };

  const handleDisable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'disable_2fa', currentPassword: disablePw }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.pwVerifyFail);
      return;
    }
    setDisablePw('');
    toast.success(t.twoFaDisabledToast);
    loadAll();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.createFail);
      return;
    }
    setNewUser({ username: '', fullName: '', email: '', password: '', role: 'coordinator' });
    toast.success(t.userCreated(data.user.username));
    loadAll();
  };

  const handleToggleUserStatus = async (u: SafeAdminUser) => {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, isActive: !u.isActive }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.pwUpdateFail);
      return;
    }
    loadAll();
    toast.success(t.statusUpdated);
  };

  const handleChangeRole = async (u: SafeAdminUser, role: AdminRole) => {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.pwUpdateFail);
      return;
    }
    loadAll();
    toast.success(t.roleChanged(role));
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.pwUpdateFail);
      return;
    }
    loadAll();
    toast.success(t.userRemoved);
  };

  return (
    <div dir={direction} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <span>{t.pageTitle}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.pageSub}
        </p>
      </div>

      {/* Personal Account Security (Available to ALL roles) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4"
        >
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0097FB] shrink-0" />
            <span>
              {t.changePwTitle}{' '}
              {me?.username ? (
                <span dir="ltr" className="font-mono text-xs text-slate-500">
                  ({me.username})
                </span>
              ) : null}
            </span>
          </h2>
          <div className="space-y-3 text-xs">
            <input
              type="password"
              required
              placeholder={t.currentPwPlaceholder}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#0097FB] outline-none"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder={t.newPwPlaceholder}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#0097FB] outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold cursor-pointer transition-colors"
            >
              {t.updatePwBtn}
            </button>
          </div>
        </form>

        {/* Authenticator App 2FA */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.twoFaTitle}</span>
            </h2>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                me?.totpEnabled
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {me?.totpEnabled ? t.twoFaActive : t.twoFaDisabled}
            </span>
          </div>

          {me?.totpEnabled ? (
            <form onSubmit={handleDisable2fa} className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t.twoFaProtected}</span>
              </div>
              <input
                type="password"
                required
                placeholder={t.disable2faPlaceholder}
                value={disablePw}
                onChange={(e) => setDisablePw(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                {t.disable2faBtn}
              </button>
            </form>
          ) : totpSetup ? (
            <form onSubmit={handleEnable2fa} className="space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={totpSetup.qrDataUrl}
                  alt="2FA QR Code"
                  className="w-28 h-28 rounded-xl border border-slate-200 p-1 bg-white shrink-0"
                />
                <div className="space-y-2 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white">{t.step1Scan}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">{t.secretLabel}</span>
                    <code dir="ltr" className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg select-all">
                      {totpSetup.secret}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(totpSetup.secret);
                        toast.success(t.secretCopied);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold text-[10px] hover:bg-sky-100 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{t.copySecret}</span>
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                dir="ltr"
                placeholder={t.step2Placeholder}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  {t.verifyActivateBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTotpSetup(null);
                    setTotpCode('');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.cancelSetupBtn}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <p className="text-slate-500">{t.twoFaDesc}</p>
              <button
                type="button"
                onClick={handleStart2fa}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{t.setup2faBtn}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Team Users Management & Activity Log (Admin Only) */}
      {me?.role === 'admin' && (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-5">
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#0097FB]" />
              <span>{t.teamTitle}</span>
            </h2>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 text-xs">
              <input
                type="text"
                required
                dir="ltr"
                placeholder={t.usernamePlaceholder}
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
              <input
                type="text"
                required
                placeholder={t.fullNamePlaceholder}
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
              <input
                type="email"
                required
                dir="ltr"
                placeholder={t.emailPlaceholder}
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
              <input
                type="password"
                required
                minLength={8}
                placeholder={t.initPwPlaceholder}
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
              >
                <option value="coordinator">{t.roleCoord}</option>
                <option value="editor">{t.roleEditor}</option>
                <option value="admin">{t.roleAdmin}</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold cursor-pointer"
              >
                {t.addUserBtn}
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 text-start">{t.colUser}</th>
                    <th className="p-3 text-start">{t.colEmail}</th>
                    <th className="p-3 text-start">{t.colRole}</th>
                    <th className="p-3 text-start">{t.col2fa}</th>
                    <th className="p-3 text-start">{t.colStatus}</th>
                    <th className="p-3 text-end">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-3">
                        <div className="font-bold">{u.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">@{u.username}</div>
                      </td>
                      <td className="p-3 font-mono" dir="ltr">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u, e.target.value as AdminRole)}
                          className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        >
                          <option value="admin">{t.roleAdmin}</option>
                          <option value="editor">{t.roleEditor}</option>
                          <option value="coordinator">{t.roleCoord}</option>
                        </select>
                      </td>
                      <td className="p-3">{u.totpEnabled ? t.on : t.off}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-2.5 py-0.5 rounded-full font-bold cursor-pointer ${
                            u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {u.isActive ? t.active : t.suspended}
                        </button>
                      </td>
                      <td className="p-3 text-end">
                        {u.id !== me.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-500" />
              <span>{t.logTitle}</span>
            </h2>
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {logs.length === 0 ? (
                <div className="py-6 text-center text-slate-400">{t.noLogs}</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{log.actorUsername}</span>{' '}
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                        {log.action}
                      </span>{' '}
                      <span className="text-slate-600 dark:text-slate-300">{log.details}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 shrink-0" dir="ltr">
                      {log.ipAddress || ''} • {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
