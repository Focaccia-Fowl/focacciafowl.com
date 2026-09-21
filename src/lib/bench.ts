// Helpers for the bench (journal). Kept free of Astro imports so they can be unit tested.
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
  for (const entry of entries) {
    for (const raw of entry.data.tags) {
      const slug = tagSlug(raw);
      if (!slug) continue;
      const hit = seen.get(slug);
      if (hit) hit.count += 1;
      else seen.set(slug, { tag: raw.trim(), slug, count: 1 });
    }
  }
  return [...seen.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

// Entry ids come from file paths. "_sample" files and "folder/index" entries both need a clean URL.
export function entrySlug(id: string): string {
  return id.replace(/\/index$/, "").replace(/^_+/, "");
}
