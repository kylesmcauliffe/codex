#!/usr/bin/env node
/** Fetch Twilda import payloads from public staging on artometrics-web into repo paths. */
const https = require("https");
const fs = require("fs");
const path = require("path");

const BASE =
  "https://raw.githubusercontent.com/Artometrics/artometrics-web/main/_staging/codex-import";
const root = path.join(__dirname, "..");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`GET ${url} -> ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function main() {
  const files = [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
      url: `${BASE}/ch${i}.txt`,
      dest: `src/apps/novelcrafter/content/gatsby/ch${i}.txt`,
    })),
    { url: `${BASE}/gatsby-chapters.ts`, dest: "src/apps/novelcrafter/gatsby-chapters.ts" },
    { url: `${BASE}/package-lock.json`, dest: "package-lock.json" },
  ];
  const partCounts = { 1: 7, 2: 5, 3: 6, 4: 6, 5: 5, 6: 5, 7: 9, 8: 5, 9: 6 };
  for (const [ch, n] of Object.entries(partCounts)) {
    for (let i = 0; i < n; i++) {
      files.push({
        url: `${BASE}/parts/ch${ch}.p${i}.ts`,
        dest: `src/apps/novelcrafter/content/gatsby/ch${ch}.p${i}.ts`,
        optional: true,
      });
    }
  }
  for (const f of files) {
    try {
      const buf = await get(f.url);
      const dest = path.join(root, f.dest);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, buf);
      console.log("wrote", f.dest, buf.length);
    } catch (e) {
      if (f.optional) {
        console.warn("skip optional", f.dest, String(e.message || e));
      } else {
        throw e;
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
