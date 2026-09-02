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

- `src/config/portfolio.toml` — Your personal info, projects, skills, experience, and contact details.

- `src/config/site.toml` — Active template key (template = "minimal" or "dark-japanese"), site title, and language.

- `src/config/theme.toml` — Design tokens (colors, fonts, spacing, shadows, borders).

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
2. Do NOT touch portfolio data or rewrite section components. Reuse `Hero`, `About`, `Skills`, `Experience`, `Projects`, and `Contact` from `../../components/sections/`.
3. Do NOT hardcode colors, padding, borders, or fonts. Rely strictly on CSS custom properties:
   - `--color-background`, `--color-surface`, `--color-foreground`, `--color-muted`, `--color-accent`, `--color-border`
   - `--font-heading`, `--font-body`
   - `--spacing-section`, `--spacing-container`, `--spacing-gap`
   - `--border-width`, `--border-radius`, `--panel-shadow`
4. Apply the requested aesthetic ([e.g. Bento grid layout / Terminal style / Editorial newspaper style]) strictly inside `styles.css` using parent layout wrappers.
5. Provide instructions on how to register the new template in `src/lib/template.ts`.
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