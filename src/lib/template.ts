// src/lib/template.ts
// Templates are auto-discovered from src/templates/<key>/:
//   <Key>Layout.astro + styles.css  → the rendered layout
//   template.json                    → metadata (name, author, description, previewImage)

const layoutModules = import.meta.glob('../templates/*/*Layout.astro', { eager: true });
const metadataModules = import.meta.glob('../templates/*/template.json', { eager: true });

export interface TemplateMeta {
  name: string;
  author: string;
  description: string;
  previewImage: string;
}

export interface TemplateCatalogEntry {
  key: string;
  meta: TemplateMeta;
}

export type TemplateKey = string;

/** Normalizes glob paths (backslashes on Windows) and extracts the template folder name. */
function templateKeyFromPath(modulePath: string): string | null {
  const match = modulePath.replace(/\\/g, '/').match(/\/templates\/([^/]+)\//);
  return match ? match[1] : null;
}

/** Unwraps the default export of a glob'ed module. */
function resolveModule<T>(mod: unknown): T {
  if (typeof mod === 'object' && mod !== null && 'default' in mod) {
    const candidate = (mod as { default?: unknown }).default;
    return (candidate ?? mod) as T;
  }
  return mod as T;
}

const layouts: Record<string, any> = {};
const metadata: Record<string, TemplateMeta> = {};

for (const path in layoutModules) {
  const key = templateKeyFromPath(path);
  if (key) layouts[key] = resolveModule<any>(layoutModules[path]);
}

for (const path in metadataModules) {
  const key = templateKeyFromPath(path);
  if (key) metadata[key] = resolveModule<TemplateMeta>(metadataModules[path]);
}

/** key → layout component (kept for backwards compatibility with existing callers). */
export const TEMPLATES: Record<string, any> = layouts;

export function getTemplateKeys(): string[] {
  return Object.keys(layouts).sort();
}

export function getTemplateMetadata(key: string): TemplateMeta | undefined {
  return metadata[key];
}

/** Full catalog (key + metadata) for galleries, pickers, etc. */
export function getTemplateCatalog(): TemplateCatalogEntry[] {
  return getTemplateKeys().map((key) => ({
    key,
    meta: metadata[key] ?? { name: key, author: 'unknown', description: '', previewImage: '' },
  }));
}