import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { effects } from 'pixelfx/fx/index';
import { actSpan, clearFrame, composite, createFrame } from 'pixelfx';
import { createPreview, getPreviewLayout } from '../src/preview.ts';

const W = 240, H = 160;
const directory = new URL('../public/thumbnails/', import.meta.url);
mkdirSync(directory, { recursive: true });

function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) {
    c ^= byte;
    for (let bit = 0; bit < 8; bit++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}
function png(width, height, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4);
  header[8] = 8; header[9] = 6;
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) rows.set(pixels.subarray(y * width * 4, (y + 1) * width * 4), y * (width * 4 + 1) + 1);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
function thumbnail(pixels, width, height) {
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    if (pixels[i + 3] > 16 && Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) * pixels[i + 3] / 255 > 10) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  }
  if (x0 > x1) { x0 = 0; y0 = 0; x1 = width - 1; y1 = height - 1; }
  x0 = Math.max(0, x0 - 10); y0 = Math.max(0, y0 - 10);
  x1 = Math.min(width - 1, x1 + 10); y1 = Math.min(height - 1, y1 + 10);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  const scale = Math.min((W - 24) / cw, (H - 20) / ch);
  const dw = Math.max(1, Math.round(cw * scale)), dh = Math.max(1, Math.round(ch * scale));
  const dx = Math.floor((W - dw) / 2), dy = Math.floor((H - dh) / 2);
  const out = new Uint8Array(W * H * 4);
  for (let y = 0; y < dh; y++) for (let x = 0; x < dw; x++) {
    const sx = x0 + Math.min(cw - 1, Math.floor(x / scale));
    const sy = y0 + Math.min(ch - 1, Math.floor(y / scale));
    const source = (sy * width + sx) * 4;
    out.set(pixels.subarray(source, source + 4), ((dy + y) * W + dx + x) * 4);
  }
  return out;
}

let count = 0;
for (const [id, module] of Object.entries(effects)) {
  const root = id.split('/')[0];
  const effect = { id, module, category: root === 'scifi' ? 'SCI-FI' : root.toUpperCase() };
  const layout = getPreviewLayout(effect);
  const frame = createFrame(layout.width, layout.height);
  const scene = createPreview(effect, layout);
  const span = effect.category === 'MOVES' ? actSpan(module) : { from: 0, to: module.meta.duration };
  const raw = new Uint8ClampedArray(frame.w * frame.h * 4);
  let tick = 0, bestScore = -1, best;
  try {
    for (const fraction of [0.12, 0.28, 0.44, 0.65]) {
      const target = Math.ceil((span.to - span.from) * fraction * 120);
      while (tick < target) { scene.update(1 / 120); tick++; }
      clearFrame(frame); scene.draw(frame); composite(frame, raw, null);
      let score = 0;
      for (let i = 0; i < raw.length; i += 4) score += (Math.max(raw[i], raw[i + 1], raw[i + 2]) + 1) * raw[i + 3] / 255;
      if (score > bestScore) {
        bestScore = score;
        if (effect.category === 'TRANSITIONS') composite(frame, raw, scene.background);
        best = raw.slice();
      }
    }
  } finally { scene.stop(); }
  if (!best) throw new Error(`No preview for ${id}`);
  writeFileSync(new URL(id.replaceAll('/', '--') + '.png', directory), png(W, H, thumbnail(best, frame.w, frame.h)));
  count++;
}
console.log(`Generated ${count} actual pixelfx thumbnails (${W}×${H}, static RGBA PNG).`);
