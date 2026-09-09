import { z } from 'zod';

// --- Section order & visibility ---
// Shared with src/lib/sections.ts and every template layout. Users can
// reorder or hide sections via the `sections` array in site.toml.
export const SECTION_NAMES = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'contact',
  'blog',
] as const;

// Example error message (Zod 4): Invalid option: expected one of "hero"|"about"|...
export const SectionNameSchema = z.enum(SECTION_NAMES);

export type SectionName = (typeof SECTION_NAMES)[number];

/** Backwards-compatible default: the order every template rendered before this feature. */
export const DEFAULT_SECTION_ORDER: readonly SectionName[] = SECTION_NAMES.filter(
  (n) => n !== 'blog'
);

// --- Common language codes users may configure ---
export const KNOWN_LANG_CODES = [
  'en',
  'es',
  'fr',
  'de',
  'pt',
  'it',
  'ja',
  'ko',
  'zh',
  'ar',
  'hi',
  'ru',
  'nl',
  'pl',
  'tr',
  'sv',
  'da',
  'fi',
  'nb',
  'ro',
  'hu',
  'cs',
  'el',
  'th',
  'vi',
  'id',
  'ms',
  'tl',
  'uk',
  'he',
  'bn',
  'ta',
  'te',
  'mr',
  'gu',
  'kn',
  'ml',
  'pa',
  'ur',
  'fa',
  'sw',
  'af',
  'ca',
  'eu',
  'gl',
  'sq',
  'mk',
  'sr',
  'bg',
  'hr',
  'sk',
  'sl',
  'lt',
  'lv',
  'et',
  'is',
  'cy',
  'ga',
  'mt',
  'la',
] as const;

// --- Site Config Schema ---
export const SiteConfigSchema = z.object({
  template: z.string().default('minimal'),
  title: z.string(),
  language: z
    .string()
    .default('en')
    .refine(
      (v: string) => KNOWN_LANG_CODES.includes(v as (typeof KNOWN_LANG_CODES)[number]),
      {
        message: `Unsupported language code "${'v'}". Use one of: ${KNOWN_LANG_CODES.join(', ')}.`,
        path: ['language'],
      }
    ),
  sections: z
    .array(SectionNameSchema)
    .default([...DEFAULT_SECTION_ORDER])
    .describe(
      'Ordered list of sections to render; omit a section to hide it. ' +
        'Allowed: hero, about, skills, experience, projects, contact (blog appears automatically when enabled).'
    ),
  // --- Optional features (all gated; absent = no effect) ---
  blog: z
    .object({
      enabled: z.boolean().default(false),
      title: z.string().optional(),
      description: z.string().optional(),
      postsPerPage: z.number().int().min(1).default(10),
    })
    .default({ enabled: false, postsPerPage: 10 })
    .describe('Blog section. Only active when enabled = true and src/content/blog/ has entries.'),
  seo: z
    .object({
      generateOgImage: z.boolean().default(false),
      siteName: z.string().optional(),
      separator: z.string().default(' | '),
    })
    .default({ generateOgImage: false, separator: ' | ' })
    .describe(
      'SEO helpers. generateOgImage = true enables an automated social-share image via sharp on every page.'
    ),
  i18n: z
    .object({
      locales: z.array(z.string().length(2)).optional(),
      pickerLabel: z.string().default('Language'),
    })
    .nullable()
    .default(null)
    .describe(
      'When locales is declared (e.g. ["en", "es"]), a language picker is shown and alternate portfolio.<lang>.toml files are supported.'
    ),
  analytics: z
    .object({
      provider: z.enum(['none', 'plausible', 'umami']).default('none'),
      domain: z.string().optional(),
      scriptUrl: z.string().url().optional(),
    })
    .default({ provider: 'none' })
    .describe(
      "Analytics provider. 'none' (default) injects nothing. 'plausible' uses the official script; 'umami' uses its self-hosted script shape."
    ),
});

// --- Theme Config Schema ---
export const ThemeConfigSchema = z.object({
  colors: z.object({
    background: z.string(),
    surface: z.string(),
    surface_hover: z.string().optional(),
    foreground: z.string(),
    muted: z.string(),
    accent: z.string(),
    accent_muted: z.string().optional(),
    border: z.string(),
    selection: z.string().optional(),
  }),
  fonts: z
    .object({
      heading: z.string().default('system-ui, -apple-system, sans-serif'),
      body: z.string().default('system-ui, -apple-system, sans-serif'),
      heading_weight: z.string().default('700'),
      body_weight: z.string().default('400'),
      heading_letter_spacing: z.string().default('normal'),
      body_letter_spacing: z.string().default('normal'),
    })
    .default({
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
      heading_weight: '700',
      body_weight: '400',
      heading_letter_spacing: 'normal',
      body_letter_spacing: 'normal',
    }),
  spacing: z.object({
    section: z.string(),
    container: z.string(),
    gap: z.string(),
  }),
  layout: z.object({
    max_width: z.string(),
  }),
  style: z.object({
    border_width: z.string(),
    border_radius: z.string(),
    radius_sm: z.string().default('4px'),
    radius_md: z.string().default('8px'),
    radius_lg: z.string().default('16px'),
    panel_shadow: z.string(),
  }),
  motion: z
    .object({
      duration: z.string().default('200ms'),
      easing: z.string().default('ease-out'),
    })
    .default({ duration: '200ms', easing: 'ease-out' }),
});

// --- Portfolio Content Schema ---
export const PortfolioSchema = z.object({
  site: z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string(),
  }),
  about: z.object({
    avatar: z.string().optional(),
    description: z.string(),
  }),
  skills: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      period: z.string(),
      description: z.string(),
      highlights: z.array(z.string()).optional(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      link: z.string().optional(),
    })
  ),
  contact: z.object({
    email: z.string().email(),
    socials: z.array(
      z.object({
        name: z.string(),
        url: z.string().url(),
      })
    ),
  }),
  // Optional. When present, values here take precedence over site.toml blog settings.
  blog: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

// Inferred TypeScript Types
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type PortfolioData = z.infer<typeof PortfolioSchema>;