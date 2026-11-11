import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';
import { appendActivityLog, readCmsStore } from '@/lib/cmsStore';
import { dispatchLeadNotifications } from '@/lib/notifications';
import { getClientIp } from '@/lib/rateLimit';
import type { ConsultationInquiry } from '@/data/defaultSections';

export async function POST(req: Request) {
  const auth = await requireApiAuth(req, ['admin']);
  if (!auth.ok) return auth.response;

  try {
    const store = readCmsStore();
    const body = await req.json().catch(() => ({}));
    const overrideConfig = body?.notifications
      ? { ...store.settings.notifications!, ...body.notifications }
      : store.settings.notifications!;

    const syntheticCheck: ConsultationInquiry = {
      id: `notif-test-${Date.now()}`,
      trackingId: 'AV-TEST',
      fullName: 'AVICINNA Notification Test',
      phone: store.settings.contact.phone || '+90 536 000 00 00',
      email: store.settings.contact.email,
      country: 'DZ',
      specialty: 'System Notification Verification',
      notes: 'Diagnostic alert triggered by AVICINNA Administrator.',
      language: 'en',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const results = await dispatchLeadNotifications(syntheticCheck, overrideConfig);

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'notifications_tested',
      targetType: 'settings',
      details: `Tested notification channels (${results.map((r) => `${r.channel}:${r.status}`).join(', ')})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error('[api/notifications/test POST]:', err);
    return NextResponse.json({ error: 'Notification test failed' }, { status: 500 });
  }
}

