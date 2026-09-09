// Shared minimal fixtures for the TOML schema test suite.
// Kept loosely typed so tests can omit/add whole TOML tables.
export const MINIMAL_PORTFOLIO: Record<string, any> = {
  site: {
    name: 'Test User',
    title: 'Software Engineer',
    bio: 'A short bio.',
  },
  about: {
    description: 'About text.',
  },
  skills: [{ category: 'Languages', items: ['TypeScript', 'SQL'] }],
  experience: [
    {
      role: 'Support Engineer',
      company: 'Acme',
      period: '2024 - Present',
      description: 'Support work.',
    },
  ],
  projects: [
    {
      name: 'Demo Project',
      description: 'A project.',
      tags: ['Astro'],
    },
  ],
  contact: {
    email: 'test@example.com',
    socials: [{ name: 'GitHub', url: 'https://github.com' }],
  },
};

export const MINIMAL_SITE: Record<string, any> = {
  template: 'minimal',
  title: 'Test Site',
  language: 'en',
  sections: ['hero', 'about', 'skills', 'experience', 'projects', 'contact'],
};

export const MINIMAL_THEME: Record<string, any> = {
  colors: {
    background: '#ffffff',
    surface: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    accent: '#2563eb',
    border: '#e2e8f0',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    section: '4rem',
    container: '2rem',
    gap: '1.5rem',
  },
  layout: {
    max_width: '800px',
  },
  style: {
    border_width: '1px',
    border_radius: '8px',
    panel_shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
};