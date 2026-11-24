// The Houseplant Out-of-Office
// make.fun competition: u-eager-stork-81-9647-the-houseplant-out-of-office-7c586047
//
// The program writes one text to /output/entry.txt: an out-of-office
// auto-reply as if a houseplant sent it. The gate requires UTF-8 text of
// 1 to 120 characters, not only white space. The line is a single line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The auto-reply. Written for the judge's brief: it reads as an out-of-office
// message from a plant, the plant's own life drives the joke, and the last
// words reframe the neglect as the plant's choice.
const REPLY =
  "Out of office. The fern has not been watered since March and has stopped waiting for you. Do not water me.";

// The gate, checked here before writing so a future edit to the line can
// never silently ship an invalid entry: UTF-8 text of 1 to 120 characters,
// a single line, not only white space.
if (REPLY.length < 1 || REPLY.length > 120) {
  throw new Error(`reply is ${REPLY.length} characters, must be 1 to 120`);
}
if (REPLY.includes("\n") || REPLY.includes("\r")) {
  throw new Error("reply must be a single line");
}
if (REPLY.trim().length === 0) {
  throw new Error("reply must not be only white space");
}
// No control characters: the entry is one clean line of printable text.
if (/[\x00-\x1f\x7f]/.test(REPLY)) {
  throw new Error("reply must not contain control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const dst = join(outDir, "entry.txt");
writeFileSync(dst, REPLY, "utf8");
// Read back and confirm the file on disk is exactly the line.
if (readFileSync(dst, "utf8") !== REPLY) {
  throw new Error("entry.txt on disk does not match the reply");
}
console.log(`wrote entry.txt (${REPLY.length} characters)`);
