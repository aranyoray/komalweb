export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag('event', 'page_view', {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  {
    event_category,
    event_label,
    value,
    ...otherParams
  }: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: unknown;
  } = {}
) => {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag('event', action, {
    event_category,
    event_label,
    value,
    ...otherParams,
  });
};
