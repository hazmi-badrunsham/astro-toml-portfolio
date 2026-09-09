export type AnalyticsProvider = 'none' | 'plausible' | 'umami';

export interface AnalyticsScript {
  tag: string;
  attrs?: Record<string, string>;
  body?: string;
}

/**
 * Returns the HTML needed for the selected analytics provider, or a no-op
 * empty string when provider === 'none' (the default).
 *
 * Callers render this inside <head>. The returned string is plain HTML, so it
 * gets injected via `set:html`; it must already be sanitized/trusted (it only
 * ever contains the provider's official script shape plus user-supplied
 * `scriptUrl` when given).
 */
export function analyticsScript(
  provider: AnalyticsProvider,
  domain?: string,
  scriptUrl?: string
): string {
  if (provider === 'none') return '';

  if (provider === 'plausible') {
    const url =
      scriptUrl ??
      `https://plausible.io/js/script.js${domain ? `?domain=${domain}` : ''}`;
    return `<script defer data-domain="${domain ?? 'example.com'}" src="${url}"></script>`;
  }

  // umami: official self-hosted snippet shape.
  const src = scriptUrl ?? 'https://analytics.example.com/umami.js';
  const siteId = domain ?? 'default';
  return `<script defer src="${src}" data-host-url="${src}" data-domains="${siteId}"></script>`;
}
