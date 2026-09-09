/**
 * Build-time OG image generator.
 *
 * When `[seo] generateOgImage = true` in site.toml, this integration
 * generates a static social-share image at the build output root as
 * og-image.png after the Astro build completes. The image is produced from
 * the portfolio's site name and bio using sharp (SVG → PNG).
 *
 * When the flag is false or absent, the integration removes any pre-existing
 * og-image.png so the build output stays identical to a site without this
 * feature enabled.
 */

import fs from 'node:fs';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { getSiteConfig } from './config';
import { getPortfolioData } from './config';

const __dirname = dirname(fileURLToPath(import.meta.url));
// const projectRoot = resolve(__dirname, '../..'); // unused

export default function ogIntegration() {
  return {
    name: 'toml-portfolio-og-image',
    hooks: {
      'astro:build:done': async (result: { dir: { pathname: string } }) => {
        const siteConfig = getSiteConfig();
        const seo = siteConfig.seo;
        const generate = seo?.generateOgImage;

        // Output path inside the build directory.
        const outPath = resolve(result.dir.pathname, 'og-image.png');

        if (!generate) {
          // Ensure no stale OG image remains when the feature is off.
          if (fs.existsSync(outPath)) {
            fs.unlinkSync(outPath);
          }
          return;
        }

        const portfolio = getPortfolioData();
        const siteName =
          seo?.siteName ?? portfolio.site.name ?? 'Portfolio';
        const tagline = portfolio.site.bio ?? '';
        const separator = seo?.separator ?? ' | ';

        const titleText = `${siteName}${separator}${tagline}`.trim();

        // Build an SVG with the title text. Simple composition: dark surface
        // with light text, sized 1200×630 (Open Graph recommended).
        const svg = buildOgSvg({
          title: titleText,
          width: 1200,
          height: 630,
        });

        // sharp renders the SVG to PNG.
        await sharp(Buffer.from(svg))
          .png()
          .toFile(outPath);

        console.log(
          `[toml-portfolio-og-image] Generated ${outPath}`
        );
      },
    },
  };
}

interface OgSvgOptions {
  title: string;
  width: number;
  height: number;
}

function buildOgSvg({ title, width, height }: OgSvgOptions): string {
  // Simple two-tone composition: dark background, light text.
  const bg = '#0f172a';
  const fg = '#f8fafc';
  const accent = '#38bdf8';

  // Break the title into lines that fit within the canvas width.
  const maxCharsPerLine = Math.floor(width / 10); // rough estimate
  const lines = wrapText(title, maxCharsPerLine);

  // Estimate vertical positioning.
  const lineHeight = 96;
  const totalHeight = lines.length * lineHeight;
  const startY = (height - totalHeight) / 2 + 80;

  const textElements = lines
    .map((line, i) => {
      const y = startY + i * lineHeight;
      // Accent the first line subtly.
      const fill = i === 0 ? accent : fg;
      return (
        `<text x="${width / 2}" y="${y}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="${fill}">${escapeXml(line)}</text>`
      );
    })
    .join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bg}" />
  <rect x="0" y="0" width="12" height="${height}" fill="${accent}" />
  <text x="${width / 2}" y="56" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="${fg}80">PORTFOLIO</text>
  ${textElements}
</svg>`;
}

function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
