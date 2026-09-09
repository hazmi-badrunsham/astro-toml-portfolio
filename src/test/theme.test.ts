// Vitest suite for ThemeConfigSchema defaults (Phase 2 theme tokens).
import { describe, expect, it } from 'vitest';
import { ThemeConfigSchema } from '../lib/schema';
import { MINIMAL_THEME } from './fixtures';

describe('ThemeConfigSchema', () => {
  it('parses a valid theme.toml', () => {
    const theme = ThemeConfigSchema.parse(MINIMAL_THEME);

    expect(theme.colors.accent).toBe('#2563eb');
    expect(theme.spacing.section).toBe('4rem');
    expect(theme.style.border_radius).toBe('8px');
  });

  it('defaults new optional fields (fonts details, radius tokens, motion)', () => {
    const theme = ThemeConfigSchema.parse(MINIMAL_THEME);

    expect(theme.fonts.heading_weight).toBe('700');
    expect(theme.fonts.body_weight).toBe('400');
    expect(theme.fonts.heading_letter_spacing).toBe('normal');
    expect(theme.fonts.body_letter_spacing).toBe('normal');
    expect(theme.style.radius_sm).toBe('4px');
    expect(theme.style.radius_md).toBe('8px');
    expect(theme.style.radius_lg).toBe('16px');
    expect(theme.motion.duration).toBe('200ms');
    expect(theme.motion.easing).toBe('ease-out');
  });

  it('applies defaults when whole optional tables are missing', () => {
    const { fonts, motion, ...withoutTables } = MINIMAL_THEME;
    void fonts;
    void motion;

    const theme = ThemeConfigSchema.parse(withoutTables);

    expect(theme.fonts.heading).toBe('system-ui, -apple-system, sans-serif');
    expect(theme.fonts.body).toBe('system-ui, -apple-system, sans-serif');
    expect(theme.motion.duration).toBe('200ms');
    expect(theme.motion.easing).toBe('ease-out');
  });

  it('keeps explicitly-provided values instead of defaults', () => {
    const theme = ThemeConfigSchema.parse({
      ...MINIMAL_THEME,
      fonts: {
        ...MINIMAL_THEME.fonts,
        heading: 'Space Grotesk',
        heading_weight: '600',
      },
      style: {
        ...MINIMAL_THEME.style,
        radius_lg: '24px',
      },
      motion: {
        duration: '300ms',
        easing: 'linear',
      },
    });

    expect(theme.fonts.heading).toBe('Space Grotesk');
    expect(theme.fonts.heading_weight).toBe('600');
    expect(theme.style.radius_lg).toBe('24px');
    expect(theme.motion.duration).toBe('300ms');
  });

  it('produces a clear Zod error when required token tables are missing', () => {
    const { colors, ...withoutColors } = MINIMAL_THEME;
    void colors;

    expect(() => ThemeConfigSchema.parse(withoutColors)).toThrowError(
      /colors|Invalid input/i
    );
  });
});