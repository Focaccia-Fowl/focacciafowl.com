// Verifies that every internal href and src in dist/ points at a file that was actually built.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
if (!existsSync(DIST)) { console.error("dist/ not found. Run the build first."); process.exit(1); }

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
  d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith(".html") ? [join(dir, d.name)] : []);

const resolves = (path) => {
  const clean = decodeURIComponent(path.split("#")[0].split("?")[0]);
  if (clean === "" || clean === "/") return existsSync(join(DIST, "index.html"));
  const target = join(DIST, clean);
  if (existsSync(target) && statSync(target).isFile()) return true;
  return existsSync(join(target, "index.html")) || existsSync(`${target.replace(/\/$/, "")}.html`);
};

const misses = [];
let checked = 0;
for (const file of walk(DIST)) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (url.startsWith("//")) continue;
    checked += 1;
    if (!resolves(url)) misses.push(`${relative(DIST, file)} -> ${url}`);
  }
}
if (misses.length) {
  console.error(`Broken internal links (${misses.length}):`);
  for (const miss of [...new Set(misses)]) console.error(`  ${miss}`);
  process.exit(1);
}
console.log(`check-links: ${checked} internal links, all resolve.`);
