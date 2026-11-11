'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { QuickValueCards } from '@/components/home/QuickValueCards';
import { AboutSection } from '@/components/home/AboutSection';
import { SpecialtiesGrid } from '@/components/home/SpecialtiesGrid';
import { WhyChooseAvicinna } from '@/components/home/WhyChooseAvicinna';
import { HospitalsPartners } from '@/components/home/HospitalsPartners';
import { FeaturedDoctors } from '@/components/home/FeaturedDoctors';
import { ConsultationSection } from '@/components/home/ConsultationSection';
import { PatientStoriesPreview } from '@/components/home/PatientStoriesPreview';
import { SocialReelsSection } from '@/components/home/SocialReelsSection';
import { MedicalBlogPreview } from '@/components/home/MedicalBlogPreview';
import { MedicalJourneyTimeline } from '@/components/common/MedicalJourneyTimeline';
import { FinalCTA } from '@/components/home/FinalCTA';
import { MedicalOrganizationSchema } from '@/components/common/StructuredData';
import type { Locale } from '@/types/cms';

export function HomeView({ locale = 'ar' }: { locale?: Locale }) {
  return (
    <>
      <MedicalOrganizationSchema locale={locale} />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <HeroSection />
        <StatsSection />
        <QuickValueCards />
        <AboutSection />
        <SpecialtiesGrid />
        <WhyChooseAvicinna />
        <HospitalsPartners />
        <FeaturedDoctors />
        <ConsultationSection />
        <PatientStoriesPreview />
        <SocialReelsSection />
        <MedicalBlogPreview />
        <MedicalJourneyTimeline />
        <FinalCTA />
      </main>
    </>
  );
}

