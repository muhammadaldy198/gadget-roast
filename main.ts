// One-Line Roast: The Gadget You Use Every Day
// Entry program: writes exactly one roast line to /output/entry.txt.
// Gate (RULES.txt): UTF-8 text of 1 to 200 characters, not whitespace-only.
// Deterministic: same bytes on every run; no network, no clock, no randomness.

import { mkdirSync, writeFileSync, readFileSync, chmodSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROAST =
  "My mouse scrolls in two speeds: nothing, and three pages at once. Reading is either braille or fast-forward.";

const GATE = { minChars: 1, maxChars: 200 };
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function countChars(text: string): number {
  return [...text].length;
}

function isCleanLine(text: string): boolean {
  const n = countChars(text);
  if (n < GATE.minChars || n > GATE.maxChars) return false;
  if (text.trim().length === 0) return false;
  if (text.includes("\n") || text.includes("\r")) return false;
  // Reject every control character, not just line breaks: a stray tab, NUL,
  // or escape byte would still pass the checks above but break the gate's
  // "one clean line" shape.
  if (/[\u0000-\u001f\u007f]/.test(text)) return false;
  return true;
}

function writeEntry(text: string): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, text, "utf8");
  chmodSync(OUT_FILE, 0o644);
}

function verifyWritten(path: string, expected: string): void {
  const back = readFileSync(path, "utf8");
  if (back !== expected) {
    throw new Error("round-trip mismatch: written bytes differ from the roast");
  }
}

function main(): void {
  if (!isCleanLine(ROAST)) {
    throw new Error("roast fails the gate: check length and single-line shape");
  }
  writeEntry(ROAST);
  verifyWritten(OUT_FILE, ROAST);
  const bytes = Buffer.byteLength(ROAST, "utf8");
  console.log(`wrote ${OUT_FILE}: ${countChars(ROAST)} chars, ${bytes} bytes`);
}

main();
