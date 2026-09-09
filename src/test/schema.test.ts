// Vitest test suite for the TOML schema layer (src/lib/schema.ts).
//
// Run: npm test (watch mode) or npm run test:run (single run / CI).
import { describe, expect, it } from 'vitest';
import {
  PortfolioSchema,
  SiteConfigSchema,
  ThemeConfigSchema,
  type SiteConfig,
} from '../lib/schema';
import { MINIMAL_PORTFOLIO, MINIMAL_SITE, MINIMAL_THEME } from './fixtures';

// --- PortfolioSchema ------------------------------------------------------

describe('PortfolioSchema', () => {
  it('parses a valid minimal portfolio.toml correctly', () => {
    const data = PortfolioSchema.parse(MINIMAL_PORTFOLIO);

    expect(data.site.name).toBe('Test User');
    expect(data.site.title).toBe('Software Engineer');
    expect(data.about.description).toBe('About text.');
    expect(data.skills).toHaveLength(1);
    expect(data.experience?.[0]?.role).toBe('Support Engineer');
    expect(data.projects?.[0]?.tags).toEqual(['Astro']);
    expect(data.contact.email).toBe('test@example.com');
    expect(data.contact.socials).toHaveLength(1);
  });

  it('applies optional fields when present', () => {
    const withOptionals = {
      ...MINIMAL_PORTFOLIO,
      about: { ...MINIMAL_PORTFOLIO.about, avatar: '/avatar.jpg' },
      experience: [
        {
          ...MINIMAL_PORTFOLIO.experience[0],
          highlights: ['Did a thing', 'Did another thing'],
        },
      ],
      projects: [{ ...MINIMAL_PORTFOLIO.projects[0], link: 'https://example.com' }],
    };

    const data = PortfolioSchema.parse(withOptionals);

    expect(data.about.avatar).toBe('/avatar.jpg');
    expect(data.experience?.[0]?.highlights).toHaveLength(2);
    expect(data.projects?.[0]?.link).toBe('https://example.com');
  });

  it('produces a clear Zod error when required fields are missing', () => {
    const { site, ...withoutSite } = MINIMAL_PORTFOLIO;
    void site;

    expect(() => PortfolioSchema.parse(withoutSite)).toThrowError(
      /Invalid input|required|site/i
    );

    expect(() =>
      PortfolioSchema.parse({
        ...MINIMAL_PORTFOLIO,
        contact: { email: 'not-an-email', socials: [] },
      })
    ).toThrowError(/email/i);
  });
});

// --- SiteConfigSchema -----------------------------------------------------

describe('SiteConfigSchema', () => {
  it('parses a valid site.toml and keeps the given section order', () => {
    const site: SiteConfig = SiteConfigSchema.parse({
      ...MINIMAL_SITE,
      sections: ['hero', 'projects', 'contact'],
    });

    expect(site.template).toBe('minimal');
    expect(site.sections).toEqual(['hero', 'projects', 'contact']);
  });

  it('defaults template, language, and sections when omitted', () => {
    const site: SiteConfig = SiteConfigSchema.parse({ title: 'Test Site' });

    expect(site.template).toBe('minimal');
    expect(site.language).toBe('en');
    expect(site.sections).toEqual([
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'contact',
    ]);
  });

  it('rejects invalid section names in the sections array', () => {
    expect(() =>
      SiteConfigSchema.parse({
        ...MINIMAL_SITE,
        sections: ['hero', 'not-a-section'],
      })
    ).toThrowError(/not-a-section|Invalid option/i);
  });

  it('rejects a non-array sections value', () => {
    expect(() =>
      SiteConfigSchema.parse({
        ...MINIMAL_SITE,
        sections: 'hero',
      })
    ).toThrowError(/array|Invalid input/i);
  });
});