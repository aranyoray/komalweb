interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  page_path?: string;
  [key: string]: unknown;
}

interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    params?: GtagEventParams | Record<string, unknown>
  ) => void;
  dataLayer: Array<unknown>;
}
