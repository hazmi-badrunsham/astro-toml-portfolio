import type { ThemeConfig } from './schema';

export const FALLBACK_FONT_STACK = 'system-ui, -apple-system, sans-serif';

export interface FontSelection {
  /** Full CSS font-family stack used for the --font-heading token. */
  headingStack: string;
  /** Full CSS font-family stack used for the --font-body token. */
  bodyStack: string;
  /** Google Fonts families to load via <link>, when configured by bare name. */
  googleFonts: { heading?: string; body?: string };
}

/** A bare name (no comma) is treated as a Google Fonts family; a comma list is a raw CSS stack. */
function isGoogleFontName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && !trimmed.includes(',');
}

/** Build the Google Fonts CSS2 URL for a single family name. */
export function googleFontCssUrl(family: string): string {
  const encoded = family.trim().replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${encoded}&display=swap`;
}

/**
 * Resolves the configured [fonts] table into CSS stacks:
 * - comma-separated value  → used as-is (no external request)
 * - bare font name         → Google Fonts <link> + `'<name>', system fallback` stack
 */
export function resolveFontSelection(theme: ThemeConfig): FontSelection {
  let headingStack = theme.fonts.heading.trim();
  let bodyStack = theme.fonts.body.trim();
  const googleFonts: { heading?: string; body?: string } = {};

  if (isGoogleFontName(headingStack)) {
    googleFonts.heading = headingStack;
    headingStack = `'${headingStack}', ${FALLBACK_FONT_STACK}`;
  }

  if (isGoogleFontName(bodyStack)) {
    googleFonts.body = bodyStack;
    bodyStack = `'${bodyStack}', ${FALLBACK_FONT_STACK}`;
  }

  return { headingStack, bodyStack, googleFonts };
}

export function generateCssVariables(theme: ThemeConfig): string {
  const { headingStack, bodyStack } = resolveFontSelection(theme);
  return `
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-foreground: ${theme.colors.foreground};
    --color-muted: ${theme.colors.muted};
    --color-accent: ${theme.colors.accent};
    --color-border: ${theme.colors.border};

    --font-heading: ${headingStack};
    --font-body: ${bodyStack};
    --font-weight-heading: ${theme.fonts.heading_weight};
    --font-weight-body: ${theme.fonts.body_weight};
    --letter-spacing-heading: ${theme.fonts.heading_letter_spacing};
    --letter-spacing-body: ${theme.fonts.body_letter_spacing};

    --spacing-section: ${theme.spacing.section};
    --spacing-container: ${theme.spacing.container};
    --spacing-gap: ${theme.spacing.gap};

    --layout-max-width: ${theme.layout.max_width};

    --border-width: ${theme.style.border_width};
    --border-radius: ${theme.style.border_radius};
    --radius-sm: ${theme.style.radius_sm};
    --radius-md: ${theme.style.radius_md};
    --radius-lg: ${theme.style.radius_lg};

    --transition-duration: ${theme.motion.duration};
    --transition-easing: ${theme.motion.easing};

    --panel-shadow: ${theme.style.panel_shadow};
  `.trim();
}