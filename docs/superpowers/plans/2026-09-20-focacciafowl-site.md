# focacciafowl.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch a static bakery-themed site for the Focaccia Fowl org at focacciafowl.com.

**Architecture:** Astro 7 static build with two markdown content collections (`menu`, `bench`). Pure logic (sky phase, bench sorting and tags) lives in `src/lib/` with node:test unit tests. Art is inline SVG in small Astro components. Deployed by GitHub Actions to Pages; DNS set through Fishbowl's API.

**Tech Stack:** Astro 7.3, TypeScript, zod via `astro/zod`, `astro:assets`, node:test (Node 26 runs `.ts` tests natively), GitHub Pages, Fishbowl API on `192.168.2.2:8081`.

**Spec:** `docs/superpowers/specs/2026-09-20-focacciafowl-site-design.md`

## Global Constraints

- Static only. No backend, no analytics.
- Never link to or name the private repos' URLs. Never show code from them.
- Handles only: `loafofbread`, `DigitalEagle`. No real names, no personal stories.
- Public copy omits network addresses, hostnames, chat group names, names of other private repos.
- Original art only. No copied characters, artwork, names, or logos from any film or studio.
- Palette: cream `#fbf3e1`, brick `#b5452f`, navy `#1f2f4a`, butter `#f2c46d`, sky `#9cc9e3`, crust `#8a5a2b`.
- Fonts: Fraunces (headings), Caveat (chalk), Nunito (body), Google Fonts with system fallbacks.
- All animation disabled under `prefers-reduced-motion: reduce`. Day/night state still applies.
- Body text meets WCAG AA contrast on cream and on navy.
- Commit messages carry no attribution lines. Commit with `-c user.email=digitaleagle@gmail.com`.
- Never begin a Bash command with a variable assignment or `export` (local shell quirk). Headless screenshots use snap Firefox and must write under `$HOME`, one page per call.

A note on visual tasks: steps that produce SVG art or CSS give exact structure, props, tokens, and
acceptance checks instead of pasting every path. The acceptance check for art is a screenshot review.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `astro.config.mjs`, `tsconfig.json`, `package.json`, `.gitignore` | Project config |
| `.github/workflows/pages.yml`, `public/CNAME`, `public/favicon.svg` | Deploy and domain |
| `src/content.config.ts` | `menu` and `bench` collection schemas |
| `src/content/menu/*.md` | Three recipe cards |
| `src/content/bench/_sample-first-batch.md` | Draft fixture, visible only in dev |
| `src/lib/sky.ts` + `sky.test.ts` | `phaseForHour(hour): "day" \| "dusk" \| "night"` |
| `src/lib/bench.ts` + `bench.test.ts` | `visibleEntries`, `sortNewestFirst`, `allTags`, `tagSlug` |
| `src/styles/tokens.css` | Palette, type, spacing custom properties, day/dusk/night variants |
| `src/layouts/Base.astro` | Head, fonts, header sign, footer, paper grain, slot |
| `src/components/art/{Loaf,Eagle,Emblem,Cloud,BakerStamp}.astro` | Inline SVG marks |
| `src/components/Sky.astro` | Sky, clouds, stars, gliding eagle, clock script |
| `src/components/Storefront.astro` | Sign, awning, windows wrapper with named slots |
| `src/components/{MenuItem,Chalkboard,Plaque,RecipeCard,BenchEntryCard}.astro` | Content blocks |
| `src/pages/index.astro`, `menu/index.astro`, `menu/[slug].astro` | Shop and menu |
| `src/pages/bench/index.astro`, `bench/[slug].astro`, `bench/tags/[tag].astro`, `rss.xml.ts` | Journal |
| `src/pages/404.astro` | Sold out |
| `scripts/check-links.mjs` | Verifies every internal href in `dist/` resolves |
| `README.md` | How to run, add a menu item, add a bench entry |

---

