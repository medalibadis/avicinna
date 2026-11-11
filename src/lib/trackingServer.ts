import crypto from 'crypto';
import type { TrackingConfig } from '@/types/cms';

function sha256Normalized(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function sha256Phone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  return crypto.createHash('sha256').update(digits).digest('hex');
}

export async function sendMetaCapiEvent(params: {
  tracking: TrackingConfig;
  eventName: 'Lead' | 'Contact' | 'PageView' | 'SubmitApplication';
  eventId: string;
  sourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
  email?: string;
  phone?: string;
  customData?: Record<string, unknown>;
}): Promise<{ ok: boolean; detail: string }> {
  const { tracking, eventName, eventId, sourceUrl, clientIp, userAgent, email, phone, customData } = params;

  if (!tracking.enableTracking || !tracking.metaPixelId || !tracking.metaCapiAccessToken) {
    return { ok: false, detail: 'Meta CAPI disabled or credentials missing' };
  }

  const userData: Record<string, unknown> = {};
  const hashedEmail = sha256Normalized(email);
  const hashedPhone = sha256Phone(phone);
  if (hashedEmail) userData.em = [hashedEmail];
  if (hashedPhone) userData.ph = [hashedPhone];
  if (clientIp && clientIp !== 'unknown') userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: eventId,
        event_source_url: sourceUrl || 'https://avicinna.com',
        user_data: userData,
        custom_data: customData || {},
      },
    ],
  };

  if (tracking.metaTestEventCode) {
    payload.test_event_code = tracking.metaTestEventCode;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(tracking.metaPixelId)}/events?access_token=${encodeURIComponent(tracking.metaCapiAccessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (res.ok) {
      return { ok: true, detail: 'CAPI event delivered' };
    }
    const errText = await res.text();
    return { ok: false, detail: `HTTP ${res.status}: ${errText.slice(0, 150)}` };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : 'CAPI network failure' };
  }
}

