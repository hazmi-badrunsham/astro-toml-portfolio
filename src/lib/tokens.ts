import type { ThemeConfig } from './schema';

export function generateCssVariables(theme: ThemeConfig): string {
  return `
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-foreground: ${theme.colors.foreground};
    --color-muted: ${theme.colors.muted};
    --color-accent: ${theme.colors.accent};
    --color-border: ${theme.colors.border};

    --font-heading: ${theme.fonts.heading};
    --font-body: ${theme.fonts.body};

    --spacing-section: ${theme.spacing.section};
    --spacing-container: ${theme.spacing.container};
    --spacing-gap: ${theme.spacing.gap};

    --layout-max-width: ${theme.layout.max_width};

    --border-width: ${theme.style.border_width};
    --border-radius: ${theme.style.border_radius};
    --panel-shadow: ${theme.style.panel_shadow};
  `.trim();
}