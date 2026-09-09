// scripts/generate-previews.mjs
// Generates placeholder wireframe preview images for every template in
// src/templates/<key>/ → public/template-previews/<key>.png
//
// The template gallery (Phase 5) reads `previewImage` from each template's
// template.json. These are deterministic stand-ins until real screenshots
// are captured — replace any <key>.png with an actual screenshot.
//
// Run: node scripts/generate-previews.mjs
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('public/template-previews');
const W = 480;
const H = 300;

/* ---------- minimal PNG encoder (no external deps) ---------- */

let CRC_TABLE = null;
function crc32(data) {
  if (!CRC_TABLE) {
    CRC_TABLE = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >> 1)) : (c >> 1);
      CRC_TABLE[n] = c;
    }
  }
  let crc = 0xffffffff;
  for (const b of data) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >> 8);
  // JS bitwise ops are signed int32; normalize to an unsigned value.
  const raw = crc ^ 0xffffffff;
  return ((raw + 0x100000000) % 0x100000000);
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function hexColor(hex) {
  return parseInt(hex.replace('#', ''), 16);
}

class Canvas {
  constructor(w, h, bgHex) {
    this.w = w;
    this.h = h;
    this.px = Buffer.alloc(w * h * 4);
    this.fill(0, 0, w, h, hexColor(bgHex));
  }

  fill(x, y, w, h, color) {
    if (w <= 0 || h <= 0) return;
    const x0 = Math.max(0, x);
    const y0 = Math.max(0, y);
    const x1 = Math.min(this.w, x + w);
    const y1 = Math.min(this.h, y + h);
    for (let j = y0; j < y1; j++) {
      const base = (j * this.w + x0) * 4;
      for (let i = base; i < base + (x1 - x0) * 4; i += 4) {
        this.px[i] = (color >> 16) & 0xff;
        this.px[i + 1] = (color >> 8) & 0xff;
        this.px[i + 2] = color & 0xff;
        this.px[i + 3] = 0xff;
      }
    }
  }

  outline(x, y, w, h, colorHex, thickness = 1) {
    const c = hexColor(colorHex);
    this.fill(x, y, w, thickness, c);
    this.fill(x, y + h - thickness, w, thickness, c);
    this.fill(x, y, thickness, h, c);
    this.fill(x + w - thickness, y, thickness, h, c);
  }

  save(file) {
    const stride = this.w * 4;
    const raw = Buffer.alloc((stride + 1) * this.h);
    let p = 0;
    for (let y = 0; y < this.h; y++) {
      raw[p++] = 0; // filter: none
      this.px.copy(raw, p, y * stride, (y + 1) * stride);
      p += stride;
    }
    const idat = zlib.deflateSync(raw);

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.w, 0);
    ihdr.writeUInt32BE(this.h, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type: RGBA
    const png = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', idat),
      chunk('IEND', Buffer.alloc(0)),
    ]);
    fs.writeFileSync(file, png);
  }
}

/* ---------- tiny drawing helpers ---------- */

function bar(c, x, y, w, h, colorHex) {
  c.fill(x, y, w, h, hexColor(colorHex));
}

function textLines(c, x, y, lines, colorHex) {
  let ty = y;
  for (const len of lines) {
    bar(c, x, ty, len, 4, colorHex);
    ty += 9;
  }
}

function card(c, x, y, w, h, surfaceHex, borderHex, lines) {
  c.fill(x, y, w, h, hexColor(surfaceHex));
  c.outline(x, y, w, h, borderHex, 1);
  textLines(c, x + 10, y + 8, lines, '#64748b');
}

/* ---------- per-template previews ---------- */

function previewMinimal() {
  const c = new Canvas(W, H, '#f8fafc');
  bar(c, 90, 44, 170, 26, '#0f172a'); // name
  bar(c, 90, 84, 260, 9, '#64748b'); // role
  for (let i = 0; i < 4; i++) {
    card(c, 90, 124 + i * 42, 300, 34, '#ffffff', '#e2e8f0', [120, 190]);
  }
  return c;
}

function previewDarkJapanese() {
  const c = new Canvas(W, H, '#111827');
  bar(c, 96, 40, 4, 220, '#f87171'); // vertical accent frame
  bar(c, 126, 48, 150, 24, '#e5e7eb'); // name
  bar(c, 126, 84, 100, 7, '#9ca3af'); // subtitle
  card(c, 126, 112, 190, 28, '#1f2937', '#374151', [110, 150]);
  card(c, 126, 156, 190, 28, '#1f2937', '#374151', [110, 150]);
  card(c, 126, 200, 190, 28, '#1f2937', '#374151', [110, 150]);
  c.outline(396, 44, 36, 42, '#f87171', 2); // hanko seal
  return c;
}

