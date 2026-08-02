#!/usr/bin/env node
/**
 * Assembles package-lock.json and content/gatsby/ch*.txt from scripts/import-parts/.
 * Safe to re-run. Used by npm run assemble:import / Netlify build.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const partsDir = path.join(__dirname, "import-parts");

function assemble(prefix, destRel, joiner = "") {
  const files = fs
    .readdirSync(partsDir)
    .filter((f) => f.startsWith(prefix))
    .sort();
  if (!files.length) {
    console.warn("no parts for", prefix);
    return false;
  }
  const body = files.map((f) => fs.readFileSync(path.join(partsDir, f), "utf8")).join(joiner);
  const dest = path.join(root, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body);
  console.log("wrote", destRel, body.length, "from", files.length, "parts");
  return true;
}

assemble("package-lock.part", "package-lock.json");
for (let i = 1; i <= 9; i++) {
  assemble(`ch${i}.txt.part`, `src/apps/novelcrafter/content/gatsby/ch${i}.txt`);
}
