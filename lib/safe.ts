export function safe(value: number, fallback: number = 0): number {
  if (typeof value !== "number" || isNaN(value) || !isFinite(value)) return fallback;
  return value;
}

export function safeInt(value: number, fallback: number = 0): number {
  return Math.round(safe(value, fallback));
}

export function safeParse(value: string | number | null | undefined, fallback: number = 0): number {
  if (value == null) return fallback;
  if (typeof value === "number") return safe(value, fallback);
  const parsed = parseFloat(value);
  return safe(parsed, fallback);
}

export function safeClamp(value: number, min: number, max: number, fallback: number = 0): number {
  return Math.max(min, Math.min(max, safe(value, fallback)));
}