### Task 1: Scaffold, tokens, base layout, deploy config

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `public/CNAME`, `public/favicon.svg`, `.github/workflows/pages.yml`, `src/styles/tokens.css`, `src/layouts/Base.astro`, `src/pages/index.astro` (temporary one-line page).

**Interfaces:** Produces `Base.astro` props `{ title?: string; description?: string; sky?: boolean }` and CSS custom properties `--cream --brick --navy --butter --sky --crust --ink --paper --font-sign --font-chalk --font-body`, plus `html[data-phase="day|dusk|night"]` overrides for `--sky-top --sky-bottom --window-glow`.

- [ ] **Step 1:** `package.json` with scripts `dev`, `build`, `preview`, `test` (`node --test "src/lib/*.test.ts"`), `check-links` (`node scripts/check-links.mjs`), `verify` (`npm test && npm run build && npm run check-links`). Dependency: `astro@^7.3.3`. Run `npm install`.
- [ ] **Step 2:** `astro.config.mjs` with `site: 'https://focacciafowl.com'`, `output: 'static'`. `tsconfig.json` extends `astro/tsconfigs/strict`. `.gitignore`: `node_modules/ dist/ .astro/ .DS_Store`.
- [ ] **Step 3:** `public/CNAME` containing `focacciafowl.com`. Workflow identical in shape to the one proven on kullhem.io: checkout, setup-node 22, `npm ci`, `npm run verify`, upload-pages-artifact `./dist`, deploy-pages. Permissions `contents: read, pages: write, id-token: write`.
- [ ] **Step 4:** `tokens.css` with the palette, fonts, and the three phase blocks. Day: sky `#9cc9e3` to `#e8f3f7`. Dusk: `#f0a36b` to `#f7d9b0`. Night: `#16223a` to `#2b3d63`, `--window-glow: #f2c46d`.
- [ ] **Step 5:** `Base.astro`: meta, OpenGraph, canonical, Google Fonts link, inline phase script in `<head>` (sets `data-phase` before paint, wrapped in try/catch, default `day`), header with small emblem and nav (`shop`, `menu`, `the bench`), footer with the handles and an RSS link, SVG turbulence grain overlay at 6% opacity.
- [ ] **Step 6:** Run `npm run build`. Expected: `1 page(s) built`. Commit: `Scaffold Astro site with tokens, base layout, and Pages deploy`.

### Task 2: Sky and bench logic with unit tests

**Files:** Create `src/lib/sky.ts`, `src/lib/sky.test.ts`, `src/lib/bench.ts`, `src/lib/bench.test.ts`.

**Interfaces:** Produces
`phaseForHour(hour: number): "day" | "dusk" | "night"`;
`type BenchLike = { id: string; data: { date: Date; draft: boolean; tags: string[] } }`;
`visibleEntries<T extends BenchLike>(entries: T[], includeDrafts: boolean): T[]`;
`sortNewestFirst<T extends BenchLike>(entries: T[]): T[]`;
`tagSlug(tag: string): string`;
`allTags(entries: BenchLike[]): { tag: string; slug: string; count: number }[]`.

- [ ] **Step 1: Write failing tests.**

```ts
// src/lib/sky.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { phaseForHour } from "./sky.ts";

test("day runs from 06:00 up to 18:00", () => {
  assert.equal(phaseForHour(6), "day");
  assert.equal(phaseForHour(12), "day");
  assert.equal(phaseForHour(17), "day");
});
test("dusk runs from 18:00 up to 20:00", () => {
  assert.equal(phaseForHour(18), "dusk");
  assert.equal(phaseForHour(19), "dusk");
});
test("night covers 20:00 through 05:59", () => {
  assert.equal(phaseForHour(20), "night");
  assert.equal(phaseForHour(0), "night");
  assert.equal(phaseForHour(5), "night");
});
test("out of range or non-finite hours fall back to day", () => {
  assert.equal(phaseForHour(-1), "day");
  assert.equal(phaseForHour(24), "day");
  assert.equal(phaseForHour(NaN), "day");
});
```

