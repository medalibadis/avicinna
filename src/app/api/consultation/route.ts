import { NextResponse } from 'next/server';

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

// In-memory inquiries store for runtime / admin
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, country, specialty, notes } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Full name and phone number are required' },
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

    globalThis.globalInquiries!.unshift(newInquiry);

    return NextResponse.json({
      success: true,
      trackingId,
      message: 'Consultation request received successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    inquiries: globalThis.globalInquiries || [],
    count: (globalThis.globalInquiries || []).length,
  });
}
