// Generates src/pages/blog/index.astro and src/pages/blog/[slug].astro from a
// single source of truth so we never battle inline heredoc quoting in the
// shell. Re-run after any content change.
import { writeFileSync } from 'node:fs';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = resolve(__dirname, '../src/pages/blog');

mkdirSync(pagesDir, { recursive: true });

const indexDoc = `---
import { getSiteConfig } from '../../lib/config';
import { getBlogPosts } from '../../lib/config';
import Container from '../../components/ui/Container.astro';
import SectionTitle from '../../components/ui/SectionTitle.astro';
import Tag from '../../components/ui/Tag.astro';

const site = getSiteConfig();
const blog = site.blog;

if (!blog?.enabled) {
  return Astro.redirect('/');
}

const posts = await getBlogPosts();
if (!posts || posts.length === 0) {
  return Astro.redirect('/');
}

const title = blog.title ?? \`\${site.title} Blog\`;
const description = blog.description ?? '';
---

<html lang={\`\${site.language}\`}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <Container>
      <SectionTitle title={title} />
      {description && <p>{description}</p>}
      <ul>
        {posts.map((post) => (
          <article>
            <h3>
              <a href={\`/blog/\${post.slug}/\`}>{post.data.title}</a>
            </h3>
            {post.data.description && <p>{post.data.description}</p>}
            {post.data.tags && post.data.tags.length > 0 && (
              <div>
                {post.data.tags.map((t) => (
                  <Tag label={t} />
                ))}
              </div>
            )}
          </article>
        ))}
      </ul>
      <style>
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        article {
          padding: var(--spacing-gap);
          border-top: var(--border-width) solid var(--color-border);
        }
        article h3 {
          margin: 0 0 0.25rem;
        }
        article h3 a {
          text-decoration: none;
          color: var(--color-foreground);
        }
        article h3 a:hover {
          text-decoration: underline;
        }
      </style>
    </Container>
  </body>
</html>
`;

const postDoc = `---
import { getSiteConfig } from '../../../lib/config';
import { getCollection, type CollectionEntry } from 'astro:content';
import Container from '../../../components/ui/Container.astro';
import SectionTitle from '../../../components/ui/SectionTitle.astro';
import Tag from '../../../components/ui/Tag.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts
    .filter((p) => p.data.published !== false)
    .map((post) => ({
      params: { slug: post.slug },
      props: post,
    }));
}

const { post } = Astro.props as { post: CollectionEntry<'blog'> };
const { Content, data } = await post.render();
const site = getSiteConfig();
const blog = site.blog;
---

<html lang={\`\${site.language}\`}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{data.title}</title>
    <meta name="description" content={data.description ?? ''} />
  </head>
  <body>
    <Container>
      <SectionTitle title={data.title} />
      <time datetime={data.date.toISOString()}>
        {data.date.toLocaleDateString(
          site.language === 'en' ? 'en-US' : site.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )}
      </time>
      {data.description && <p>{data.description}</p>}
      {data.tags && data.tags.length > 0 && (
        <div>
          {data.tags.map((t) => (
            <Tag label={t} />
          ))}
        </div>
      )}
      <hr
        style="border:none;border-top:var(--border-width) solid var(--color-border);margin:var(--spacing-gap) 0"
      />
      <Content />
      <style>
        time {
          display: block;
          color: var(--color-muted);
          font-size: 0.875rem;
          margin-bottom: var(--spacing-gap);
        }
        hr {
          border: none;
        }
      </style>
    </Container>
  </body>
</html>
`;

writeFileSync(`${pagesDir}/index.astro`, indexDoc, 'utf8');
writeFileSync(`${pagesDir}/[slug].astro`, postDoc, 'utf8');

console.log('wrote', `${pagesDir}/index.astro`, 'and', `${pagesDir}/[slug].astro`);
