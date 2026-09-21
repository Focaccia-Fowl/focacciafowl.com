# focacciafowl.com

The shop window for [Focaccia Fowl](https://github.com/Focaccia-Fowl). Where half baked fowl projects roam.

A static Astro site on GitHub Pages. No backend, no tracking. Baked by LoafOfBread and DigitalEagle.

## Run it

```bash
npm install
npm run dev        # local server; draft bench entries are visible here
npm run verify     # unit tests, production build, internal link check
```

Pushing to `main` runs `npm run verify` in GitHub Actions and deploys `dist/` to Pages.

## Add a menu item

Create `src/content/menu/<slug>.md`. The slug becomes the URL.

| Field | Meaning |
| --- | --- |
| `title` | Name on the card |
| `tagline` | One or two sentences, shown in the chalk hand |
| `order` | Whole number; position in the case |
| `status` | `fresh` (in daily use), `proving` (still rising), or `day-old` (did its job) |
| `ingredients` | List of parts, tools, and stack |
| `bakers` | `loaf`, `eagle`, or `both` |
| `cover`, `coverAlt` | Optional photo beside the file, and its description |

The body needs two headings: `## Method` and `## Baker's notes`.

House rules for public copy: handles only, no real names, no network addresses or hostnames,
no chat group names, and no links to the private repos.

## Add a bench entry

Create a folder so the photos can sit beside the words:

```
src/content/bench/first-reflow/
  index.md
  board-bare.jpg
  board-lit.jpg
```

```md
---
title: First reflow
date: 2026-10-01
summary: One line for the chalkboard and the feed.
bakers: both
tags: ["PCB", "soldering"]
cover: ./board-lit.jpg
coverAlt: A small green board with one LED lit
draft: false
---

Words, and photos like ![the bare board](./board-bare.jpg).
```

Phone photos are fine. Astro resizes and compresses them at build time. Short entries count.
`draft: true` keeps an entry out of the production site and the feed while still showing it in `npm run dev`.
`_sample-first-batch.md` is a permanent draft that exists to check the layout.

A schema mistake fails the build and names the file and the field.

## Where things live

- `src/components/art/` holds the drawn marks: loaf, eagle, emblem, cloud, baker stamp. Each art slot has a
  fixed size, so generated or commissioned art can replace a component without layout changes.
- `src/components/Sky.astro` is the sky, the clouds, the stars, and the eagle that glides past now and then.
- `src/components/Storefront.astro` is the sign, awning, window, and pavement.
- `src/styles/tokens.css` holds the palette and the day, dusk, and night variants.
- `src/lib/` holds the tested helpers. The hour boundaries in `sky.ts` are mirrored by the inline script in
  `src/layouts/Base.astro`; change both together.

The shop follows the visitor's clock. Add `?phase=day`, `?phase=dusk`, or `?phase=night` to any URL to force one.
All motion turns off for visitors who prefer reduced motion.

## Design docs

`docs/superpowers/specs/` has the design and `docs/superpowers/plans/` has the build plan.
