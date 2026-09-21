// Time of day for the shop. The inline script in src/layouts/Base.astro mirrors these hour
// boundaries so the phase is set before first paint; change both together.
export type Phase = "day" | "dusk" | "night";

export function phaseForHour(hour: number): Phase {
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return "day";
  if (hour >= 6 && hour < 18) return "day";
  if (hour >= 18 && hour < 20) return "dusk";
  return "night";
}
