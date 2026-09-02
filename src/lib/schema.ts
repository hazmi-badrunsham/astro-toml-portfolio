import { z } from 'zod';

// --- Site Config Schema ---
export const SiteConfigSchema = z.object({
  template: z.string().default('minimal'),
  title: z.string(),
  language: z.string().default('en'),
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
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
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
    panel_shadow: z.string(),
  }),
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
});

// Inferred TypeScript Types
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type PortfolioData = z.infer<typeof PortfolioSchema>;