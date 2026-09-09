import { readFileSync, writeFileSync } from 'node:fs';

const filePath = 'src/pages/index.astro';
let content = readFileSync(filePath, 'utf8');

// Fix the possibly undefined getBlogPosts() result
content = content.replace(
  '{(await getBlogPosts()).filter',
  '{(await getBlogPosts())?.filter'
);

writeFileSync(filePath, content, 'utf8');
console.log('Fixed index.astro - added optional chaining for getBlogPosts()');
