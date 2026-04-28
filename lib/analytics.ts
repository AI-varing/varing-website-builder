declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  // GTM dataLayer (for any GTM-side trigger you wire later)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  // Direct to GA4 via gtag — beacon survives page-unload (e.g. tel: navigation)
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, { ...params, transport_type: 'beacon' });
  }
}
