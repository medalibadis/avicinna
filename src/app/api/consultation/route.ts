import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { type ConsultationInquiry } from '@/data/defaultSections';
import {
  appendActivityLog,
  readCmsStore,
  updateCmsStore,
} from '@/lib/cmsStore';
import { dispatchLeadNotifications } from '@/lib/notifications';
import { sendMetaCapiEvent } from '@/lib/trackingServer';
import { requireApiAuth } from '@/lib/serverAuth';
import { getClientIp } from '@/lib/rateLimit';
import {
  isSupabaseConfigured,
  supabase,
  insertInquiryToDb,
  deleteInquiryFromDb,
} from '@/lib/supabase';
import type { InquiryAttachment, InquiryInternalNote, Locale } from '@/types/cms';

// Public lead submission rate limit: max 10 leads per 15 min per IP
const leadIpWindow = new Map<string, { count: number; resetAt: number }>();

function checkLeadRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = leadIpWindow.get(ip);
  if (!entry || now > entry.resetAt) {
    leadIpWindow.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count += 1;
  return true;
}

function escapeCsvCell(value: string | undefined | null, allowLeadingPlus = false): string {
  let str = String(value ?? '').replace(/\r\n/g, ' ').replace(/\n/g, ' ');
  // Neutralize Excel/Sheets CSV formula injection while preserving valid +213 phone prefixes when flagged
  if (/^[=@\t\r]/.test(str) || (!allowLeadingPlus && /^[+\-]/.test(str))) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

function normalizeAttachments(raw: unknown): InquiryAttachment[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .slice(0, 8)
    .map((item) => ({
      id: String(item.id || `att-${Date.now()}`),
      name: String(item.name || 'medical-file').slice(0, 180),
      url: String(item.url || ''),
      mimeType: String(item.mimeType || 'application/octet-stream'),
      size: Number(item.size || 0),
    }))
    .filter((att) => att.url.startsWith('/api/files/') || att.url.startsWith('https://'));
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkLeadRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      country,
      specialty,
      notes,
      language,
      sourceUrl,
      attachments,
      eventId,
      company_website, // optional honeypot
    } = body as {
      fullName?: string;
      phone?: string;
      email?: string;
      country?: string;
      specialty?: string;
      notes?: string;
      language?: string;
      sourceUrl?: string;
      attachments?: unknown;
      eventId?: string;
      company_website?: string;
    };

    if (company_website) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    if (!fullName?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Full name and phone number are required' },
        { status: 400 }
      );
    }

    const safeLang: Locale =
      language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar';

    const now = new Date().toISOString();
    const trackingId = `AV-${crypto.randomInt(100000, 999999)}`;
    const inquiryId = `inq-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const initialInquiry: ConsultationInquiry = {
      id: inquiryId,
      trackingId,
      fullName: fullName.trim().slice(0, 140),
      phone: phone.trim().slice(0, 40),
      email: email?.trim().slice(0, 160) || undefined,
      country: country?.trim().slice(0, 80) || undefined,
      specialty: specialty?.trim().slice(0, 120) || 'general',
      notes: notes?.trim().slice(0, 4000) || undefined,
      language: safeLang,
      sourceUrl: sourceUrl?.trim().slice(0, 400) || undefined,
      attachments: normalizeAttachments(attachments),
      internalNotes: [],
      notificationLog: [],
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    const store = readCmsStore();
    const notificationLog = await dispatchLeadNotifications(
      initialInquiry,
      store.settings.notifications!
    );

    const savedInquiry: ConsultationInquiry = {
      ...initialInquiry,
      notificationLog,
    };

    updateCmsStore((state) => ({
      ...state,
      inquiries: [savedInquiry, ...state.inquiries],
    }));

    if (isSupabaseConfigured) {
      await insertInquiryToDb(savedInquiry);
    }

    // Fire Meta Conversions API Lead event when enabled
    await sendMetaCapiEvent({
      tracking: store.settings.tracking!,
      eventName: 'Lead',
      eventId: eventId || inquiryId,
      sourceUrl: savedInquiry.sourceUrl,
      clientIp: ip,
      userAgent: req.headers.get('user-agent') || undefined,
      email: savedInquiry.email,
      phone: savedInquiry.phone,
      customData: {
        content_name: savedInquiry.specialty || 'general',
        lead_language: safeLang,
        tracking_id: trackingId,
      },
    });

    appendActivityLog({
      actorId: 'public-form',
      actorUsername: 'patient-lead',
      actorRole: 'anonymous',
      action: 'lead_created',
      targetType: 'inquiry',
      targetId: savedInquiry.id,
      details: `New ${safeLang.toUpperCase()} consultation lead (${trackingId}) — ${savedInquiry.fullName}`,
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry received safely.',
        trackingId,
        inquiry: savedInquiry,
        notifications: notificationLog,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[api/consultation POST]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'coordinator']);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const format = url.searchParams.get('format');
  const statusFilter = url.searchParams.get('status');
  const langFilter = url.searchParams.get('language');
  const assignedFilter = url.searchParams.get('assignedTo');

  let inquiries = readCmsStore().inquiries;

  if (statusFilter && statusFilter !== 'all') {
    inquiries = inquiries.filter((i) => i.status === statusFilter);
  }
  if (langFilter && langFilter !== 'all') {
    inquiries = inquiries.filter((i) => (i.language || 'ar') === langFilter);
  }
  if (assignedFilter && assignedFilter !== 'all') {
    inquiries = inquiries.filter((i) => i.assignedTo === assignedFilter);
  }

  if (format === 'csv') {
    const header = [
      'Tracking ID',
      'Full Name',
      'Phone',
      'Email',
      'Country',
      'Specialty',
      'Language',
      'Status',
      'Assigned Coordinator',
      'Medical Files',
      'Patient Notes',
      'Internal Notes',
      'Source URL',
      'Submitted At',
    ].join(',');

    const rows = inquiries.map((inq) =>
      [
        escapeCsvCell(inq.trackingId),
        escapeCsvCell(inq.fullName),
        escapeCsvCell(inq.phone, true),
        escapeCsvCell(inq.email),
        escapeCsvCell(inq.country),
        escapeCsvCell(inq.specialty),
        escapeCsvCell((inq.language || 'ar').toUpperCase()),
        escapeCsvCell(inq.status),
        escapeCsvCell(inq.assignedName || 'Unassigned'),
        escapeCsvCell(
          inq.attachments?.length
            ? inq.attachments.map((a) => a.name).join(' | ')
            : 'None'
        ),
        escapeCsvCell(inq.notes),
        escapeCsvCell(
          inq.internalNotes?.length
            ? inq.internalNotes.map((n) => `[${n.author}] ${n.text}`).join(' | ')
            : ''
        ),
        escapeCsvCell(inq.sourceUrl),
        escapeCsvCell(inq.createdAt),
      ].join(',')
    );

    const csvBody = `\uFEFF${header}\n${rows.join('\n')}`;

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'leads_exported_csv',
      targetType: 'inquiry',
      details: `Exported ${inquiries.length} patient leads to CSV`,
      ipAddress: getClientIp(req),
    });

    return new NextResponse(csvBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="avicinna-leads-${new Date().toISOString().split('T')[0]}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  return NextResponse.json({
    success: true,
    inquiries,
    total: inquiries.length,
  });
}

export async function PATCH(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'coordinator']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, status, assignedTo, assignedName, internalNote } = body as {
      id?: string;
      status?: ConsultationInquiry['status'];
      assignedTo?: string | null;
      assignedName?: string | null;
      internalNote?: string;
    };

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
    }

    const store = readCmsStore();
    const existing = store.inquiries.find((i) => i.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    let resolvedAssignedTo = existing.assignedTo;
    let resolvedAssignedName = existing.assignedName;

    if (assignedTo !== undefined) {
      if (!assignedTo) {
        resolvedAssignedTo = undefined;
        resolvedAssignedName = undefined;
      } else {
        const assignee = store.users.find((u) => u.id === assignedTo);
        resolvedAssignedTo = assignedTo;
        resolvedAssignedName = assignee?.fullName || assignedName || assignedTo;
      }
    } else if (assignedName !== undefined) {
      resolvedAssignedName = assignedName || undefined;
    }

    const nextNotes: InquiryInternalNote[] = [...(existing.internalNotes || [])];
    if (internalNote?.trim()) {
      nextNotes.push({
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        author: auth.session.fullName || auth.session.username,
        authorRole: auth.session.role,
        text: internalNote.trim(),
        createdAt: new Date().toISOString(),
      });
    }

    const updatedInquiry: ConsultationInquiry = {
      ...existing,
      status: status || existing.status,
      assignedTo: resolvedAssignedTo,
      assignedName: resolvedAssignedName,
      internalNotes: nextNotes,
      updatedAt: new Date().toISOString(),
    };

    updateCmsStore((state) => ({
      ...state,
      inquiries: state.inquiries.map((inq) => (inq.id === id ? updatedInquiry : inq)),
    }));

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('consultation_inquiries')
        .update({
          status: updatedInquiry.status,
          assigned_to: updatedInquiry.assignedTo || null,
          assigned_name: updatedInquiry.assignedName || null,
          internal_notes: updatedInquiry.internalNotes || [],
          updated_at: updatedInquiry.updatedAt,
        })
        .eq('id', id);
    }

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'lead_updated',
      targetType: 'inquiry',
      targetId: id,
      details: `Updated lead ${existing.trackingId}: status=${updatedInquiry.status}${updatedInquiry.assignedName ? `, assigned=${updatedInquiry.assignedName}` : ''}${internalNote?.trim() ? ', added internal note' : ''}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, inquiry: updatedInquiry });
  } catch (err) {
    console.error('[api/consultation PATCH]:', err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'coordinator']);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    let id = url.searchParams.get('id');
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
    }

    const existing = readCmsStore().inquiries.find((i) => i.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    updateCmsStore((state) => ({
      ...state,
      inquiries: state.inquiries.filter((i) => i.id !== id),
    }));

    if (isSupabaseConfigured) {
      await deleteInquiryFromDb(id);
    }

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'lead_deleted',
      targetType: 'inquiry',
      targetId: id,
      details: `Deleted lead ${existing.trackingId} (${existing.fullName})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/consultation DELETE]:', err);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
