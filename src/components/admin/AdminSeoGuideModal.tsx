'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Target,
  Search,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Zap,
  Globe,
  Award,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Layers,
  FileCheck2,
  Heading,
  Eye,
  Check,
} from 'lucide-react';
import { ModalPortal } from './ModalPortal';
import type { Locale } from './AdminShell';

interface AdminSeoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: Locale;
}

export function AdminSeoGuideModal({
  isOpen,
  onClose,
  locale = 'ar',
}: AdminSeoGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'score' | 'eeat' | 'snippets'>('quickstart');
  const isRtl = locale === 'ar';

  const t = {
    ar: {
      badge: 'دليل السيو الطبي وتصدر محركات البحث',
      title: 'دليل تصدر نتائج جوجل (معايير Rank Math SEO الحصرية)',
      subtitlePrefix: 'كيف تحقق المقالات الطبية المركز الأول في نتائج بحث جوجل بجدارة وسرعة فائقة وفق معايير التحديث الطبي والخبرة السريرية',
      subtitleTag: 'Google Medic & E-E-A-T',
      rankMathBannerTitle: 'نظام السيو يعتمد حصرياً على معايير Rank Math SEO',
      rankMathBannerDesc: 'تمت برمجة ومعايرة لوحة أفيسينا للعمل حصرياً وفق معايير وخوارزميات إضافة Rank Math SEO الرسمية فقط، مع تقييم دقيق من 100 نقطة ومزامنة تلقائية مع ووردبريس عبر واجهة REST API الرسمية لـ Rank Math وبناء السكيما الطبية المعتمدة.',
      tabs: {
        quickstart: '⚡ التحسين التلقائي',
        score: '🎯 مقياس السيو (0-100)',
        eeat: '🩺 معايير E-E-A-T الطبية',
        snippets: '🌟 السكيما والنتائج الغنية',
      },
      closeBtn: 'إغلاق الدليل',
      quickstartTitle: 'كيف تنشر مقالاً بتهيئة سيو 100/100 في 3 ثوانٍ فقط؟',
      quickstartDesc: 'تم تزويد لوحة أفيسينا بمحرك ذكاء اصطناعي مؤتمت بالكامل يقوم بتحليل المحتوى الطبي وصياغة أنسب المعايير لمحركات البحث دون الحاجة لأي خبرة مسبقة بالسيو وفق معايير Rank Math SEO الدقيقة.',
      step1Title: '1. كتابة العنوان والمحتوى الطبي',
      step1Desc: 'اكتب عنوان المقال وفقراته الرئيسية في محرر المقال، واختر التخصص المناسب (مثل: علاج الأورام، جراحة القلب، زراعة الأعضاء).',
      step2Title: '2. النقر على زر "التحسين التلقائي بالسيو"',
      step2Desc: 'اضغط على زر (⚡ تحسين السيو تلقائياً)، وسيقوم محرك Rank Math المؤتمت فوراً باستخراج الكلمة المفتاحية، وتوليد عنوان السيو الأمثل لجوجل، وصياغة الميتا ديسكريبشن بدقة مع رفع المؤشر إلى +90.',
      step3Title: '3. مراجعة المعاينة الحية لجوجل (Google SERP)',
      step3Desc: 'شاهد محاكاة حية لطريقة ظهور مقالك على شاشات الهواتف والكمبيوتر في جوجل، وتأكد من وصول المؤشر للون الأخضر (80 - 100) المعتمد في رانك ماث.',
      scoreCriteriaTitle: 'الأوزان والمعايير المعتمدة في تقييم المقال (100 نقطة كاملة)',
      scoreCategory1: 'السيو الأساسي (Basic SEO)',
      scoreCategory1Points: '57 نقطة',
      scoreCategory1Desc: 'الكلمة المفتاحية في العنوان (+36)، الرابط (+5)، عمق المحتوى الطبي (+8)، أول 10% (+3)، في المقال (+3)، وفي الوصف (+2).',
      scoreCategory2: 'المعايير المتقدمة (Additional SEO)',
      scoreCategory2Points: '26 نقطة',
      scoreCategory2Desc: 'الكلمة في العناوين الفرعية H2/H3 (+7)، في النص البديل للصور ALT (+6)، الكثافة الطبيعية 1-2.5% (+5)، والروابط الموثوقة (+8).',
      scoreCategory3: 'قابلية قراءة العنوان (Title Readability)',
      scoreCategory3Points: '6 نقاط',
      scoreCategory3Desc: 'بدء العنوان بالكلمة المفتاحية (+2)، كلمات التأثير الطبية Power Words (+2)، والأرقام والمشاعر الإيجابية (+2).',
      scoreCategory4: 'قابلية قراءة المحتوى (Content Readability)',
      scoreCategory4Points: '11 نقطة',
      scoreCategory4Desc: 'فهرس المحتويات TOC (+3)، فقرات قصيرة مريحة للقراءة أقل من 120 كلمة (+4)، وصور ورسوم طبية (+4).',
      eeatHeaderTitle: 'ما هو تحديث جوجل الطبي وخوارزمية YMYL؟',
      eeatHeaderDesc: 'تصنف جوجل المقالات الطبية ضمن فئة "Your Money or Your Life" (أموالك أو صحتك)، مما يعني أنها تشترط دليلاً قاطعاً على الخبرة والمصداقية السريرية (E-E-A-T) لتصدر النتائج الأولى.',
      eeat1Title: '1. توثيق الطبيب والمراجع السريري',
      eeat1Desc: 'يربط نظام أفيسينا المقال بملف الطبيب المختص آلياً في كود السكيما (Schema.org Person عبر Rank Math)، مما يثبت لجوجل أن المحتوى كتبه أو راجعه استشاري مرخص.',
      eeat2Title: '2. نسبة المقال لمستشفى شريك معتمد',
      eeat2Desc: 'إدراج اسم المستشفى (مثل أجيبادم أو ميموريال) يعزز إشارات الهيئة المعتمدة (Medical Organization Authority) ويجعل المقال يظهر في اقتراحات المرضى الدوليين.',
      eeat3Title: '3. إخلاء المسؤولية الطبي الإلزامي',
      eeat3Desc: 'يتم تضمين بطاقة إخلاء المسؤولية تلقائياً في نهاية كل مقال لحماية المنصة قانونياً واستيفاء اشتراطات Google Health Search Guidelines.',
      eeat4Title: '4. الروابط الداخلية الاستشارية',
      eeat4Desc: 'يربط النظام المقالات بصفحات التخصصات وحجز الاستشارة، مما ينقل قوة السيو (Link Equity) إلى صفحات التحويل الرئيسية.',
      snippetsIntro: 'تتميز منصة أفيسينا بتوليد تلقائي لكود البيانات المنظمة (JSON-LD Schema Markup) المعتمد رسمياً لدى جوجل عبر Rank Math للمحتوى الطبي الموثوق والأسئلة الشائعة:',
      snippet1Title: 'التأليف والمراجعة الطبية الموثوقة (MedicalWebPage E-E-A-T)',
      snippet1Desc: 'يربط كود السكيما المقال باسم الطبيب المؤلف، المراجع الطبي، وتاريخ آخر تحديث لضمان أعلى معايير الثقة الطبية YMYL في جوجل.',
      snippet2Title: 'الأسئلة الشائعة في جوجل (FAQPage Rich Snippets)',
      snippet2Desc: 'يتم حقن أسئلة وإجابات التكلفة والإقامة الطبية في كود المقال، لتظهر كأكورديون تفاعلي قابل للفتح مباشرة داخل نتائج بحث جوجل.',
      snippet3Title: 'مسار التنقل والخبز (BreadcrumbList Schema)',
      snippet3Desc: 'يعرض جوجل المسار الاحترافي المنظم بدلاً من الروابط الطويلة المعقدة:',
      snippetStatus: 'مفعل تلقائياً عبر Rank Math',
      footerStatus: 'نظام Rank Math SEO يعمل بأعلى كفاءة ومطابق 100%',
    },
    en: {
      badge: 'Medical SEO & Search Engine Leadership Guide',
      title: 'Google #1 Ranking Guide (Exclusive Rank Math SEO Standards)',
      subtitlePrefix: 'How medical articles achieve Google #1 rankings rapidly and reliably following clinical authority guidelines',
      subtitleTag: 'Google Medic & E-E-A-T',
      rankMathBannerTitle: 'AVICINNA Exclusively Uses Official Rank Math SEO Standards',
      rankMathBannerDesc: 'The SEO engine is 100% calibrated exclusively to Rank Math SEO algorithms and official REST API metadata keys, delivering full compliance and automated clinical schema.',
      tabs: {
        quickstart: '⚡ 1-Click AI',
        score: '🎯 Score (0 - 100)',
        eeat: '🩺 Medical E-E-A-T',
        snippets: '🌟 Schema & Snippets',
      },
      closeBtn: 'Close Guide',
      quickstartTitle: 'How to achieve a 100/100 SEO Score in under 3 seconds?',
      quickstartDesc: 'AVICINNA is equipped with an automated medical SEO intelligence engine that analyzes content and generates high-ranking metadata without manual effort based on exact Rank Math SEO parameters.',
      step1Title: '1. Write Title & Medical Insights',
      step1Desc: 'Draft your article title and key paragraphs, choosing the appropriate medical specialty (e.g. Oncology, Cardiology, Transplants).',
      step2Title: '2. Click "Auto-Optimize SEO"',
      step2Desc: 'Hit the (⚡ Auto-Optimize SEO) button. The engine extracts high-intent keywords, writes a CTR-driven Google title, and crafts a meta description, pushing your score to 90+.',
      step3Title: '3. Verify Real-Time Google SERP Preview',
      step3Desc: 'Preview exactly how your article looks on desktop and mobile search viewports, aiming for Rank Math’s emerald green score tier (80 - 100).',
      scoreCriteriaTitle: 'Rank Math Authentic Scoring Criteria (100 Points Total)',
      scoreCategory1: 'Basic SEO',
      scoreCategory1Points: '57 Points',
      scoreCategory1Desc: 'Keyword in SEO Title (+36), in Permalink (+5), Content depth (+8), first 10% (+3), body content (+3), and meta description (+2).',
      scoreCategory2: 'Additional SEO',
      scoreCategory2Points: '26 Points',
      scoreCategory2Desc: 'Keyword in H2/H3 subheadings (+7), in image Alt (+6), keyword density 1-2.5% (+5), and trusted links (+8).',
      scoreCategory3: 'Title Readability',
      scoreCategory3Points: '6 Points',
      scoreCategory3Desc: 'Keyword near start of title (+2), medical power words (+2), sentiment & numbers (+2).',
      scoreCategory4: 'Content Readability',
      scoreCategory4Points: '11 Points',
      scoreCategory4Desc: 'Table of Contents TOC (+3), concise paragraphs (<120 words) (+4), and clinical media assets (+4).',
      eeatHeaderTitle: 'What is the Google Medic Algorithm & YMYL?',
      eeatHeaderDesc: 'Google classifies medical articles under "Your Money or Your Life" (YMYL), requiring strict evidence of clinical expertise, authoritativeness, and trust (E-E-A-T) to award #1 rankings.',
      eeat1Title: '1. Verified Doctor & Clinical Reviewer',
      eeat1Desc: 'AVICINNA automatically links each article to the licensed specialist in Schema.org Person via Rank Math, verifying clinical authority for Google.',
      eeat2Title: '2. Accredited Partner Hospital Attribution',
      eeat2Desc: 'Attributing the article to partner hospitals (such as Acibadem or Memorial) reinforces Medical Organization Authority in global search.',
      eeat3Title: '3. Mandatory Medical Disclaimer',
      eeat3Desc: 'A compliance disclaimer card is automatically appended to protect the platform and fulfill Google Health Search guidelines.',
      eeat4Title: '4. Clinical Internal Linking',
      eeat4Desc: 'Seamlessly connects clinical articles with treatment pages and consultation booking, directing Link Equity to high-conversion endpoints.',
      snippetsIntro: 'AVICINNA automatically generates Google-compliant JSON-LD structured data via Rank Math for healthcare authority and search features:',
      snippet1Title: 'Clinical Authorship Schema (MedicalWebPage E-E-A-T)',
      snippet1Desc: 'Binds the article to the author doctor, reviewer, and last reviewed date, verifying highest YMYL compliance.',
      snippet2Title: 'Google FAQ Rich Snippets (FAQPage Schema)',
      snippet2Desc: 'Injects clinical cost, stay duration, and recovery questions directly into Google search results as interactive accordions.',
      snippet3Title: 'Breadcrumb Navigation (BreadcrumbList Schema)',
      snippet3Desc: 'Presents clean structured category trails instead of raw complex URLs:',
      snippetStatus: 'Automated via Rank Math',
      footerStatus: 'Rank Math SEO Engine Active & 100% Calibrated',
    },
    fr: {
      badge: 'Guide Référencement Médical & Google #1',
      title: 'Guide d’Excellence SEO Google (Normes Exclusives Rank Math SEO)',
      subtitlePrefix: 'Positionnez vos articles médicaux en tête des résultats Google grâce à l’optimisation clinique automatisée',
      subtitleTag: 'Google Medic & E-E-A-T',
      rankMathBannerTitle: 'La plateforme utilise exclusivement les standards Rank Math SEO',
      rankMathBannerDesc: 'Le moteur d’audit et de référencement est calibré à 100% sur les algorithmes officiels de Rank Math SEO et ses clés REST API natives, garantissant une conformité totale et des schémas cliniques automatisés.',
      tabs: {
        quickstart: '⚡ Optimisation 1 Clic',
        score: '🎯 Score (0 - 100)',
        eeat: '🩺 Critères E-E-A-T',
        snippets: '🌟 Schémas & Snippets',
      },
      closeBtn: 'Fermer le Guide',
      quickstartTitle: 'Comment obtenir un score SEO de 100/100 en 3 secondes ?',
      quickstartDesc: 'AVICINNA intègre un moteur d’optimisation automatique qui analyse le contenu médical et génère instantanément les métadonnées les plus performantes selon les standards Rank Math SEO.',
      step1Title: '1. Rédigez le titre et le corps de l’article',
      step1Desc: 'Saisissez le titre et les paragraphes cliniques dans l’éditeur en sélectionnant la spécialité appropriée (ex: Oncologie, Cardiologie, Greffes).',
      step2Title: '2. Cliquez sur "Optimiser le SEO en 1 Clic"',
      step2Desc: 'Cliquez sur le bouton (⚡ Optimiser le SEO). Le moteur Rank Math extrait le mot-clé cible, génère le titre Google et rédige la meta description pour atteindre +90 points.',
      step3Title: '3. Validez l’Aperçu Google SERP en Direct',
      step3Desc: 'Visualisez le rendu réel sur mobile et ordinateur pour atteindre la zone verte optimale (80 - 100) certifiée Rank Math.',
      scoreCriteriaTitle: 'Critères de Notation Rank Math (100 Points au Total)',
      scoreCategory1: 'SEO de Base (Basic SEO)',
      scoreCategory1Points: '57 Points',
      scoreCategory1Desc: 'Mot-clé dans le titre (+36), dans l’URL (+5), volume de contenu (+8), premier 10% (+3), corps du texte (+3), et meta description (+2).',
      scoreCategory2: 'Critères Additionnels (Additional SEO)',
      scoreCategory2Points: '26 Points',
      scoreCategory2Desc: 'Mot-clé dans les sous-titres H2/H3 (+7), dans l’attribut Alt image (+6), densité optimale 1-2.5% (+5), liens fiables (+8).',
      scoreCategory3: 'Lisibilité du Titre (Title Readability)',
      scoreCategory3Points: '6 Points',
      scoreCategory3Desc: 'Mot-clé au début (+2), mots de puissance Power Words (+2), sentiment et chiffres (+2).',
      scoreCategory4: 'Lisibilité du Contenu (Content Readability)',
      scoreCategory4Points: '11 Points',
      scoreCategory4Desc: 'Table des matières TOC (+3), paragraphes concis (<120 mots) (+4), et illustrations médicales (+4).',
      eeatHeaderTitle: 'Qu’est-ce que l’Algorithme Google Medic & YMYL ?',
      eeatHeaderDesc: 'Google classe les contenus médicaux sous "Your Money or Your Life" (YMYL), exigeant une preuve rigoureuse d’expertise clinique (E-E-A-T) pour atteindre la 1ère position.',
      eeat1Title: '1. Auteur Médecin & Relecteur Clinique',
      eeat1Desc: 'AVICINNA lie chaque article au profil du médecin spécialiste dans le schéma Schema.org Person via Rank Math, validant l’autorité médicale.',
      eeat2Title: '2. Attribution à l’Hôpital Partenaire Agréé',
      eeat2Desc: 'L’inclusion de l’hôpital accrédité renforce l’autorité institutionnelle (Medical Organization Authority) auprès de Google.',
      eeat3Title: '3. Avertissement Médical Obligatoire',
      eeat3Desc: 'Une clause de non-responsabilité clinique est insérée pour protéger la plateforme et satisfaire les consignes Google Health.',
      eeat4Title: '4. Maillage Interne Clinique',
      eeat4Desc: 'Relie les articles aux pages de soins et de prise de rendez-vous pour transférer l’autorité SEO vers les pages de conversion.',
      snippetsIntro: 'AVICINNA génère automatiquement les données structurées JSON-LD via Rank Math, conformes aux exigences de Google pour le secteur médical :',
      snippet1Title: 'Schéma d’Autorité Clinique (MedicalWebPage E-E-A-T)',
      snippet1Desc: 'Lie l’article au médecin auteur, au réviseur et à la date de validation clinique pour respecter les exigences YMYL.',
      snippet2Title: 'Extraits Enrichis FAQ Google (FAQPage Schema)',
      snippet2Desc: 'Injecte les questions/réponses sur les coûts et l’hospitalisation directement dans les résultats Google sous forme d’accordéons.',
      snippet3Title: 'Fil d’Ariane Structuré (BreadcrumbList Schema)',
      snippet3Desc: 'Affiche un chemin hiérarchique clair dans les résultats de recherche au lieu d’URLs brutes :',
      snippetStatus: 'Automatisé via Rank Math',
      footerStatus: 'Moteur Rank Math SEO Actif & Calibré à 100%',
    },
  }[locale] || {
    badge: 'Medical SEO Guide',
    title: 'Google #1 Ranking Guide (Rank Math SEO Exclusive)',
    subtitlePrefix: 'Clinical content optimization guide for Google search engines',
    subtitleTag: 'Google Medic & E-E-A-T',
    rankMathBannerTitle: 'Exclusively Powered by Rank Math SEO',
    rankMathBannerDesc: 'AVICINNA exclusively operates on official Rank Math SEO algorithms and REST API metadata.',
    tabs: {
      quickstart: '⚡ 1-Click AI',
      score: '🎯 Score (0 - 100)',
      eeat: '🩺 Medical E-E-A-T',
      snippets: '🌟 Schema & Snippets',
    },
    closeBtn: 'Close',
    quickstartTitle: 'Fast SEO Optimization',
    quickstartDesc: 'Automated SEO generator.',
    step1Title: '1. Write content',
    step1Desc: 'Add title and paragraphs.',
    step2Title: '2. Click Auto-Optimize',
    step2Desc: 'Click the button to optimize.',
    step3Title: '3. Preview in SERP',
    step3Desc: 'Check the score.',
    scoreCriteriaTitle: 'Scoring Criteria',
    scoreCategory1: 'Basic SEO',
    scoreCategory1Points: '57 Points',
    scoreCategory1Desc: 'Title, URL, content length.',
    scoreCategory2: 'Additional SEO',
    scoreCategory2Points: '26 Points',
    scoreCategory2Desc: 'Subheadings, image Alt, links.',
    scoreCategory3: 'Title Readability',
    scoreCategory3Points: '6 Points',
    scoreCategory3Desc: 'Title power words and keywords.',
    scoreCategory4: 'Content Readability',
    scoreCategory4Points: '11 Points',
    scoreCategory4Desc: 'Paragraph length and table of contents.',
    eeatHeaderTitle: 'Google Medic & YMYL',
    eeatHeaderDesc: 'Medical authority standards.',
    eeat1Title: '1. Doctor attribution',
    eeat1Desc: 'Schema person metadata.',
    eeat2Title: '2. Hospital attribution',
    eeat2Desc: 'Organization authority.',
    eeat3Title: '3. Medical disclaimer',
    eeat3Desc: 'Compliance disclaimer.',
    eeat4Title: '4. Internal links',
    eeat4Desc: 'Clinical internal linking.',
    snippetsIntro: 'Automated structured data markup:',
    snippet1Title: 'MedicalWebPage Schema',
    snippet1Desc: 'E-E-A-T medical markup.',
    snippet2Title: 'FAQPage Rich Snippets',
    snippet2Desc: 'Interactive search FAQs.',
    snippet3Title: 'BreadcrumbList Schema',
    snippet3Desc: 'Structured breadcrumbs.',
    snippetStatus: 'Automated via Rank Math',
    footerStatus: 'Rank Math SEO Active',
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-sky-500/5 via-teal-500/5 to-transparent">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/20">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[11px] font-bold mb-1">
                  <Sparkles className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  <span>{t.badge}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  <span>{t.subtitlePrefix}</span>{' '}
                  <span
                    dir="ltr"
                    className="inline-block px-1.5 py-0.2 rounded font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 whitespace-nowrap"
                  >
                    ({t.subtitleTag})
                  </span>
                  .
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Exclusive Rank Math Notice Banner */}
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/25 flex items-start gap-2.5 text-xs">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white font-black text-[9px] uppercase shadow-2xs tracking-tighter">
              RM
            </div>
            <div className="space-y-0.5">
              <div className="font-extrabold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t.rankMathBannerTitle}</span>
              </div>
              <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80 leading-relaxed">
                {t.rankMathBannerDesc}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Full Width Segmented Control with Zero Clipping */}
          <div className="p-3 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'quickstart', label: t.tabs.quickstart },
                { id: 'score', label: t.tabs.score },
                { id: 'eeat', label: t.tabs.eeat },
                { id: 'snippets', label: t.tabs.snippets },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center text-center cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/90 dark:border-slate-700 font-black scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
            {/* Tab 1: Quickstart AI */}
            {activeTab === 'quickstart' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-transparent border border-sky-500/20">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{t.quickstartTitle}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {t.quickstartDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-white font-bold text-xs">
                      1
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {t.step1Title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.step1Desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 text-white font-bold text-xs">
                      2
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {t.step2Title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.step2Desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs">
                      3
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {t.step3Title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.step3Desc}
                    </p>
                  </div>
                </div>

                {/* Practical Example Box */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {locale === 'ar' ? 'نموذج تطبيقي فوري لنتائج التحسين عبر رانك ماث' : 'Real-World Rank Math Output Simulation'}
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-28 shrink-0">{locale === 'ar' ? 'الكلمة المفتاحية:' : 'Focus Keyword:'}</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-mono">
                        {locale === 'ar' ? 'زراعة الكلى في تركيا' : locale === 'fr' ? 'Greffe de rein en Turquie' : 'Kidney Transplant in Turkey'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-28 shrink-0">{locale === 'ar' ? 'عنوان السيو (Rank Math):' : 'SEO Title (Rank Math):'}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {locale === 'ar' ? 'زراعة الكلى في تركيا: دليلك الشامل ونسب النجاح | AVICINNA' : locale === 'fr' ? 'Greffe de Rein en Turquie : Guide 2026 & Hôpitaux | AVICINNA' : 'Kidney Transplant in Turkey: 2026 Guide & Clinics | AVICINNA'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 w-28 shrink-0">{locale === 'ar' ? 'الميتا ديسكريبشن:' : 'Meta Description:'}</span>
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                        {locale === 'ar'
                          ? 'تعرف على تكلفة زراعة الكلى في أفضل مشافي إسطنبول مع استشاريي AVICINNA ونسب نجاح تتجاوز 95%. احصل على استشارة مجانية ودراسة ملفك الآن.'
                          : locale === 'fr'
                          ? 'Découvrez les coûts de greffe rénale dans les meilleurs hôpitaux d’Istanbul avec AVICINNA (>95% de succès). Consultation médicale gratuite.'
                          : 'Discover kidney transplant costs in top Istanbul hospitals with AVICINNA consultants and >95% success rate. Get a free medical review now.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: SEO Score Gauge */}
            {activeTab === 'score' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">80 - 100</div>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                      {locale === 'ar' ? 'ممتاز (مؤهل لتصدر جوجل #1)' : locale === 'fr' ? 'Excellent (Éligible #1)' : 'Excellent (Rank #1 Ready)'}
                    </div>
                    <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                      {locale === 'ar' ? 'اللون الأخضر في رانك ماث: تطابق كامل لمتطلبات جوجل' : 'Green badge: Full compliance with Google algorithm factors'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400">50 - 79</div>
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                      {locale === 'ar' ? 'جيد (يحتاج لمسات بسيطة)' : locale === 'fr' ? 'Bon (À peaufiner)' : 'Good (Needs minor tweaks)'}
                    </div>
                    <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-1">
                      {locale === 'ar' ? 'اللون البرتقالي: ينقصه ضبط الكثافة أو طول العنوان' : 'Orange badge: Missing keyword in intro or description length'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-center">
                    <div className="text-2xl font-black text-rose-600 dark:text-rose-400">0 - 49</div>
                    <div className="text-xs font-bold text-rose-800 dark:text-rose-300 mt-0.5">
                      {locale === 'ar' ? 'ضعيف (فرصة ظهور منخفضة)' : locale === 'fr' ? 'Faible (Sous-optimisé)' : 'Poor (Low ranking probability)'}
                    </div>
                    <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80 mt-1">
                      {locale === 'ar' ? 'اللون الأحمر: غياب الكلمة المفتاحية أو محتوى قصير جداً' : 'Red badge: Missing focus keyword or thin content'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t.scoreCriteriaTitle}
                  </h4>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {/* Category 1: Basic SEO (57 pts) */}
                    <div className="py-3 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {t.scoreCategory1}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {t.scoreCategory1Desc}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded shrink-0">
                        {t.scoreCategory1Points}
                      </span>
                    </div>

                    {/* Category 2: Additional SEO (26 pts) */}
                    <div className="py-3 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {t.scoreCategory2}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {t.scoreCategory2Desc}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded shrink-0">
                        {t.scoreCategory2Points}
                      </span>
                    </div>

                    {/* Category 3: Title Readability (6 pts) */}
                    <div className="py-3 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Heading className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {t.scoreCategory3}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {t.scoreCategory3Desc}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded shrink-0">
                        {t.scoreCategory3Points}
                      </span>
                    </div>

                    {/* Category 4: Content Readability (11 pts) */}
                    <div className="py-3 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {t.scoreCategory4}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {t.scoreCategory4Desc}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                        {t.scoreCategory4Points}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Google Medic & E-E-A-T */}
            {activeTab === 'eeat' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>{t.eeatHeaderTitle}</span>
                  </div>
                  <p className="leading-relaxed opacity-90">
                    {t.eeatHeaderDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{t.eeat1Title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.eeat1Desc}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>{t.eeat2Title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.eeat2Desc}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{t.eeat3Title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.eeat3Desc}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t.eeat4Title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.eeat4Desc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Rich Snippets & Schema */}
            {activeTab === 'snippets' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.snippetsIntro}
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                        <Award className="w-4 h-4 text-emerald-500" />
                        <span>{t.snippet1Title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {t.snippetStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.snippet1Desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                        <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span>{t.snippet2Title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {t.snippetStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.snippet2Desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                        <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>{t.snippet3Title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {t.snippetStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span>{t.snippet3Desc}</span>{' '}
                      <span dir="ltr" className="inline-block mx-1">
                        <code className="text-[11px] font-mono text-sky-600 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                          avicinna.com &gt; {locale === 'en' ? 'en' : locale === 'fr' ? 'fr' : 'ar'} &gt; blog &gt; oncology
                        </code>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.footerStatus}</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              {t.closeBtn}
            </button>
          </div>
        </motion.div>
      </div>
    </ModalPortal>
  );
}
