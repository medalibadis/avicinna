'use client';

import React, { useState } from 'react';
import { useData, SiteSectionsData } from '@/context/DataContext';
import {
  Layers,
  Save,
  CheckCircle2,
  Sparkles,
  BarChart3,
  FileText,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';

export default function AdminSectionsPage() {
  const { sections, updateSection } = useData();

  // Local form state cloned from context
  const [formData, setFormData] = useState<SiteSectionsData>(sections);
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'about' | 'why' | 'cta'>('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSection('hero', formData.hero);
    updateSection('stats', formData.stats);
    updateSection('about', formData.about);
    updateSection('whyChoose', formData.whyChoose);
    updateSection('finalCta', formData.finalCta);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-1">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>محرر الواجهة الرئيسية</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            تعديل أقسام الموقع / Site Sections Editor
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            عدل النصوص والعناوين والأرقام في الصفحة الرئيسية، وتظهر التعديلات مباشرة للمرضى.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات / Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>تم حفظ التعديلات بنجاح وتحديث محتوى الموقع المباشر!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'hero', label: 'قسم الهيرو (Hero)', icon: Sparkles },
          { id: 'stats', label: 'الإحصائيات والأرقام (Stats)', icon: BarChart3 },
          { id: 'about', label: 'نبذة عن أفيسينا (About)', icon: FileText },
          { id: 'why', label: 'لماذا تختارنا (Why Choose Us)', icon: ShieldCheck },
          { id: 'cta', label: 'شريط التواصل الختامي (CTA)', icon: PhoneCall },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              نصوص قسم الهيرو الرئيسي (Hero Section)
            </h2>

            {/* Eyebrow */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                العنوان الفرعي العلوي (Eyebrow Badge)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">العربية (AR)</span>
                  <input
                    type="text"
                    value={formData.hero.eyebrow.ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          eyebrow: { ...formData.hero.eyebrow, ar: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">English (EN)</span>
                  <input
                    type="text"
                    value={formData.hero.eyebrow.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          eyebrow: { ...formData.hero.eyebrow, en: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">Français (FR)</span>
                  <input
                    type="text"
                    value={formData.hero.eyebrow.fr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          eyebrow: { ...formData.hero.eyebrow, fr: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                العنوان الرئيسي الكبير (Main Headline)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">الجزء الأول (عربي)</span>
                  <input
                    type="text"
                    value={formData.hero.headlinePart1.ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          headlinePart1: { ...formData.hero.headlinePart1, ar: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">الكلمة الملونة (تركيا)</span>
                  <input
                    type="text"
                    value={formData.hero.headlineHighlight.ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          headlineHighlight: {
                            ...formData.hero.headlineHighlight,
                            ar: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-sky-600 font-bold outline-none transition-all"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">الجزء الثاني</span>
                  <input
                    type="text"
                    value={formData.hero.headlinePart2.ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          headlinePart2: { ...formData.hero.headlinePart2, ar: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                النص الوصفي للهيرو (Hero Subtitle)
              </label>
              <textarea
                rows={3}
                value={formData.hero.subtitle.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: {
                      ...formData.hero,
                      subtitle: { ...formData.hero.subtitle, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none leading-relaxed transition-all"
              />
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              أرقام وإحصائيات المنصة (Platform Statistics)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  عدد المرضى المعالجين (Patients Count)
                </label>
                <input
                  type="text"
                  value={formData.stats.patientsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, patientsCount: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-sm text-slate-900 font-bold outline-none transition-all"
                />
                <input
                  type="text"
                  value={formData.stats.patientsLabel.ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        patientsLabel: { ...formData.stats.patientsLabel, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-700 outline-none transition-all"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  عدد المستشفيات المعتمدة (Hospitals Count)
                </label>
                <input
                  type="text"
                  value={formData.stats.hospitalsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, hospitalsCount: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-sm text-slate-900 font-bold outline-none transition-all"
                />
                <input
                  type="text"
                  value={formData.stats.hospitalsLabel.ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        hospitalsLabel: { ...formData.stats.hospitalsLabel, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-700 outline-none transition-all"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  سنوات الخبرة (Years Experience)
                </label>
                <input
                  type="text"
                  value={formData.stats.experienceCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, experienceCount: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-sm text-slate-900 font-bold outline-none transition-all"
                />
                <input
                  type="text"
                  value={formData.stats.experienceLabel.ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        experienceLabel: { ...formData.stats.experienceLabel, ar: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-700 outline-none transition-all"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  نسبة الرضا والنجاح (Success Rate)
                </label>
                <input
                  type="text"
                  value={formData.stats.satisfactionRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, satisfactionRate: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2 text-sm text-emerald-600 font-black outline-none transition-all"
                />
                <input
                  type="text"
                  value={formData.stats.satisfactionLabel.ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: {
                        ...formData.stats,
                        satisfactionLabel: {
                          ...formData.stats.satisfactionLabel,
                          ar: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-700 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              قسم نبذة عن أفيسينا (About Section)
            </h2>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">شارة العنوان (Badge)</label>
              <input
                type="text"
                value={formData.about.badge.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: {
                      ...formData.about,
                      badge: { ...formData.about.badge, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">العنوان الرئيسي</label>
              <input
                type="text"
                value={formData.about.heading.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: {
                      ...formData.about,
                      heading: { ...formData.about.heading, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">الفقرة التمهيدية (Lead)</label>
              <textarea
                rows={4}
                value={formData.about.lead.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: {
                      ...formData.about,
                      lead: { ...formData.about.lead, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 leading-relaxed outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* WHY CHOOSE US TAB */}
        {activeTab === 'why' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              قسم لماذا تختار أفيسينا (Why Choose Us)
            </h2>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">العنوان</label>
              <input
                type="text"
                value={formData.whyChoose.title.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyChoose: {
                      ...formData.whyChoose,
                      title: { ...formData.whyChoose.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">الوصف التوضيحي</label>
              <textarea
                rows={3}
                value={formData.whyChoose.subtitle.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyChoose: {
                      ...formData.whyChoose,
                      subtitle: { ...formData.whyChoose.subtitle, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 leading-relaxed outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                رقم واتساب المباشر للزر (WhatsApp Line)
              </label>
              <input
                type="text"
                value={formData.whyChoose.whatsappNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyChoose: { ...formData.whyChoose, whatsappNumber: e.target.value },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 dir-ltr font-mono outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* CTA TAB */}
        {activeTab === 'cta' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              شريط الدعوة الختامي (Closing CTA Banner)
            </h2>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">عنوان الشريط</label>
              <input
                type="text"
                value={formData.finalCta.title.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    finalCta: {
                      ...formData.finalCta,
                      title: { ...formData.finalCta.title, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">النص التوضيحي</label>
              <textarea
                rows={3}
                value={formData.finalCta.subtitle.ar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    finalCta: {
                      ...formData.finalCta,
                      subtitle: { ...formData.finalCta.subtitle, ar: e.target.value },
                    },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 leading-relaxed outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                هاتف الطوارئ المعتمد
              </label>
              <input
                type="text"
                value={formData.finalCta.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    finalCta: { ...formData.finalCta, phone: e.target.value },
                  })
                }
                className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 dir-ltr font-mono outline-none transition-all"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات الآن / Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
