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
import { MedicalBlogPreview } from '@/components/home/MedicalBlogPreview';
import { MedicalJourneyTimeline } from '@/components/common/MedicalJourneyTimeline';
import { FinalCTA } from '@/components/home/FinalCTA';
import { MedicalOrganizationSchema } from '@/components/common/StructuredData';

export default function HomePage() {
  return (
    <>
      <MedicalOrganizationSchema />
      <main className="flex-1">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Statistics */}
        <StatsSection />

        {/* 3. Quick Value / Trust Cards */}
        <QuickValueCards />

        {/* 4. About AVICINNA */}
        <AboutSection />

        {/* 5. Medical Specialties */}
        <SpecialtiesGrid />

        {/* 6. Why Choose AVICINNA */}
        <WhyChooseAvicinna />

        {/* 7. Hospitals & Partners */}
        <HospitalsPartners />

        {/* 8. Featured Doctors */}
        <FeaturedDoctors />

        {/* 9. Consultation CTA & Form */}
        <ConsultationSection />

        {/* 10. Patient Stories Preview */}
        <PatientStoriesPreview />

        {/* 11. Medical Blog Preview */}
        <MedicalBlogPreview />

        {/* 12. Medical Journey Timeline */}
        <MedicalJourneyTimeline />

        {/* 13. Final CTA */}
        <FinalCTA />
      </main>
    </>
  );
}
