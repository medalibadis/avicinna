import { NextResponse } from 'next/server';
import { isSupabaseConfigured, insertInquiryToDb, fetchInquiriesFromDb } from '@/lib/supabase';

export interface ConsultationInquiry {
  id: string;
  trackingId: string;
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  specialty?: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'in_review' | 'contacted' | 'scheduled';
}

// In-memory inquiries store for runtime / fallback
declare global {
  var globalInquiries: ConsultationInquiry[] | undefined;
}

if (!globalThis.globalInquiries) {
  globalThis.globalInquiries = [
    {
      id: 'inq-1',
      trackingId: 'AVIC-7821',
      fullName: 'خالد عبد الله العتيبي',
      phone: '+966 50 123 4567',
      email: 'khaled.alotaibi@example.com',
      country: 'المملكة العربية السعودية',
      specialty: 'cardiac-surgery',
      notes: 'استفسار بخصوص عملية ترميم الصمام الميترالي بالمنظار لوالدي (65 سنة).',
      createdAt: '2026-09-12T14:30:00Z',
      status: 'contacted',
    },
    {
      id: 'inq-2',
      trackingId: 'AVIC-7822',
      fullName: 'Jean-Marc Dubois',
      phone: '+33 6 12 34 56 78',
      email: 'jm.dubois@example.fr',
      country: 'France',
      specialty: 'hair-transplant',
      notes: 'Demande de devis pour greffe de cheveux DHI (environ 4000 greffons).',
      createdAt: '2026-09-13T09:15:00Z',
      status: 'new',
    },
    {
      id: 'inq-3',
      trackingId: 'AVIC-7823',
      fullName: 'مريم الكواري',
      phone: '+974 55 987 654',
      email: 'maryam.k@example.com',
      country: 'قطر',
      specialty: 'dentistry',
      notes: 'حجز موعد لابتسامة هوليوود (عدسات إيماكس لكلا الفكين) خلال شهر أكتوبر.',
      createdAt: '2026-09-14T08:00:00Z',
      status: 'in_review',
    },
  ];
}

// Sanitize string helper
function sanitizeInput(str: unknown, maxLength: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    // Enforce 50KB max payload limit
    if (rawBody.length > 51200) {
      return NextResponse.json(
        { error: 'Payload too large. Maximum allowed size is 50KB.' },
        { status: 413 }
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object' },
        { status: 400 }
      );
    }

    // Prototype pollution prevention
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    for (const key of Object.keys(parsed)) {
      if (dangerousKeys.includes(key)) {
        return NextResponse.json(
          { error: 'Invalid property key in payload' },
          { status: 400 }
        );
      }
    }

    const fullName = sanitizeInput(parsed.fullName, 100);
    const phone = sanitizeInput(parsed.phone, 35);
    const email = sanitizeInput(parsed.email, 120);
    const country = sanitizeInput(parsed.country, 100);
    const specialty = sanitizeInput(parsed.specialty, 100);
    const notes = sanitizeInput(parsed.notes, 3000);

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: 'Valid full name is required (at least 2 characters)' },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 5) {
      return NextResponse.json(
        { error: 'Valid phone number is required (at least 5 characters)' },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `AVIC-${randomSuffix}`;

    const newInquiry: ConsultationInquiry = {
      id: `inq-${Date.now()}`,
      trackingId,
      fullName,
      phone,
      email: email || '',
      country: country || '',
      specialty: specialty || 'general',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Attempt persistent storage if Supabase is active, fallback gracefully without failing
    if (isSupabaseConfigured) {
      try {
        await insertInquiryToDb(newInquiry);
      } catch (dbErr) {
        console.warn('Supabase inquiry insert skipped or failed, storing in memory:', dbErr);
      }
    }

    globalThis.globalInquiries!.unshift(newInquiry);

    return NextResponse.json({
      success: true,
      trackingId,
      message: 'Consultation request received successfully',
    });
  } catch (error: any) {
    console.error('Consultation POST processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry safely' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const dbInquiries = await fetchInquiriesFromDb();
      if (dbInquiries && dbInquiries.length > 0) {
        return NextResponse.json({
          inquiries: dbInquiries,
          count: dbInquiries.length,
          source: 'database',
        });
      }
    }
  } catch (err) {
    console.warn('Database fetch failed, falling back to in-memory store:', err);
  }

  return NextResponse.json({
    inquiries: globalThis.globalInquiries || [],
    count: (globalThis.globalInquiries || []).length,
    source: 'fallback',
  });
}