```ts
// src/lib/bench.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { visibleEntries, sortNewestFirst, tagSlug, allTags } from "./bench.ts";

const e = (id: string, date: string, draft = false, tags: string[] = []) =>
  ({ id, data: { date: new Date(date), draft, tags } });

test("drafts are hidden unless includeDrafts is true", () => {
  const list = [e("a", "2026-01-01"), e("b", "2026-01-02", true)];
  assert.deepEqual(visibleEntries(list, false).map((x) => x.id), ["a"]);
  assert.deepEqual(visibleEntries(list, true).map((x) => x.id), ["a", "b"]);
});
test("sortNewestFirst orders by date descending without mutating input", () => {
  const list = [e("old", "2026-01-01"), e("new", "2026-03-01"), e("mid", "2026-02-01")];
  assert.deepEqual(sortNewestFirst(list).map((x) => x.id), ["new", "mid", "old"]);
  assert.equal(list[0].id, "old");
});
test("tagSlug lowercases, trims, and hyphenates", () => {
  assert.equal(tagSlug("  3D Printing "), "3d-printing");
  assert.equal(tagSlug("PCB"), "pcb");
  assert.equal(tagSlug("hot  air / reflow"), "hot-air-reflow");
});
test("allTags counts by slug, keeps first-seen label, sorts by count then name", () => {
  const list = [e("a", "2026-01-01", false, ["PCB", "soldering"]), e("b", "2026-01-02", false, ["pcb"]), e("c", "2026-01-03", false, ["science"])];
  assert.deepEqual(allTags(list), [
    { tag: "PCB", slug: "pcb", count: 2 },
    { tag: "science", slug: "science", count: 1 },
    { tag: "soldering", slug: "soldering", count: 1 },
  ]);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL, cannot find module `./sky.ts`.
- [ ] **Step 3: Implement.**

```ts
// src/lib/sky.ts
export type Phase = "day" | "dusk" | "night";
export function phaseForHour(hour: number): Phase {
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return "day";
  if (hour >= 6 && hour < 18) return "day";
  if (hour >= 18 && hour < 20) return "dusk";
  return "night";
}
```

```ts
// src/lib/bench.ts
export type BenchLike = { id: string; data: { date: Date; draft: boolean; tags: string[] } };
export function visibleEntries<T extends BenchLike>(entries: T[], includeDrafts: boolean): T[] {
  return includeDrafts ? entries : entries.filter((x) => !x.data.draft);
}
export function sortNewestFirst<T extends BenchLike>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
export function allTags(entries: BenchLike[]): { tag: string; slug: string; count: number }[] {
  const seen = new Map<string, { tag: string; slug: string; count: number }>();
  for (const entry of entries) for (const raw of entry.data.tags) {
    const slug = tagSlug(raw);
    if (!slug) continue;
    const hit = seen.get(slug);
    if (hit) hit.count += 1; else seen.set(slug, { tag: raw.trim(), slug, count: 1 });
  }
  return [...seen.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}
```

- [ ] **Step 4:** Run `npm test`. Expected: all pass. The inline head script in `Base.astro` must use the same hour boundaries as `phaseForHour`; add a comment in both pointing at the other.
- [ ] **Step 5:** Commit: `Add sky phase and bench helpers with tests`.

### Task 3: Content collections and launch content

**Files:** Create `src/content.config.ts`, `src/content/menu/wall-kiosk.md`, `src/content/menu/tgcrab.md`, `src/content/menu/llama-zoo.md`, `src/content/bench/_sample-first-batch.md`.

**Interfaces:** Produces collections `menu` and `bench`.

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const bakers = z.enum(["loaf", "eagle", "both"]);

const menu = defineCollection({
  loader: glob({ base: "./src/content/menu", pattern: "**/[^_]*.md" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    tagline: z.string(),
    order: z.number().int(),
    status: z.enum(["fresh", "proving", "day-old"]),
    ingredients: z.array(z.string()).min(1),
    bakers,
    cover: image().optional(),
    coverAlt: z.string().optional(),
  }),
});

const bench = defineCollection({
  // underscore-prefixed files ARE loaded here so the dev-only sample works; drafts are filtered in code
  loader: glob({ base: "./src/content/bench", pattern: "**/*.md" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    bakers,
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { menu, bench };
```

- [ ] **Step 1:** Write the config above.
- [ ] **Step 2:** Write the three menu entries. Each body has `## Method` and `## Baker's notes`. Status: kiosk `fresh`, tgcrab `fresh`, llama zoo `proving`. Bakers: `both` for all three. Apply the Global Constraints: no addresses, hostnames, group names, or other repo names. Keep the authors' lines: "The 3090 is the lead singer, the 3060s are backup vocals", "the polite little goblin that manages our local AI zoo", "Chrome 83, from mid 2020, and it cannot be updated".
- [ ] **Step 3:** Write the sample bench entry with `draft: true`, tags `["soldering", "PCB"]`, bakers `both`.
- [ ] **Step 4:** Run `npm run build`. Expected: build passes. Then temporarily set `order: "x"` in one entry, run the build, confirm it FAILS naming the file and field, and revert.
- [ ] **Step 5:** Commit: `Add menu and bench collections with launch content`.

### Task 4: Art components and the sky

**Files:** Create `src/components/art/Loaf.astro`, `Eagle.astro`, `Emblem.astro`, `Cloud.astro`, `BakerStamp.astro`, `src/components/Sky.astro`.

**Interfaces:** Each art component takes `{ size?: number; class?: string; title?: string }`, renders `<svg viewBox>` with `role="img"` and `<title>` when `title` is set, else `aria-hidden="true"`. `BakerStamp` takes `{ bakers: "loaf" | "eagle" | "both"; size?: number }`. `Sky` takes no props and fills its positioned parent.

- [ ] **Step 1:** Loaf: a scored focaccia slab, rounded rectangle body in crust tones, dimples, rosemary flecks, salt dots, three steam wisps (`.steam` paths with a rising, fading keyframe). Eagle: side-profile perched bird built from rounded shapes, cream head, navy-brown body, butter beak, friendly eye. Also an `Eagle` variant `pose="glide"`: spread-wing silhouette for the sky. Emblem: round badge, the eagle perched on the loaf, text on a circular path "FOCACCIA FOWL · HALF BAKED PROJECTS".
- [ ] **Step 2:** Cloud: three overlapping rounded lobes with a soft lower shadow, fill driven by `--cloud` so night tints it.
- [ ] **Step 3:** Sky: gradient from `--sky-top` to `--sky-bottom`; five clouds at different sizes drifting on 90 to 160 second linear loops with negative delays; a star field `<g class="stars">` visible only when `data-phase="night"`; a sun/moon disc; a gliding eagle that crosses once every 40 to 90 seconds, scheduled by a small script that skips entirely under reduced motion.
- [ ] **Step 4:** Reduced motion: one `@media (prefers-reduced-motion: reduce)` block in `Base.astro` sets `animation: none !important; transition: none !important`.
- [ ] **Step 5:** Put all five marks and the Sky on the temporary index page, build, serve `dist/`, screenshot at 1280px in each phase by appending `?phase=day|dusk|night` (the head script honors this override for testing). Review the screenshots; fix anything that reads as crude or off-palette.
- [ ] **Step 6:** Commit: `Add loaf, eagle, emblem, cloud art and the living sky`.

### Task 5: The shop window (home page)

**Files:** Create `src/components/Storefront.astro`, `MenuItem.astro`, `Chalkboard.astro`, `Plaque.astro`; replace `src/pages/index.astro`.

**Interfaces:** `MenuItem` takes `{ entry: CollectionEntry<"menu"> }`. `Chalkboard` takes `{ entry?: CollectionEntry<"bench"> }` and renders the empty state when undefined. `Plaque` takes no props. `Storefront` exposes slots `case`, `board`, `plaque`.

- [ ] **Step 1:** Storefront: hand-lettered sign board "Focaccia Fowl" in Fraunces with a painted drop shadow, scalloped brick-and-cream striped awning (repeating SVG pattern), shop wall in cream with a navy base course, two windows whose fill uses `--window-glow` at night.
- [ ] **Step 2:** Display case: menu items sorted by `order`, each a paper tag card with title, tagline, status ribbon (`fresh` green-gold, `proving` butter, `day-old` muted), baker stamp, link to `/menu/<id>/`.
- [ ] **Step 3:** Chalkboard: navy-black slate, Caveat lettering, "fresh today" heading, latest visible bench entry title, date, summary, link. Empty state text exactly: `first batch is in the oven.` with a link to `/bench/`.
- [ ] **Step 4:** Plaque: brass gradient plate, text exactly: `Baked by loafofbread and DigitalEagle.` and `A loaf and an eagle, and everything they like to build together.`
- [ ] **Step 5:** Index page composes Base (with `sky`), Sky, Storefront. Intro line under the sign: `Where half baked fowl projects roam.`
- [ ] **Step 6:** Build, screenshot 1280px and 390px in day and night. Review and fix. Commit: `Build the shop window home page`.

### Task 6: Menu pages and recipe cards

**Files:** Create `src/components/RecipeCard.astro`, `src/pages/menu/index.astro`, `src/pages/menu/[slug].astro`.

**Interfaces:** `RecipeCard` takes `{ entry: CollectionEntry<"menu"> }` and a default slot for rendered body. `[slug].astro` uses `getStaticPaths` over `getCollection("menu")` with `params: { slug: entry.id }` and `render(entry)` from `astro:content`.

- [ ] **Step 1:** Recipe card: index-card paper with a red top rule and faint blue lines, title, tagline, status ribbon, "Ingredients" list from frontmatter with checkbox bullets, body below where `## Method` and `## Baker's notes` headings are styled as card sections, baker stamp bottom right, cover image via `<Image>` when present else the Emblem.
- [ ] **Step 2:** Menu index: all items by `order`, reusing `MenuItem`.
- [ ] **Step 3:** Build. Expected: three `/menu/<slug>/index.html` files. Screenshot one card at both widths; review and fix.
- [ ] **Step 4:** Commit: `Add menu index and recipe cards`.

### Task 7: The bench (journal), tags, RSS

**Files:** Create `src/components/BenchEntryCard.astro`, `src/pages/bench/index.astro`, `src/pages/bench/[slug].astro`, `src/pages/bench/tags/[tag].astro`, `src/pages/rss.xml.ts`.

**Interfaces:** Consumes `visibleEntries`, `sortNewestFirst`, `allTags`, `tagSlug` from `src/lib/bench.ts`. Drafts are included only when `import.meta.env.DEV` is true. Entry slug is `entry.id` with any leading underscore stripped.

- [ ] **Step 1:** Index: heading "The bench", one-line intro, tag chips from `allTags`, entry cards newest first. Empty state exactly: `first batch is in the oven.`
- [ ] **Step 2:** Entry page: title, date (formatted with `timeZone: "UTC"`), baker stamp, tags linking to tag pages, cover, rendered body with images constrained to the column.
- [ ] **Step 3:** Tag page: `getStaticPaths` from `allTags(visible)`; zero visible entries yields zero paths, which must not fail the build.
- [ ] **Step 4:** RSS: hand-built XML, escaped, from visible non-draft entries; valid with zero items.
- [ ] **Step 5:** Run `npm run build` (production: no drafts). Expected: `/bench/index.html` shows the empty state, no `/bench/<slug>/` pages, `rss.xml` has zero items. Then run `npm run dev` and confirm the sample entry, its page, and its two tag pages render. Screenshot the dev entry page.
- [ ] **Step 6:** Commit: `Add the bench journal with tags and RSS`.

### Task 8: 404, link checker, README

**Files:** Create `src/pages/404.astro`, `scripts/check-links.mjs`, `README.md`.

- [ ] **Step 1:** 404: heading `Sold out.`, line `That shelf is empty. Try the menu.`, an empty tray drawing, links to shop, menu, bench.
- [ ] **Step 2:** Link checker: walk `dist/**/*.html`, collect `href` and `src` values starting with `/` (ignore `//`), strip `#` and `?`, resolve to `dist/<path>`, `dist/<path>/index.html`, or `dist/<path>.html`; print each miss with its source file; exit 1 on any miss.
- [ ] **Step 3:** Prove it fails: add `<a href="/nope/">` to the 404 page, run `npm run verify`, expect exit 1 naming `/nope/`; remove it, expect exit 0.
- [ ] **Step 4:** README: run, build, verify; how to add a menu item (frontmatter field table); how to add a bench entry (folder with photos beside the markdown, `draft: true`, tags); where art lives and how to swap a slot; the phase override query for testing.
- [ ] **Step 5:** Commit: `Add sold-out page, link checker, and README`.

### Task 9: Full verification pass

- [ ] **Step 1:** `npm run verify` exits 0.
- [ ] **Step 2:** Screenshots at 1280px and 390px: home day, home night, a recipe card, bench index, 404. Review every one for overflow, clipped art, and unreadable text.
- [ ] **Step 3:** Contrast: compute WCAG ratios with a short node script for navy on cream, cream on navy, brick on cream, chalk white on slate, muted text on cream. All body-text pairs must be at least 4.5.
- [ ] **Step 4:** Grep `dist/` for leaks: `192.168`, `ima.fish`, `github.com/Focaccia-Fowl/`, `kullhem-kiosk`, any real first name. Expected: no matches.
- [ ] **Step 5:** Commit any fixes: `Fix issues found in verification`.

### Task 10: Launch

- [ ] **Step 1:** `gh repo create Focaccia-Fowl/focacciafowl.com --public --source . --push --description "The shop window for Focaccia Fowl. Where half baked fowl projects roam."`
- [ ] **Step 2:** Enable Pages with the Actions source: `gh api -X POST repos/Focaccia-Fowl/focacciafowl.com/pages -f build_type=workflow`. Watch the first deploy to success.
- [ ] **Step 3:** Record the current focacciafowl.com records from `GET http://192.168.2.2:8081/records?zone=focacciafowl.com` into `docs/dns-before-2026-09-20.json` (commit it; it holds no secrets).
- [ ] **Step 4:** Read Fishbowl's README sections "API endpoints" and the entries/preview/apply flow to learn the exact request shapes. Add four apex `A` records (185.199.108.153, .109.153, .110.153, .111.153) and `www` `CNAME` to `focaccia-fowl.github.io`. Remove the Porkbun parking `ALIAS`/`CNAME` records for apex, `www`, and `*`. Leave `MX` and SPF `TXT` untouched. Use Fishbowl's preview before apply.
- [ ] **Step 5:** Verify with `dig +short A focacciafowl.com @curitiba.ns.porkbun.com` and `dig +short CNAME www.focacciafowl.com @curitiba.ns.porkbun.com`; confirm `MX` still answers.
- [ ] **Step 6:** Set the custom domain: `gh api -X PUT repos/Focaccia-Fowl/focacciafowl.com/pages -f cname=focacciafowl.com`. Poll `gh api repos/Focaccia-Fowl/focacciafowl.com/pages` until the certificate state is approved, then `-F https_enforced=true`.
- [ ] **Step 7:** `curl -sI https://focacciafowl.com` returns 200 from GitHub, and the page contains `Focaccia Fowl`. Set the org's `.github` profile only if Chad asks; out of scope here.
