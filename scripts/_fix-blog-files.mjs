import { readFileSync, writeFileSync } from 'node:fs';

// Fix index.astro - the await result needs to be checked
let indexContent = readFileSync('src/pages/index.astro', 'utf8');
// The pattern is: {(await getBlogPosts()).filter(...)
// We need to handle the case where getBlogPosts() returns undefined
indexContent = indexContent.replace(
  /\{(await getBlogPosts\(\))\.filter\(/g,
  '{((await getBlogPosts()) ?? []).filter('
);
writeFileSync('src/pages/index.astro', indexContent, 'utf8');
console.log('Fixed index.astro');

// Fix [slug].astro - post.render is a property, not a method
let slugContent = readFileSync('src/pages/blog/[slug].astro', 'utf8');
slugContent = slugContent.replace(
  'const { Content, data } = post.render;',
  'const { Content, data } = await post.render();'
);
writeFileSync('src/pages/blog/[slug].astro', slugContent, 'utf8');
console.log('Fixed [slug].astro');
