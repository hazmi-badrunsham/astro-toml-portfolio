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

export function getPortfolioData(): PortfolioData {
  const rawData = readTomlFile('portfolio.toml');
  return PortfolioSchema.parse(rawData);
}