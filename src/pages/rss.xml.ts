import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { visibleEntries, sortNewestFirst, entrySlug } from "../lib/bench.ts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET({ site }: APIContext) {
  const base = site!.toString().replace(/\/$/, "");
  // Drafts never reach the feed, even in dev.
  const entries = sortNewestFirst(visibleEntries(await getCollection("bench"), false));
  const items = entries
    .map((e) => {
      const url = `${base}/bench/${entrySlug(e.id)}/`;
      return `    <item>
      <title>${esc(e.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${e.data.date.toUTCString()}</pubDate>
      <description>${esc(e.data.summary)}</description>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Focaccia Fowl · The bench</title>
    <link>${base}/bench/</link>
    <description>Notes from the Focaccia Fowl workbench: builds, boards, solder, and science.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
