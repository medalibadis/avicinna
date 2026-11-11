'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { HospitalPartner } from '@/data/hospitals';
import { getLocalizedEntityPath, getLocalizedPath } from '@/lib/i18nRoutes';
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
} from 'lucide-react';

interface DraggableHospitalRowProps {
  items: HospitalPartner[];
  direction?: 'left' | 'right';
  speed?: number;
  language: 'ar' | 'en' | 'fr';
  rowId: string;
  hasMounted: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
  accentColor?: 'sky' | 'teal';
}

const DraggableHospitalRow: React.FC<DraggableHospitalRowProps> = ({
  items,
  direction = 'left',
  speed = 0.8,
  language,
  rowId,
  hasMounted,
  onDragStateChange,
  accentColor = 'sky',
}) => {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetWidthRef = useRef<number>(0);

  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const momentumRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);

  // SSR renders 1x clean unique cards (dramatically reducing homepage HTML size & duplicate links).
  // After client hydration, expands to 3x for smooth infinite marquee wrapping.
  const renderedHospitals = useMemo(() => {
    if (!items || items.length === 0) return [];
    return hasMounted ? [...items, ...items, ...items] : items;
  }, [items, hasMounted]);

  const measureWidth = useCallback(() => {
    if (trackRef.current && items.length > 0 && hasMounted) {
      const totalWidth = trackRef.current.scrollWidth;
      const setWidth = totalWidth / 3;
      if (setWidth > 150) {
        singleSetWidthRef.current = setWidth;
        if (offsetRef.current > -setWidth * 0.5 || offsetRef.current < -setWidth * 2) {
          offsetRef.current = -setWidth;
        }
      }
    }
  }, [items.length, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    measureWidth();
    window.addEventListener('resize', measureWidth);
    const timer = setTimeout(measureWidth, 400);
    return () => {
      window.removeEventListener('resize', measureWidth);
      clearTimeout(timer);
    };
  }, [measureWidth, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    let animId: number;
    const baseStep = direction === 'left' ? -speed : speed;

    const animate = () => {
      if (!isPointerDownRef.current) {
        let step = baseStep;
        if (isHoveredRef.current) step *= 0.3;
        if (Math.abs(momentumRef.current) > 0.04) {
          step += momentumRef.current;
          momentumRef.current *= 0.94;
        }
        offsetRef.current += step;
      }

      const setW = singleSetWidthRef.current;
      if (setW > 0) {
        while (offsetRef.current <= -2 * setW) offsetRef.current += setW;
        while (offsetRef.current >= -setW) offsetRef.current -= setW;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [direction, speed, hasMounted]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    hasMovedRef.current = false;
    momentumRef.current = 0;
    velocityRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const dx = e.clientX - lastXRef.current;
    if (Math.abs(e.clientX - startXRef.current) > 10 && !hasMovedRef.current) {
      hasMovedRef.current = true;
      onDragStateChange?.(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
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
    } catch {}
    momentumRef.current = Math.max(-16, Math.min(16, velocityRef.current));
    setTimeout(() => onDragStateChange?.(false), 60);
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 150);
  };

  const renderCardInner = (hosp: HospitalPartner) => (
    <>
      <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-xl bg-slate-900 cursor-pointer">
        <img
          src={hosp.image}
          alt={hosp.name[language]}
          draggable={false}
          loading="lazy"
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
          className={`text-xs sm:text-sm font-bold text-white transition-colors line-clamp-2 min-h-[2rem] sm:min-h-0 sm:line-clamp-1 leading-snug ${
            accentColor === 'teal' ? 'group-hover:text-teal-300' : 'group-hover:text-sky-300'
          }`}
          style={{ unicodeBidi: 'plaintext' }}
        >
          {hosp.name[language]}
        </h4>
        <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300">
          <span className="flex items-center gap-1 text-slate-300/90 font-medium">
            <Bed className={`h-3 w-3 ${accentColor === 'teal' ? 'text-teal-400' : 'text-sky-400'}`} />
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
    </>
  );

  const cardClassName = `group relative w-[260px] sm:w-80 shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-3.5 shadow-xl transition-all duration-300 hover:scale-105 select-none cursor-pointer block ${
    accentColor === 'teal'
      ? 'hover:border-teal-400/60 hover:bg-white/10 hover:shadow-teal-500/20'
      : 'hover:border-sky-400/60 hover:bg-white/10 hover:shadow-sky-500/20'
  }`;

  return (
    <div
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
      dir="ltr"
    >
      <div ref={trackRef} className="flex items-center gap-4 w-max will-change-transform">
        {renderedHospitals.map((hosp, idx) => {
          const href = getLocalizedEntityPath('hospitals', hosp, language);
          const isPrimary = idx < items.length;

          if (isPrimary) {
            return (
              <Link
                key={`${rowId}-${hosp.id}-${idx}`}
                href={href}
                onClick={(e) => {
                  if (hasMovedRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                }}
                draggable={false}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                className={cardClassName}
              >
                {renderCardInner(hosp)}
              </Link>
            );
          }

          return (
            <div
              key={`${rowId}-clone-${hosp.id}-${idx}`}
              role="presentation"
              aria-hidden="true"
              onClick={() => {
                if (!hasMovedRef.current) router.push(href);
              }}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              className={cardClassName}
            >
              {renderCardInner(hosp)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HospitalsPartners: React.FC = () => {
  const { t, language } = useLanguage();
  const { hospitals } = useData();
  const [hasMounted, setHasMounted] = useState(false);
  const [isAnyRowDragging, setIsAnyRowDragging] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const supportingItems = [
    { icon: Hotel, title: t.hospitals.facilityTitle, desc: t.hospitals.facilityDesc },
    { icon: Car, title: t.hospitals.transferTitle, desc: t.hospitals.transferDesc },
    { icon: Languages, title: t.hospitals.coordinationTitle, desc: t.hospitals.coordinationDesc },
  ];

  const { row1Hospitals, row2Hospitals } = useMemo(() => {
    if (!hospitals || hospitals.length === 0) return { row1Hospitals: [], row2Hospitals: [] };
    const r1: HospitalPartner[] = [];
    const r2: HospitalPartner[] = [];
    hospitals.forEach((hosp, idx) => {
      if (idx % 2 === 0) r1.push(hosp);
      else r2.push(hosp);
    });
    return {
      row1Hospitals: r1.length > 0 ? r1 : hospitals,
      row2Hospitals: r2.length > 0 ? r2 : hospitals,
    };
  }, [hospitals]);

  const hospitalsIndexHref = getLocalizedPath('/hospitals', language);

  return (
    <section className="py-8 sm:py-20 bg-[#032654] text-white relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0097FB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Hospitality Intro */}
        <div className="hidden md:block">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl hover:border-[#00BFFF]/40 transition-all duration-300 hover:-translate-y-1">
              <div className="h-72 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"
                  alt="Luxury Patient Suite Istanbul"
                  loading="lazy"
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
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.hospitals.card1Title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{t.hospitals.card1Desc}</p>
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
            </div>

            <div className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl hover:border-[#00BFFF]/40 transition-all duration-300 hover:-translate-y-1">
              <Link href={hospitalsIndexHref} className="block h-72 overflow-hidden relative cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop"
                  alt="Acibadem Hospital Istanbul"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#032654] via-[#032654]/40 to-transparent" />
                <div className="absolute top-4 rtl:right-4 ltr:right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  JCI Accredited
                </div>
              </Link>
              <div className="p-7">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#00BFFF] uppercase tracking-wider mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>PREMIER HOSPITAL NETWORK</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.hospitals.card2Title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{t.hospitals.card2Desc}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="bg-white/10 px-3 py-1 rounded-lg">
                    {language === 'ar' ? 'مستشفيات معتمدة' : language === 'fr' ? 'Hôpitaux certifiés JCI' : 'JCI Accredited'}
                  </span>
                  <span className="bg-white/10 px-3 py-1 rounded-lg">
                    {language === 'ar' ? 'جراحة روبوتية' : language === 'fr' ? 'Chirurgie robotique' : 'Robotic Surgery'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {supportingItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#0097FB]/15 text-[#00BFFF] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Partner Carousel Header */}
        <div className="relative pt-2 sm:pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-300 text-center sm:text-start">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00BFFF] shrink-0" />
              <span>
                {language === 'ar'
                  ? 'شبكتنا الاستراتيجية من المستشفيات والمراكز المعتمدة دولياً JCI'
                  : language === 'fr'
                  ? 'Notre Réseau Stratégique d’Hôpitaux et Centres Certifiés JCI'
                  : 'Our Strategic Network of JCI-Accredited Hospitals & Centers'}
              </span>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold backdrop-blur-md transition-all duration-300 shadow-md ${
                isAnyRowDragging
                  ? 'bg-sky-500/30 border border-sky-400 text-white'
                  : 'bg-white/10 hover:bg-white/15 border border-white/20 text-sky-200'
              }`}
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/30 text-sky-300 shrink-0">
                {isAnyRowDragging ? <Grab className="w-3 h-3 text-white" /> : <Hand className="w-3 h-3 text-sky-300" />}
              </span>
              <span>
                {language === 'ar'
                  ? 'اسحب بالماوس لتصفح المستشفيات'
                  : language === 'fr'
                  ? 'Glissez pour explorer les hôpitaux'
                  : 'Drag with cursor or swipe to explore'}
              </span>
            </div>
          </div>

          <div className="relative mb-4">
            <DraggableHospitalRow
              rowId="row-primary"
              items={hasMounted ? row1Hospitals : hospitals}
              direction="left"
              speed={0.8}
              language={language}
              hasMounted={hasMounted}
              accentColor="sky"
              onDragStateChange={setIsAnyRowDragging}
            />
          </div>

          {hasMounted && (
            <div className="hidden sm:block relative mb-6">
              <DraggableHospitalRow
                rowId="row-secondary"
                items={row2Hospitals}
                direction="right"
                speed={0.75}
                language={language}
                hasMounted={hasMounted}
                accentColor="teal"
                onDragStateChange={setIsAnyRowDragging}
              />
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href={hospitalsIndexHref}
              className="inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-gradient-to-r from-[#0097FB] to-[#00BFFF] hover:from-[#0080d8] hover:to-[#00a8e0] text-white font-extrabold text-xs sm:text-base py-3 sm:py-3.5 px-5 sm:px-8 rounded-full shadow-lg shadow-[#0097FB]/30 transition-all duration-300 hover:scale-105"
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">
                {language === 'ar'
                  ? 'استكشف كافة المستشفيات والاعتمادات'
                  : language === 'fr'
                  ? 'Explorer tous les hôpitaux partenaires'
                  : 'Explore All Partner Hospitals'}
              </span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
