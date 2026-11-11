'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { useData } from '@/context/DataContext';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function trackLeadConversion(params: {
  eventId: string;
  specialty?: string;
  language?: string;
}) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'consultation',
        event_label: params.specialty || 'general',
        lead_language: params.language || 'ar',
      });
    }
    if (typeof window.fbq === 'function') {
      window.fbq(
        'track',
        'Lead',
        {
          content_name: params.specialty || 'Medical Consultation',
          language: params.language || 'ar',
        },
        { eventID: params.eventId }
      );
    }
  } catch {
    // ignore analytics runtime failures
  }
}

export function trackWhatsAppClick(source: string, targetUrl?: string) {
  if (typeof window === 'undefined') return;
  const eventId = `wa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: source,
        link_url: targetUrl || '',
      });
    }
    if (typeof window.fbq === 'function') {
      window.fbq(
        'track',
        'Contact',
        {
          content_name: `WhatsApp: ${source}`,
        },
        { eventID: eventId }
      );
    }
    fetch('/api/tracking/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventName: 'Contact',
        eventId,
        sourceUrl: window.location.href,
        customData: { channel: 'whatsapp', source, targetUrl: targetUrl || '' },
      }),
    }).catch(() => {});
  } catch {
    // ignore tracking failures
  }
}

export function TrackingScripts({
  initialTracking,
}: {
  initialTracking?: {
    enableTracking: boolean;
    ga4MeasurementId: string;
    metaPixelId: string;
  };
}) {
  const { settings } = useData();
  const tracking = settings?.tracking || initialTracking;
  const enabled = Boolean(tracking?.enableTracking);
  const ga4Id = (tracking?.ga4MeasurementId || initialTracking?.ga4MeasurementId || '').trim();
  const pixelId = (tracking?.metaPixelId || initialTracking?.metaPixelId || '').trim();

  // Global delegated tracker for all WhatsApp links across the site
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (href.includes('wa.me/') || href.includes('api.whatsapp.com')) {
        const source = anchor.getAttribute('data-wa-source') || anchor.textContent?.trim().slice(0, 60) || 'whatsapp-link';
        trackWhatsAppClick(source, href);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {ga4Id && (
        <>
          <Script
            id="avicinna-ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`}
          />
          <Script id="avicinna-ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${ga4Id.replace(/[^A-Za-z0-9_-]/g, '')}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {pixelId && (
        <Script id="avicinna-meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId.replace(/[^0-9]/g, '')}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}

