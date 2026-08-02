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
  for (const f of files) {
    const buf = await get(f.url);
    const dest = path.join(root, f.dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    console.log("wrote", f.dest, buf.length);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
