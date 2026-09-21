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
