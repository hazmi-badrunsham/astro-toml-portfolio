// src/lib/sections.ts
// Shared section-name → component mapping used by every template layout so the
// `sections` array in site.toml can control ordering and visibility.
// (Architecture rule 1: section components stay shared across all templates.)
import type { PortfolioData } from '../types/portfolio';
import type { SectionName } from './schema';
import Hero from '../components/sections/Hero.astro';
import About from '../components/sections/About.astro';
import Skills from '../components/sections/Skills.astro';
import Experience from '../components/sections/Experience.astro';
import Projects from '../components/sections/Projects.astro';
import Contact from '../components/sections/Contact.astro';
import BlogSection from '../components/sections/Blog.astro';

export const SECTION_COMPONENTS: Record<SectionName, any> = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  contact: Contact,
  blog: BlogSection,
};

/** Returns the slice of portfolio data expected by the section component. */
export function getSectionData(portfolio: PortfolioData, name: SectionName): any {
  switch (name) {
    case 'hero':
      return portfolio.site;
    case 'about':
      return portfolio.about;
    case 'skills':
      return portfolio.skills;
    case 'experience':
      return portfolio.experience;
    case 'projects':
      return portfolio.projects;
    case 'contact':
      return portfolio.contact;
    case 'blog':
      return portfolio.blog ?? {};
  }
}