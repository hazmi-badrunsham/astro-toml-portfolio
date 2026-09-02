// src/lib/template.ts
import MinimalLayout from '../templates/minimal/MinimalLayout.astro';

// Eager load all layout components
const templateModules = import.meta.glob('../templates/*/*Layout.astro', { eager: true });

export const TEMPLATES: Record<string, any> = {
  minimal: MinimalLayout,
};

for (const path in templateModules) {
  // Normalize path separators for both Windows and Unix
  const normalizedPath = path.replace(/\\/g, '/');
  
  // Extract folder name between /templates/ and the next /
  const match = normalizedPath.match(/\/templates\/([^/]+)\//);
  
  if (match && match[1]) {
    const templateKey = match[1];
    const mod = templateModules[path] as any;
    
    // Store the Astro default component
    TEMPLATES[templateKey] = mod.default || mod;
  }
}

export type TemplateKey = string;