import type { ConsultationInquiry } from '@/data/defaultSections';
import type { InquiryNotificationLog, NotificationConfig } from '@/types/cms';

function formatLeadSummary(inquiry: ConsultationInquiry): string {
  const filesCount = inquiry.attachments?.length || 0;
  return [
    `🏥 NEW AVICINNA PATIENT LEAD (${inquiry.trackingId})`,
    `• Name: ${inquiry.fullName}`,
    `• Phone: ${inquiry.phone}`,
    inquiry.email ? `• Email: ${inquiry.email}` : null,
    inquiry.country ? `• Country: ${inquiry.country}` : null,
    `• Language: ${(inquiry.language || 'ar').toUpperCase()}`,
    inquiry.specialty ? `• Specialty: ${inquiry.specialty}` : null,
    filesCount > 0 ? `• Medical Files Attached: ${filesCount}` : null,
    inquiry.notes ? `• Notes: ${inquiry.notes.slice(0, 500)}` : null,
    `• Submitted: ${inquiry.createdAt}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function dispatchLeadNotifications(
  inquiry: ConsultationInquiry,
  config: NotificationConfig
): Promise<InquiryNotificationLog[]> {
  const logs: InquiryNotificationLog[] = [];
  const now = new Date().toISOString();
  const summaryText = formatLeadSummary(inquiry);

  // 1. Telegram Instant Notification
  const botToken = config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = config.telegramChatId || process.env.TELEGRAM_CHAT_ID || '';
  if (config.telegramEnabled && botToken && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: summaryText,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        logs.push({ channel: 'telegram', status: 'sent', detail: `Delivered to chat ${chatId}`, at: now });
      } else {
        const err = await res.text();
        logs.push({ channel: 'telegram', status: 'failed', detail: `HTTP ${res.status}: ${err.slice(0, 120)}`, at: now });
      }
    } catch (e) {
      logs.push({
        channel: 'telegram',
        status: 'failed',
        detail: e instanceof Error ? e.message : 'Telegram dispatch error',
        at: now,
      });
    }
  } else {
    logs.push({ channel: 'telegram', status: 'skipped', detail: 'Not configured/disabled', at: now });
  }

  // 2. Email Notification (Resend REST API)
  const resendKey = config.resendApiKey || process.env.RESEND_API_KEY || '';
  const emailTo = config.emailTo || process.env.LEAD_ALERT_EMAIL || '';
  const emailFrom = config.emailFrom || 'AVICINNA Alerts <onboarding@resend.dev>';
  if (config.emailEnabled && resendKey && emailTo) {
    try {
      const htmlBody = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px">
          <h2 style="color:#032654;margin-top:0">New Patient Consultation Lead (${inquiry.trackingId})</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#64748b">Patient</td><td style="font-weight:bold">${inquiry.fullName}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Phone / WhatsApp</td><td style="font-weight:bold">${inquiry.phone}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Email</td><td>${inquiry.email || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Country</td><td>${inquiry.country || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Specialty</td><td>${inquiry.specialty || 'general'}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Language</td><td>${(inquiry.language || 'ar').toUpperCase()}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Medical Files</td><td>${inquiry.attachments?.length || 0} file(s)</td></tr>
          </table>
          <div style="margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px;font-size:13px">
            <strong>Notes:</strong><br/>${(inquiry.notes || 'None').replace(/</g, '&lt;')}
          </div>
        </div>
      `;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: emailTo.split(',').map((s) => s.trim()).filter(Boolean),
          subject: `[AVICINNA Lead ${inquiry.trackingId}] ${inquiry.fullName} (${inquiry.specialty || 'Consultation'})`,
          html: htmlBody,
          text: summaryText,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        logs.push({ channel: 'email', status: 'sent', detail: `Sent to ${emailTo}`, at: now });
      } else {
        const err = await res.text();
        logs.push({ channel: 'email', status: 'failed', detail: `HTTP ${res.status}: ${err.slice(0, 120)}`, at: now });
      }
    } catch (e) {
      logs.push({
        channel: 'email',
        status: 'failed',
        detail: e instanceof Error ? e.message : 'Email dispatch error',
        at: now,
      });
    }
  } else {
    logs.push({ channel: 'email', status: 'skipped', detail: 'Not configured/disabled', at: now });
  }

  // 3. WhatsApp Notification (Webhook or Meta WhatsApp Cloud API)
  if (config.whatsappWebhookEnabled) {
    if (config.whatsappCloudToken && config.whatsappPhoneNumberId && config.whatsappNotifyNumber) {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v21.0/${config.whatsappPhoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${config.whatsappCloudToken}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: config.whatsappNotifyNumber.replace(/[^0-9]/g, ''),
              type: 'text',
              text: { body: summaryText },
            }),
            signal: AbortSignal.timeout(5000),
          }
        );
        if (res.ok) {
          logs.push({ channel: 'whatsapp', status: 'sent', detail: 'WhatsApp Cloud API alert sent', at: now });
        } else {
          const err = await res.text();
          logs.push({ channel: 'whatsapp', status: 'failed', detail: `HTTP ${res.status}: ${err.slice(0, 120)}`, at: now });
        }
      } catch (e) {
        logs.push({
          channel: 'whatsapp',
          status: 'failed',
          detail: e instanceof Error ? e.message : 'WhatsApp Cloud error',
          at: now,
        });
      }
    } else if (config.whatsappWebhookUrl) {
      try {
        const res = await fetch(config.whatsappWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_lead',
            text: summaryText,
            inquiry,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          logs.push({ channel: 'whatsapp', status: 'sent', detail: 'Webhook delivered', at: now });
        } else {
          logs.push({ channel: 'whatsapp', status: 'failed', detail: `Webhook HTTP ${res.status}`, at: now });
        }
      } catch (e) {
        logs.push({
          channel: 'whatsapp',
          status: 'failed',
          detail: e instanceof Error ? e.message : 'Webhook error',
          at: now,
        });
      }
    } else {
      logs.push({ channel: 'whatsapp', status: 'skipped', detail: 'Webhook/Cloud API credentials missing', at: now });
    }
  } else {
    logs.push({ channel: 'whatsapp', status: 'skipped', detail: 'Disabled', at: now });
  }

  return logs;
}
