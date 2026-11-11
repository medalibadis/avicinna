import { NextResponse } from 'next/server';
import { readCmsStore } from '@/lib/cmsStore';
import { sendMetaCapiEvent } from '@/lib/trackingServer';
import { getClientIp } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventId, sourceUrl, customData } = body as {
      eventName?: 'Lead' | 'Contact' | 'PageView' | 'SubmitApplication';
      eventId?: string;
      sourceUrl?: string;
      customData?: Record<string, unknown>;
    };

    const allowed: Array<'Lead' | 'Contact' | 'PageView' | 'SubmitApplication'> = [
      'Lead',
      'Contact',
      'PageView',
      'SubmitApplication',
    ];
    if (!eventName || !allowed.includes(eventName)) {
      return NextResponse.json({ error: 'Unsupported eventName' }, { status: 400 });
    }

    const store = readCmsStore();
    const result = await sendMetaCapiEvent({
      tracking: store.settings.tracking!,
      eventName,
      eventId: eventId || `evt-${Date.now()}`,
      sourceUrl,
      clientIp: getClientIp(req),
      userAgent: req.headers.get('user-agent') || undefined,
      customData,
    });

    return NextResponse.json({ success: true, capi: result });
  } catch (err) {
    console.error('[api/tracking/event POST]:', err);
    return NextResponse.json({ error: 'Tracking dispatch error' }, { status: 500 });
  }
}

