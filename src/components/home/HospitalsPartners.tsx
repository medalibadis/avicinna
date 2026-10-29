'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { HospitalPartner } from '@/data/hospitals';
import {
  Hotel,
  Car,
  Languages,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Bed,
  Star,
  Hand,
  Grab,
  Compass,
} from 'lucide-react';

interface DraggableHospitalRowProps {
  items: HospitalPartner[];
  direction?: 'left' | 'right';
  speed?: number;
  language: 'ar' | 'en' | 'fr';
  rowId: string;
  onDragStateChange?: (isDragging: boolean) => void;
  accentColor?: 'sky' | 'teal';
}

const DraggableHospitalRow: React.FC<DraggableHospitalRowProps> = ({
  items,
  direction = 'left',
  speed = 0.8,
  language,
  rowId,
  onDragStateChange,
  accentColor = 'sky',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetWidthRef = useRef<number>(0);

  const offsetRef = useRef<number>(-3500);
  const velocityRef = useRef<number>(0);
  const momentumRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);

  // Repeat items 4 times so it spans 9,000px+ to ensure the screen is 100% full
  const repeatedHospitals = useMemo(() => {
    if (!items || items.length === 0) return [];
    return [...items, ...items, ...items, ...items];
  }, [items]);

  // Dynamically measure the width of one single cycle
  const measureWidth = useCallback(() => {
    if (trackRef.current && items.length > 0) {
      const totalWidth = trackRef.current.scrollWidth;
      const setWidth = totalWidth / 4;
      if (setWidth > 150) {
        singleSetWidthRef.current = setWidth;
        if (offsetRef.current > -setWidth || offsetRef.current < -2 * setWidth) {
          offsetRef.current = -setWidth * 1.5;
        }
      }
    }
  }, [items.length]);

  useEffect(() => {
    measureWidth();
    const handleResize = () => measureWidth();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(measureWidth, 600);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [measureWidth]);

  // Silky smooth 60fps continuous auto-scroll + momentum animation
  useEffect(() => {
    let animId: number;
    const baseStep = direction === 'left' ? -speed : speed;

    const animate = () => {
      if (!isPointerDownRef.current) {
        let step = baseStep;
        if (isHoveredRef.current) {
          step *= 0.3; // Gentle slowdown on hover for high readability
        }
        if (Math.abs(momentumRef.current) > 0.04) {
          step += momentumRef.current;
          momentumRef.current *= 0.94; // Realistic inertial decay
        }
        offsetRef.current += step;
      }

      // Mathematical infinite toroidal wrap: zero gap, zero jump
      const setW = singleSetWidthRef.current;
      if (setW > 0) {
        while (offsetRef.current <= -2 * setW) {
          offsetRef.current += setW;
        }
        while (offsetRef.current >= -setW) {
          offsetRef.current -= setW;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [direction, speed]);

  // Pointer event handlers for tactile cursor manipulation
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    hasMovedRef.current = false;
    momentumRef.current = 0;
    velocityRef.current = 0;
    setIsDraggingLocal(true);
    onDragStateChange?.(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const dx = e.clientX - lastXRef.current;
    if (Math.abs(e.clientX - startXRef.current) > 5) {
      hasMovedRef.current = true;
    }
    offsetRef.current += dx;

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    velocityRef.current = (dx / dt) * 16.67;
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    momentumRef.current = Math.max(-16, Math.min(16, velocityRef.current));

    setTimeout(() => {
      setIsDraggingLocal(false);
      onDragStateChange?.(false);
      hasMovedRef.current = false;
    }, 80);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current || isDraggingLocal) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none py-2 touch-pan-y"
      style={{ touchAction: 'pan-y' }}
      dir="ltr" // Guarantees deterministic X-translation regardless of page RTL/LTR
    >
      <div
        ref={trackRef}
        className="flex items-center gap-4 w-max will-change-transform"
      >
        {repeatedHospitals.map((hosp, idx) => (
          <Link
            key={`${rowId}-${hosp.id}-${idx}`}
            href={`/hospitals?id=${hosp.id}`}
            onClick={handleCardClick}
            draggable={false}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className={`group relative w-[260px] sm:w-80 shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-3.5 shadow-xl transition-all duration-300 hover:scale-105 select-none ${
              accentColor === 'teal'
                ? 'hover:border-teal-400/60 hover:bg-white/10 hover:shadow-teal-500/20'
                : 'hover:border-sky-400/60 hover:bg-white/10 hover:shadow-sky-500/20'
            }`}
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-xl bg-slate-900 pointer-events-none">
              <img
                src={hosp.image}
                alt={hosp.name[language]}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 rtl:right-auto rtl:left-2 rtl:sm:left-2.5 flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-md">
                <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{hosp.accreditationBadge || 'JCI Gold'}</span>
              </span>
              <span className="absolute bottom-1.5 sm:bottom-2 left-2 right-2 sm:left-2.5 sm:right-2.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-200">
                <span className="flex items-center gap-1 font-semibold truncate max-w-[150px]">
                  <MapPin className="h-3 w-3 text-[#00BFFF] shrink-0" />
                  <span className="truncate">{hosp.city[language]}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold shrink-0">
                  <Star className="h-3 w-3 fill-current" />
                  {hosp.rating || '4.9'}
                </span>
              </span>
            </div>
            <div className="pt-2 sm:pt-3 pointer-events-none">
              <h4
                className={`text-xs sm:text-sm font-bold text-white transition-colors line-clamp-1 leading-snug ${
                  accentColor === 'teal' ? 'group-hover:text-teal-300' : 'group-hover:text-sky-300'
                }`}
              >
                {hosp.name[language]}
              </h4>
              <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-slate-300/90 font-medium">
                  <Bed
                    className={`h-3 w-3 ${
                      accentColor === 'teal' ? 'text-teal-400' : 'text-sky-400'
                    }`}
                  />
                  {hosp.bedsCount}{' '}
                  {language === 'ar' ? 'سريراً' : language === 'fr' ? 'lits' : 'beds'}
                </span>
                <span
                  className={`font-semibold group-hover:underline ${
                    accentColor === 'teal' ? 'text-teal-400' : 'text-sky-400'
                  }`}
                >
                  {language === 'ar' ? 'التفاصيل ←' : 'Details →'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const HospitalsPartners: React.FC = () => {
  const { t, language } = useLanguage();
  const { hospitals } = useData();
  const [isAnyRowDragging, setIsAnyRowDragging] = useState(false);

  const supportingItems = [
    {
      icon: Hotel,
      title: t.hospitals.facilityTitle,
      desc: t.hospitals.facilityDesc,
    },
    {
      icon: Car,
      title: t.hospitals.transferTitle,
      desc: t.hospitals.transferDesc,
    },
    {
      icon: Languages,
      title: t.hospitals.coordinationTitle,
      desc: t.hospitals.coordinationDesc,
    },
  ];

  // Distribute hospitals across two rich, diverse tracks
  const { row1Hospitals, row2Hospitals } = useMemo(() => {
    if (!hospitals || hospitals.length === 0) {
      return { row1Hospitals: [], row2Hospitals: [] };
    }
    const r1: HospitalPartner[] = [];
    const r2: HospitalPartner[] = [];
    hospitals.forEach((hosp, idx) => {
      if (idx % 2 === 0) {
        r1.push(hosp);
      } else {
        r2.push(hosp);
      }
    });
    // Ensure both rows have at least 5-6 items for balanced density
    if (r2.length < r1.length && r1.length > 0) {
      r2.push(r1[0]);
    }
    return {
      row1Hospitals: r1.length > 0 ? r1 : hospitals,
      row2Hospitals: r2.length > 0 ? r2 : hospitals,
    };
  }, [hospitals]);

  return (
    <section className="py-20 bg-[#032654] text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0097FB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0097FB]/15 border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
            {t.hospitals.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.hospitals.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.hospitals.subtitle}
          </p>
        </div>

        {/* 2 Large Featured Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Card 1: Luxury Patient Suites */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl hover:border-[#00BFFF]/40 transition-colors duration-300"
          >
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Patient Suite Istanbul"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032654] via-[#032654]/40 to-transparent" />
              <div className="absolute top-4 right-4 bg-[#0097FB] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                VIP 5-Star Experience
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00BFFF] uppercase tracking-wider mb-2">
                <Hotel className="w-4 h-4" />
                <span>AVICINNA HOSPITALITY</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t.hospitals.card1Title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {t.hospitals.card1Desc}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="bg-white/10 px-3 py-1 rounded-lg">
                  {language === 'ar' ? 'إقامة 5 نجوم' : language === 'fr' ? 'Hébergement 5 étoiles' : '5-Star Accommodation'}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">
                  {language === 'ar' ? 'خدمة تمريض فندقي' : language === 'fr' ? 'Soins infirmiers VIP' : 'Hotel-Grade Nursing'}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">
                  {language === 'ar' ? 'وجبات صحية مخصصة' : language === 'fr' ? 'Restauration adaptée' : 'Personalized Nutrition'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Featured Card 2: Acibadem Hospital Istanbul */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 350, damping: 28, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl hover:border-[#00BFFF]/40 transition-colors duration-300"
          >
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop"
                alt="Acibadem Hospital Istanbul"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032654] via-[#032654]/40 to-transparent" />
              <div className="absolute top-4 rtl:right-4 rtl:left-auto ltr:right-4 ltr:left-auto bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                JCI Accredited
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00BFFF] uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" />
                <span>PREMIER HOSPITAL NETWORK</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t.hospitals.card2Title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {t.hospitals.card2Desc}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="bg-white/10 px-3 py-1 rounded-lg">
                  {language === 'ar' ? 'مستشفيات معتمدة' : language === 'fr' ? 'Hôpitaux certifiés JCI' : 'JCI Accredited'}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">
                  {language === 'ar' ? 'جراحة روبوتية' : language === 'fr' ? 'Chirurgie robotique' : 'Robotic Surgery'}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">
                  {language === 'ar' ? 'مختبرات توافق وراثي' : language === 'fr' ? 'Génétique avancée' : 'Genetic Diagnostics'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3 Supporting Value Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10 mb-8 sm:mb-14">
          {supportingItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00BFFF]/30 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0097FB]/20 text-[#00BFFF] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-0.5 sm:mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Infinite Kinetic Interactive Draggable River ─── */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-3 sm:py-4">
          {/* Header Bar with Strategic Title and Animated Hand Manipulation Indicator */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#00BFFF] text-center sm:text-start">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00BFFF] shrink-0" />
              <span>
                {language === 'ar'
                  ? 'شبكتنا الاستراتيجية من المستشفيات والمراكز المعتمدة دولياً JCI'
                  : language === 'fr'
                  ? 'Notre Réseau Stratégique d’Hôpitaux et Centres Certifiés JCI'
                  : 'Our Strategic Network of JCI-Accredited Hospitals & Centers'}
              </span>
            </div>

            {/* Interactive Hand Manipulation Indicator Pill */}
            <div
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold backdrop-blur-md transition-all duration-300 shadow-md ${
                isAnyRowDragging
                  ? 'bg-sky-500/30 border border-sky-400 text-white shadow-sky-500/30 ring-2 ring-sky-400/40 scale-105'
                  : 'bg-white/10 hover:bg-white/15 border border-white/20 text-sky-200'
              }`}
            >
              <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-500/30 text-sky-300 shadow-xs shrink-0">
                {isAnyRowDragging ? (
                  <Grab className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-pulse" />
                ) : (
                  <Hand className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-300 animate-hand-pan" />
                )}
              </span>
              <span>
                {isAnyRowDragging
                  ? language === 'ar'
                    ? 'جاري التصفح بالسحب • اترك للإكمال التلقائي'
                    : language === 'fr'
                    ? 'Défilement actif • Relâchez pour continuer'
                    : 'Interactive drag active • Release to auto-scroll'
                  : language === 'ar'
                  ? 'اسحب بالماوس يميناً ويساراً لتصفح المستشفيات'
                  : language === 'fr'
                  ? 'Glissez avec le curseur pour explorer'
                  : 'Drag with cursor or swipe to explore'}
              </span>
              <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-sky-300 font-mono tracking-wider font-semibold border border-white/10">
                {isAnyRowDragging ? 'ACTIVE' : 'TOUCH / DRAG'}
              </span>
            </div>
          </div>

          {/* Luxury Left/Right Vignette Blur Scrims */}
          <div className="absolute left-0 top-16 bottom-16 w-12 sm:w-28 z-20 pointer-events-none bg-gradient-to-r from-[#032654] to-transparent" />
          <div className="absolute right-0 top-16 bottom-16 w-12 sm:w-28 z-20 pointer-events-none bg-gradient-to-l from-[#032654] to-transparent" />

          {/* Row 1: Smooth Glide Left (Draggable with Cursor) */}
          <div className="relative mb-3">
            <DraggableHospitalRow
              rowId="row-1"
              items={row1Hospitals}
              direction="left"
              speed={0.8}
              language={language}
              accentColor="sky"
              onDragStateChange={(dragging) => setIsAnyRowDragging(dragging)}
            />
          </div>

          {/* Row 2: Smooth Glide Right (Draggable with Cursor) */}
          <div className="relative mb-6">
            <DraggableHospitalRow
              rowId="row-2"
              items={row2Hospitals}
              direction="right"
              speed={0.75}
              language={language}
              accentColor="teal"
              onDragStateChange={(dragging) => setIsAnyRowDragging(dragging)}
            />
          </div>

          {/* CTA to Full Hospitals Page */}
          <div className="mt-6 text-center">
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#0097FB] to-[#00BFFF] hover:from-[#0080d8] hover:to-[#00a8e0] text-white font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-full shadow-lg shadow-[#0097FB]/30 hover:shadow-[#0097FB]/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Building2 className="w-5 h-5" />
              <span>
                {language === 'ar'
                  ? 'استكشف كافة المستشفيات والاعتمادات'
                  : language === 'fr'
                  ? 'Explorer tous les hôpitaux partenaires'
                  : 'Explore All Partner Hospitals'}
              </span>
              {language === 'ar' ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Link>
            <p className="text-xs text-slate-400 mt-2.5">
              {language === 'ar'
                ? 'انقر على أي مستشفى للاطلاع على التجهيزات الجراحية والتقنيات وسعة الأسرّة'
                : language === 'fr'
                ? 'Cliquez sur un hôpital pour découvrir ses équipements chirurgicaux et accréditations'
                : 'Click on any hospital to explore surgical suites, medical equipment, and clinical facilities'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
