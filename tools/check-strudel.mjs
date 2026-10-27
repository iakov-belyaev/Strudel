// Headless check for a Strudel pattern file: evaluates it with the real
// @strudel/core + @strudel/mini + transpiler (the same path the REPL uses) and
// reports what the pattern actually produces, cycle by cycle.
//
//   node --import ./tools/register-loader.mjs tools/check-strudel.mjs beat2.strudel.js [cycles]
//
// Dependencies live in tools/.deps so the project's own package.json stays clean.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const deps = path.join(here, '.deps', 'node_modules', '@strudel');
const load = (p) => import(path.join(deps, p));

const [core, mini, tonal, tr] = await Promise.all([
  load('core/dist/index.mjs'),
  load('mini/dist/index.mjs'),
  load('tonal/dist/index.mjs'),
  load('transpiler/dist/index.mjs'),
]);

await core.evalScope(core, mini, tonal);
mini.miniAllStrings();
globalThis.setcpm = () => true;   // tempo only matters to a running scheduler
globalThis.setCps = () => true;

const file = process.argv[2] ?? 'beat2.strudel.js';
const cycles = Number(process.argv[3] ?? 64);
const code = fs.readFileSync(file, 'utf8');

let pat;
try {
  const out = await core.evaluate(code, tr.transpiler);
  pat = out.pattern;
  if (pat && typeof pat.then === 'function') pat = await pat;
} catch (e) {
  console.error('EVAL ERROR:', e.message);
  process.exit(1);
}
if (!pat?.queryArc) {
  console.error('EVAL ERROR: the file did not return a pattern (end it with a bare expression)');
  process.exit(1);
}

const haps = pat.queryArc(0, cycles).filter((h) => (h.hasOnset ? h.hasOnset() : true));
if (!haps.length) {
  console.error('EVAL ERROR: pattern produced no onsets');
  process.exit(1);
}

const perCycle = new Map();
for (const h of haps) {
  const c = Math.floor(h.whole.begin.valueOf());
  perCycle.set(c, (perCycle.get(c) ?? 0) + 1);
}
const counts = [...perCycle.entries()].sort((a, b) => a[0] - b[0]);

const sounds = new Map();
const notes = new Map();
const bad = [];
for (const h of haps) {
  const v = h.value ?? {};
  const snd = v.s ?? v.sound ?? (v.note !== undefined ? 'note-only' : '?');
  sounds.set(String(snd), (sounds.get(String(snd)) ?? 0) + 1);
  if (v.note !== undefined) notes.set(String(v.note), (notes.get(String(v.note)) ?? 0) + 1);
  for (const [k, x] of Object.entries(v)) {
    if (typeof x === 'number' && !Number.isFinite(x)) bad.push(`${k}=${x} @${h.whole}`);
  }
}

const vals = counts.map(([, n]) => n);
console.log(`file: ${file}`);
console.log(`cycles ${cycles} · onsets ${haps.length} · ${(haps.length / cycles).toFixed(1)}/cycle`);
console.log(`per cycle: min ${Math.min(...vals)} max ${Math.max(...vals)}`);
console.log('counts:', counts.map(([c, n]) => `${c}:${n}`).join(' '));
console.log('sounds:', [...sounds.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}(${n})`).join(' '));
if (notes.size) {
  console.log('notes:', [...notes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([k, n]) => `${k}(${n})`).join(' '));
}
if (bad.length) {
  console.log('NON-FINITE:', bad.slice(0, 5).join(', '));
  process.exitCode = 1;
}
