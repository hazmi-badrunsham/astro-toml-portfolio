import fs from 'node:fs';
import path from 'node:path';
import TOML from '@iarna/toml';
import {
  SiteConfigSchema,
  ThemeConfigSchema,
  PortfolioSchema,
  type SiteConfig,
  type ThemeConfig,
  type PortfolioData,
} from './schema';

function readTomlFile(filename: string) {
  const filePath = path.resolve(process.cwd(), `src/config/${filename}`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return TOML.parse(fileContent);
}

export function getSiteConfig(): SiteConfig {
  const rawData = readTomlFile('site.toml');
  return SiteConfigSchema.parse(rawData);
}

export function getThemeConfig(): ThemeConfig {
  const rawData = readTomlFile('theme.toml');
  return ThemeConfigSchema.parse(rawData);
}

function portfolioFilenameForLang(lang: string): string {
  // Default language uses the canonical portfolio.toml. Any other supported
  // language uses an alternate file: portfolio.es.toml, portfolio.fr.toml, etc.
  // Falls back to portfolio.toml if the localized file does not exist.
  if (lang === 'en') return 'portfolio.toml';
  const candidate = `portfolio.${lang}.toml`;
  const filePath = path.resolve(process.cwd(), `src/config/${candidate}`);
  if (fs.existsSync(filePath)) return candidate;
  return 'portfolio.toml';
}

export function getPortfolioData(): PortfolioData {
  const site = SiteConfigSchema.parse(readTomlFile('site.toml'));
  const filename = portfolioFilenameForLang(site.language);
  const rawData = readTomlFile(filename);
  return PortfolioSchema.parse(rawData);
}

/**
 * Returns the blog posts collection at build time, or `undefined` when the
 * blog feature is disabled. Callers use this only inside Astro pages/infra —
 * it is never called during the CLI/config-time load path.
 */
export async function getBlogPosts(): Promise<Awaited<ReturnType<typeof import('astro:content').getCollection>> | undefined> {
  const site = SiteConfigSchema.parse(readTomlFile('site.toml'));
  if (!site.blog?.enabled) return undefined;

  // Content collections are only available inside Astro's build/runtime. If
  // this module is imported outside that context (e.g. CLI), return nothing
  // rather than crashing.
  try {
    const { getCollection } = await import('astro:content');
    const all = await getCollection('blog');
    return all.sort((a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );
  } catch {
    return undefined;
  }
}

export type BlogPost = Awaited<ReturnType<typeof import('astro:content').getCollection>>[number];