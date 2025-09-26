import type { Rect } from "../types/models";

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

// Axis-aligned rectangle overlap (used to detect dropping a note on the Trash).
export const rectsOverlap = (a: Rect, b: Rect) =>
  !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);