function previewKhakis() {
  const c = new Canvas(W, H, '#f4efe6');
  bar(c, 90, 28, 104, 16, '#a34828'); // retro badge
  c.fill(96, 66, 302, 42, '#2b261f'); // hard shadow
  card(c, 90, 60, 302, 42, '#ebdccb', '#2b261f', [150, 220]); // hero card
  for (let i = 0; i < 3; i++) {
    c.fill(96, 126 + i * 40, 302, 34, '#2b261f');
    card(c, 90, 122 + i * 40, 302, 34, '#ebdccb', '#2b261f', [140, 200]);
  }
  return c;
}

function previewBento() {
  const c = new Canvas(W, H, '#f8fafc');
  // full-width hero tile
  card(c, 60, 40, 360, 46, '#ffffff', '#e2e8f0', [150, 240]);
  // three two-column tiles
  for (let i = 0; i < 3; i++) {
    card(c, 60 + i * 124, 114, 112, 92, '#ffffff', '#e2e8f0', [60, 80, 70]);
  }
  // two three-column tiles
  card(c, 60, 234, 172, 50, '#ffffff', '#e2e8f0', [120, 140]);
  card(c, 244, 234, 172, 50, '#ffffff', '#e2e8f0', [120, 140]);
  return c;
}

function previewTerminal() {
  const c = new Canvas(W, H, '#0f172a');
  bar(c, 60, 40, 360, 26, '#1e293b'); // titlebar
  bar(c, 70, 46, 10, 10, '#ef4444'); // close dot
  bar(c, 88, 46, 10, 10, '#f59e0b'); // minimize dot
  bar(c, 106, 46, 10, 10, '#22c55e'); // maximize dot
  const y0 = 86;
  for (let i = 0; i < 4; i++) {
    const y = y0 + i * 46;
    bar(c, 66, y, 22, 8, '#22c55e'); // prompt `$`
    bar(c, 94, y, 120, 8, '#94a3b8'); // command text
    c.fill(66, y + 18, 350, 18, '#1e293b'); // output block
    bar(c, 76, y + 22, 120, 4, '#64748b');
    bar(c, 76, y + 30, 180, 4, '#475569');
  }
  bar(c, 66, y0 + 192, 22, 8, '#22c55e');
  bar(c, 94, y0 + 192, 10, 8, '#a3e635'); // blinking cursor
  return c;
}

function previewEditorial() {
  const c = new Canvas(W, H, '#fdfbf7');
  bar(c, 190, 28, 100, 6, '#6b7280'); // dateline
  bar(c, 120, 48, 170, 20, '#1f2937'); // masthead name
  bar(c, 150, 76, 130, 6, '#6b7280'); // deck
  bar(c, 60, 94, 360, 2, '#1f2937'); // double rule
  bar(c, 60, 100, 360, 1, '#9ca3af');
  // two text columns (About)
  textLines(c, 60, 116, [70, 90, 80, 100, 60, 140], '#6b7280');
  textLines(c, 250, 116, [80, 70, 90, 60, 100, 70], '#6b7280');
  // two experience cards
  card(c, 60, 206, 172, 44, '#fdfbf7', '#1f2937', [120, 140]);
  card(c, 244, 206, 172, 44, '#fdfbf7', '#1f2937', [110, 140]);
  bar(c, 60, 272, 360, 1, '#1f2937'); // footer rule
  return c;
}

/* ---------- write all previews ---------- */

const PREVIEWS = {
  'minimal': previewMinimal,
  'dark-japanese': previewDarkJapanese,
  'khakis-90s': previewKhakis,
  'bento-grid': previewBento,
  'terminal': previewTerminal,
  'editorial': previewEditorial,
};

fs.mkdirSync(OUT_DIR, { recursive: true });

let wrote = 0;
for (const [key, fn] of Object.entries(PREVIEWS)) {
  const file = path.join(OUT_DIR, `${key}.png`);
  fn().save(file);
  const bytes = fs.statSync(file).size;
  console.log(`wrote ${file} (${bytes} bytes)`);
  wrote++;
}
console.log(`Done — ${wrote} preview(s) in ${OUT_DIR}`);