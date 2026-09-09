# ⚡ TOML-Powered Astro Portfolio Engine

A headless, zero-code portfolio engine built with **Astro**, **TypeScript**, and **TOML**. Manage your content, design tokens, and templates purely through configuration files.

## Quick Start

1. **Install dependencies:**
  ```bash
   npm install
   ```
2. **Start dev server:**
  ```bash
   npm run dev
   ```
3. **Build for production:**
  ```bash
   npm run build
  ```

## Configuration

All content lives in three TOML files under `src/config/`. You never need to touch code to customize your site.

> **Developer tooling:** the full check pipeline is one command —
> `npm run check` (type-check) → `npm run test:run` (tests) → `npm run build`.
> CI runs all three on every push/PR (see [Continuous integration](#continuous-integration)).

### `src/config/site.toml` — Site & page structure

- `template` — Active template key: `"minimal"`, `"dark-japanese"`, `"khakis-90s"`, `"bento-grid"`, `"terminal"`, or `"editorial"` (default: `"minimal"`). Any unknown value falls back to `minimal`. See [Templates](#templates) for the full catalog.
- `title` — Site title.
- `language` — `<html lang>` attribute (default: `"en"`).
- `sections` — *(optional)* Ordered list of sections to display:
  ```toml
  sections = ["hero", "about", "projects", "skills", "experience", "contact"]
  ```
  - **Valid names:** `hero`, `about`, `skills`, `experience`, `projects`, `contact`. Any other name causes a clear validation error at build time.
  - **Default** (when the key is omitted): `["hero", "about", "skills", "experience", "projects", "contact"]` — the original rendering order, so existing configs keep working unchanged.
  - **Reorder** sections by changing the order of the entries.
  - **Hide** a section by leaving it out of the array (e.g. drop `"contact"`).

### `src/config/theme.toml` — Design tokens

Every key maps to a CSS custom property on `:root` (`--color-*`, `--font-*`, `--spacing-*`, `--border-*`, `--panel-shadow`, `--radius-*`, `--letter-spacing-*`, `--transition-*`). Templates only ever consume these tokens.

- `[colors]` — `background`, `surface`, `foreground`, `muted`, `accent`, `border`; optional: `surface_hover`, `accent_muted`, `selection`.
- `[fonts]` — Typography tokens:
  - `heading` / `body` — each value is **either**:
    1. **A Google Fonts family name** — e.g. `heading = "Space Grotesk"`. The engine injects the Google Fonts `<link>` tags into `<head>` automatically and maps it to `--font-heading` with a system fallback.
    2. **A full comma-separated CSS font stack** — e.g. `heading = "Inter, system-ui, sans-serif"`. Used as-is, no external request.
    If omitted, the fallback `system-ui, -apple-system, sans-serif` is used.
  - `heading_weight` (default `"700"`) → `--font-weight-heading`
  - `body_weight` (default `"400"`) → `--font-weight-body`
  - `heading_letter_spacing` (default `"normal"`) → `--letter-spacing-heading`
  - `body_letter_spacing` (default `"normal"`) → `--letter-spacing-body`
- `[spacing]` — `section`, `container`, `gap` (`--spacing-section`, `--spacing-container`, `--spacing-gap`).
- `[layout]` — `max_width` (`--layout-max-width`).
- `[style]` — `border_width` (`--border-width`), `border_radius` (`--border-radius`), `panel_shadow` (`--panel-shadow`), plus finer radii: `radius_sm` (default `"4px"`) → `--radius-sm`, `radius_md` (default `"8px"`) → `--radius-md`, `radius_lg` (default `"16px"`) → `--radius-lg`.
- `[motion]` — *(new table)* `duration` (default `"200ms"`) → `--transition-duration`, `easing` (default `"ease-out"`) → `--transition-easing`.

*Example — switch to Google Fonts with a single edit:*
```toml
[fonts]
heading = "Space Grotesk"
body = "Inter"
```

### `src/config/portfolio.toml` — Content

Your personal info, projects, skills, experience, and contact details — `[site]`, `[about]`, `[[skills]]`, `[[experience]]`, `[[projects]]`, `[contact]` with `[[contact.socials]]`.

## Templates

Templates live in `src/templates/<key>/` and are **auto-registered** by `src/lib/template.ts` from the folder name (via `import.meta.glob`) — dropping in a new folder is all it takes. Each template ships with:

- `<Key>Layout.astro` — the layout, iterating the configured `sections` via the shared `SECTION_COMPONENTS` map;
- `styles.css` — template styling, consuming **only** the design tokens;
- `template.json` — metadata consumed by the gallery and `getTemplateMetadata()`:

  ```json
  {
    "name": "Bento Grid",
    "author": "you",
    "description": "Card-based dashboard-style layout",
    "previewImage": "/template-previews/bento-grid.png"
  }
  ```

### Template catalog

| Key | Name | Description |
| --- | --- | --- |
| `minimal` | Minimal | Clean single-column layout with subtle surfaces and rounded cards. |
| `dark-japanese` | Dark Japanese | Ink-and-paper aesthetic with a vertical accent frame and hanko seal. |
| `khakis-90s` | Khakis 90s | Vintage catalog cards with offset hard shadows and a retro stamp. |
| `bento-grid` | Bento Grid | Card-based dashboard layout with sections as bento tiles. |
| `terminal` | Terminal | Monospace terminal-window chrome with a blinking-cursor accent. |
| `editorial` | Editorial | Newspaper/magazine style with multi-column About and Experience. |

### Template previews

Every `template.json` points at `/template-previews/<key>.png` (served from `public/template-previews/`). The repository includes deterministic wireframe stand-ins generated by:

```bash
node scripts/generate-previews.mjs
```

Replace any `<key>.png` with a real screenshot whenever one is available — nothing else needs to change.

## Continuous integration

`.github/workflows/ci.yml` runs on every push/PR to `master`:

1. `npm ci` — clean dependency install (fresh-clone safe);
2. `npm run check` — `astro check` type-check; fails on any type **error**;
3. `npm run test:run` — Vitest suite for the TOML schema layer;
4. `npm run build` — full static site build.

Any step failing fails the pipeline.

## Scaffold a new site (create-toml-portfolio)

`scripts/create-toml-portfolio.mjs` scaffolds a fresh zero-code portfolio from
this repo's current files (excluding `node_modules`, `.git`, and `dist`).
It will be packaged as the standalone `create-toml-portfolio` npm package later.

```bash
node scripts/create-toml-portfolio.mjs my-site
# or: npm run create -- my-site
```

The script copies the repo, prompts for the **site name** and **starting
template**, writes both into `src/config/site.toml`, and prints the next steps:

```bash
cd my-site
npm install
npm run dev
```

## Feeding Repo Context to AI (using Repomix)
To package your entire codebase into a single AI-friendly context file:

1. **Pack the repository:**
  ```bash
   npx repomix
   ```
2. Feed the generated repomix-output.xml (or .txt) file directly to your AI tool (ChatGPT, Claude, Gemini).

## How to Create a New Template

### Method A: Using AI (Recommended)

Copy and paste this prompt into an AI assistant alongside your repo context:
```text
Act as an Astro frontend developer. Build a new template for my portfolio engine called "[TEMPLATE_NAME]".

RULES TO FOLLOW:
1. Create `src/templates/[TEMPLATE_NAME]/[Name]Layout.astro` and `src/templates/[TEMPLATE_NAME]/styles.css`.
2. Do NOT touch portfolio data or rewrite section components. Reuse `Hero`, `About`, `Skills`, `Experience`, `Projects`, and `Contact` from `../../components/sections/` via the shared map in `src/lib/sections.ts` (`SECTION_COMPONENTS` + `getSectionData`).
3. Your layout receives two props: `data` (the full portfolio) and `sections` (an ordered array of section names from `site.toml`). Iterate `sections` and render each with the matching entry from `SECTION_COMPONENTS`, wrapped in your template's own markup — never hardcode the section list.
4. Do NOT hardcode colors, padding, borders, or fonts. Rely strictly on CSS custom properties generated from `src/lib/tokens.ts`:
   - `--color-background`, `--color-surface`, `--color-foreground`, `--color-muted`, `--color-accent`, `--color-border`
   - `--font-heading`, `--font-body`, `--font-weight-heading`, `--font-weight-body`
   - `--letter-spacing-heading`, `--letter-spacing-body`
   - `--spacing-section`, `--spacing-container`, `--spacing-gap`
   - `--border-width`, `--border-radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--panel-shadow`
   - `--transition-duration`, `--transition-easing`
5. Apply the requested aesthetic ([e.g. Bento grid layout / Terminal style / Editorial newspaper style]) strictly inside `styles.css` using parent layout wrappers.
6. Add a `template.json` next to the layout/styles with `name`, `author`, `description`, and `previewImage` pointing at `/template-previews/<key>.png` (run `node scripts/generate-previews.mjs` to regenerate the placeholder wireframes).
7. No manual registration needed — `import.meta.glob` in `src/lib/template.ts` auto-discovers the folder (the folder name becomes the template key).
```
### Method B: Manual Creation
1. Duplicate reference folder:

```Bash
cp -r src/templates/minimal src/templates/my-new-template
```
2. **Rename layout file**:
Rename src/templates/my-new-template/MinimalLayout.astro to MyNewTemplateLayout.astro.

3. **Customize CSS & Layout**:
Modify structural wrappers or CSS in styles.css. Keep CSS custom properties intact!

4. **Auto-Discovery**:
If you implemented import.meta.glob in src/lib/template.ts, templates auto-register based on folder name. Otherwise, manually import and add your key inside src/lib/template.ts.

5. **Activate Template**:
Set template = "my-new-template" inside src/config/site.toml.