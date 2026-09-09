---
title: "Welcome to the TOML portfolio blog"
date: 2026-09-09
description: "A short sample post to show the blog section rendering. Delete or replace this when you're ready."
tags: ["blog", "sample"]
---

Your portfolio now has a blog. To add real posts, drop Markdown files into
`src/content/blog/` and configure `[blog] enabled = true` in `src/config/site.toml`.

Every post gets its own page at `/blog/<slug>/` and shows up in the blog index at
`/blog/`. The section uses the same SectionTitle, Container, and Tag UI components
as the rest of the site, so it stays visually consistent.

To disable the blog, set `enabled = false` (or remove the `[blog]` table entirely) —
the site rebuilds without any blog markup.
