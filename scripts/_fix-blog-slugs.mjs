import { readFileSync, writeFileSync } from 'node:fs';

const filePath = 'src/pages/blog/index.astro';
let content = readFileSync(filePath, 'utf8');

// Fix post.slug -> post.id-based slug extraction
content = content.replace(
  /<a href={\`\/blog\/\$\{post\.slug\}\/\`}>/g,
  '<a href={`/blog/${post.id.split(\'/\').pop()!.replace(/\\.md$/, \'\')}/`}>'
);

writeFileSync(filePath, content, 'utf8');
console.log('Fixed index.astro');
console.log(content.split('\n').find(l => l.includes('post.id')));
