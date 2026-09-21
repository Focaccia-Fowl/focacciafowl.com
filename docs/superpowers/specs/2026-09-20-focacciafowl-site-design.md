# focacciafowl.com — site design

Date: 2026-09-20. Approved in chat by Chad.

## Purpose

A public home for the Focaccia Fowl GitHub org ("Where half baked fowl projects roam"). It is a project
showcase in the way kullhem.io is, and also a dedication: the org is named for two online handles,
LoafOfBread (bread) and DigitalEagle (fowl), and for a shared love of electronics, soldering, PCBs,
technology, and science.

## Constraints

- Static. No backend. Free hosting on GitHub Pages with the custom domain focacciafowl.com.
- Own folder and git history at `~/Development/focacciafowl.com/`, pushed to a new public repo
  `Focaccia-Fowl/focacciafowl.com`. Nothing shared with the kullhem.io project.
- All three org repos are private and stay private. The site never links to them and never shows code.
- Handles only: LoafOfBread and DigitalEagle. No real names, no personal stories.
- Public copy omits network addresses, hostnames, chat group names, and names of other private repos.
- The theme evokes a cozy bakery in a painted seaside town. It leans on the qualities of that film style
  (soft painted skies, rounded clouds, warm window light, watercolor paper texture, calm motion) with
  original characters and scenes. No copied characters, artwork, names, or logos.

## Stack

- Astro (current major), static output, `site: https://focacciafowl.com`.
- Content collections with zod schemas:
  - `menu`: projects. Fields: title, tagline, order, status (`fresh` | `proving` | `day-old`),
    ingredients (string[]), bakers (`loaf` | `eagle` | `both`), optional cover image.
    Body sections: Method, Baker's notes.
  - `bench`: journal. Fields: title, date, summary, bakers, tags (string[]), optional cover, draft.
- `astro:assets` for photo resizing. Photos live beside their entry.
- Hand-rolled RSS endpoint for the bench (same approach as kullhem.io, no extra dependency).
- GitHub Actions workflow deploying `dist/` to Pages on push to `main`. `public/CNAME` holds the domain.

## Pages

| Route | What |
| --- | --- |
| `/` | The shop window: sky, sign, awning, display case (menu items), chalkboard (latest bench entry), brass plaque (the two bakers and the dedication line) |
| `/menu/` | All menu items |
| `/menu/[slug]/` | A recipe card: ingredients, method, baker's notes |
| `/bench/` | Journal index, newest first. Empty state: "first batch is in the oven." |
| `/bench/[slug]/` | One entry with its photos and a baker stamp |
| `/bench/tags/[tag]/` | Entries for one tag |
| `/rss.xml` | Bench feed |
| `/404` | "Sold out." |

## Look

- Palette: cream `#fbf3e1`, brick red `#b5452f`, deep navy `#1f2f4a`, butter yellow `#f2c46d`,
  sky blue `#9cc9e3`, crust brown `#8a5a2b`. Night variants for the sky and lit windows.
- Type: Fraunces (soft, slightly wonky serif) for the sign and headings; Caveat for chalkboard writing;
  Nunito for reading text. Google Fonts with system fallbacks.
- Art: inline SVG drawn for this site. A loaf, an eagle, the combined emblem, the storefront, clouds.
  Every art slot has a fixed aspect ratio so generated or commissioned art can replace it later
  without layout changes.
- Texture: a subtle paper grain via an SVG turbulence filter.
- Motion: clouds drift; steam rises from the loaf; an eagle glides across the sky at long random
  intervals. The shop follows the visitor's local clock: day sky from 06:00 to 18:00, dusk to 20:00,
  then night with stars and lit windows. All motion and the glide are disabled under
  `prefers-reduced-motion`; the day/night state still applies because it is not motion.

## Content at launch

Three menu items written from the private READMEs, in the authors' own voice:

1. **The wall kiosk** (imafish-kiosk): a vendor calendar gadget turned into a fullscreen dashboard
   display. Baker's note: its browser is frozen in mid 2020 and cannot be updated.
2. **tgcrab** (telegram-for-crabs): a resumable Telegram archiver in Go that keeps track of group buys,
   staged as JSONL plus images for another process.
3. **The llama zoo** (llm-llama-server-manager): "the polite little goblin that manages our local AI zoo."
   One RTX 3090 and two RTX 3060s. "The 3090 is the lead singer, the 3060s are backup vocals."

The bench launches empty with its empty state. A `README` section explains how to add an entry.

Dedication line on the plaque (draft, Chad to edit):
"Baked by LoafOfBread and DigitalEagle. A loaf and an eagle, and everything they like to build together."

## Error handling

- Schema violations fail the build with the file and field named.
- Missing cover images fall back to the SVG emblem.
- If the clock script fails or JS is off, the page renders in the day state.

## Verification

- `npm run build` clean; every internal href resolves to a generated file.
- Headless screenshots of home, a recipe card, bench index, and 404 at 1280px and 390px,
  in day and night states.
- Text contrast checked against WCAG AA for body text on cream and on navy.
- Reduced-motion check: no running animations.

## Launch

1. Build and verify locally.
2. Create the public repo in the org, push, enable Pages with the Actions source.
3. DNS for focacciafowl.com through Fishbowl's API (Chad pre-approved these changes on 2026-09-20):
   apex `A` to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153;
   `www` `CNAME` to `focaccia-fowl.github.io`; remove the Porkbun parking `ALIAS`/`CNAME` records
   including the wildcard. Leave `MX` and the SPF `TXT` untouched. Record the before state first.
4. Set the custom domain on the repo, wait for the certificate, enforce HTTPS.

## Out of scope

Backend features, comments, analytics, generated art (planned later with an image model and a style
reference), moving kullhem.io to React and Vite.
