#!/usr/bin/env node
// Scaffold a new zero-code portfolio from this engine's template set.
//
// Lives in `scripts/` for now; will be packaged as the standalone
// `create-toml-portfolio` npm package later.
//
// Usage:
//   node scripts/create-toml-portfolio.mjs [target-dir]
//   (target-dir defaults to ./my-portfolio)
//
// The script copies this repo (minus node_modules, .git, dist and other
// build artefacts), prompts for the site name + starting template, writes
// those into src/config/site.toml, and prints the next steps.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Anything a fresh checkout does not need.
const SKIP = new Set([
  '.git',
  'node_modules',
  'dist',
  '.astro',
  'repomix-output.xml',
]);

const TEMPLATE_CHOICES = [
  'minimal',
  'dark-japanese',
  'khakis-90s',
  'bento-grid',
  'terminal',
  'editorial',
];

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyTree(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

function patchSiteToml(targetRoot, { siteName, template }) {
  const sitePath = path.join(targetRoot, 'src', 'config', 'site.toml');
  let text = fs.readFileSync(sitePath, 'utf8');

  text = text.replace(/^\s*title\s*=.*$/m, `title = ${JSON.stringify(siteName)}`);
  text = text.replace(
    /^\s*template\s*=.*$/m,
    `template = ${JSON.stringify(template)}`
  );

  // Normalize to LF so scaffolded projects behave identically on any OS.
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  fs.writeFileSync(sitePath, text, 'utf8');
}

// --- prompting ------------------------------------------------------------
// Works both interactively (TTY) and with piped/stdin-redirected input.
//
// Note: plain readline.question() drops input when several lines arrive in a
// single chunk (each buffered line is processed synchronously, before the
// next question() registers), which hangs the second prompt on piped input.
// So for piped input we buffer all lines up front; for a TTY we prompt
// interactively.
async function readPipedLines() {
  if (process.stdin.isTTY) return null;
  let data = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) data += chunk;
  // Normalize CRLF/CR so line splitting is platform-independent; the
  // target TOML files are rewritten with LF newlines below.
  return data.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
    .map((line) => line.trim());
}

async function ask(rl, piped, promptText, fallback) {
  if (piped !== null) {
    const answer = (piped.length > 0 ? piped.shift() : '') ?? '';
    process.stdout.write(`${promptText}${answer}\n`);
    return answer === '' ? fallback : answer;
  }
  const answer = (await rl.question(promptText)).trim();
  return answer === '' ? fallback : answer;
}

async function main() {
  const targetDir = process.argv[2] ?? 'my-portfolio';
  const targetRoot = path.resolve(process.cwd(), targetDir);

  if (fs.existsSync(targetRoot) && fs.readdirSync(targetRoot).length > 0) {
    console.error(`✖ ${targetDir} already exists and is not empty. Aborting.`);
    process.exit(1);
  }

  console.log(`Scaffolding a new TOML portfolio in ${targetDir} …`);
  copyTree(ROOT, targetRoot);

  const piped = await readPipedLines();
  const rl = piped === null ? readline.createInterface({ input, output }) : null;

  const siteName = await ask(
    rl,
    piped,
    'Site name (e.g. "Your Name")? ',
    'My Portfolio'
  );

  console.log(`Starting template (one of: ${TEMPLATE_CHOICES.join(', ')})`);
  let template = await ask(rl, piped, 'Template [minimal]? ', 'minimal');
  if (!TEMPLATE_CHOICES.includes(template)) {
    console.log(`⚠ Unknown template "${template}", falling back to "minimal".`);
    template = 'minimal';
  }

  if (rl) rl.close();

  patchSiteToml(targetRoot, { siteName, template });

  console.log('');
  console.log('✔ Done! Next steps:');
  console.log(`  cd ${targetDir}`);
  console.log('  npm install');
  console.log('  npm run dev');
  console.log('');
  console.log(`(template = "${template}" written to src/config/site.toml)`);
}

main().catch((err) => {
  console.error('✖ Scaffold failed:', err?.message ?? err);
  process.exit(1);
});