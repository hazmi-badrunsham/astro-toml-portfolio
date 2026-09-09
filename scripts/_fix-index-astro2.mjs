import { readFileSync, writeFileSync } from 'node:fs';

const filePath = 'src/pages/index.astro';
let content = readFileSync(filePath, 'utf8');

// Fix the getBlogPosts() call to handle undefined
// Pattern: {(await getBlogPosts())
// Replace with: {((await getBlogPosts()) ?? [])
content = content.replace(
  '{(await getBlogPosts())',
  '{((await getBlogPosts()) ?? [])'
);

writeFileSync(filePath, content, 'utf8');
console.log('Fixed index.astro - added null coalescing for getBlogPosts()');
console.log('Line 108:', content.split('\n')[107]);
