import { test } from "node:test";
import assert from "node:assert/strict";
import { visibleEntries, sortNewestFirst, tagSlug, allTags, entrySlug } from "./bench.ts";

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
test("entrySlug strips a leading underscore and any folder index suffix", () => {
  assert.equal(entrySlug("_sample-first-batch"), "sample-first-batch");
  assert.equal(entrySlug("first-reflow/index"), "first-reflow");
  assert.equal(entrySlug("plain"), "plain");
});
