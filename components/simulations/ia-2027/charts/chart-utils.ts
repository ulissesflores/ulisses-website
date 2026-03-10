/**
 * SVG chart utility functions for the IA 2027 simulation.
 * Pure math — no React dependencies.
 */

/** Linear scale: maps [domainMin, domainMax] → [rangeMin, rangeMax] */
export function linearScale(
  value: number,
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
): number {
  if (domainMax === domainMin) return rangeMin;
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

/** Generate an SVG path `d` string for an area chart (filled to bottom). */
export function areaPath(
  points: { x: number; y: number }[],
  baselineY: number,
): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  let d = `M ${first.x},${baselineY}`;
  d += ` L ${first.x},${first.y}`;
  for (const p of rest) {
    d += ` L ${p.x},${p.y}`;
  }
  d += ` L ${points[points.length - 1].x},${baselineY}`;
  d += ' Z';
  return d;
}

/** Generate an SVG path `d` string for a line (no fill). */
export function linePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  let d = `M ${first.x},${first.y}`;
  for (const p of rest) {
    d += ` L ${p.x},${p.y}`;
  }
  return d;
}

/** Format large numbers compactly: 12B, 350B, 1.2T */
export function compactUSD(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toFixed(0)}`;
}

/** Format a date string (YYYY-MM-DD) as abbreviated month. */
export function shortMonth(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
}

/** Calculate nice Y-axis ticks for a given min/max range. */
export function niceYTicks(min: number, max: number, count = 4): number[] {
  const range = max - min;
  if (range === 0) return [min];
  const rawStep = range / (count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const steps = [1, 2, 5, 10];
  const niceStep = steps.find((s) => s * mag >= rawStep)! * mag;
  const start = Math.floor(min / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let t = start; t <= max + niceStep * 0.01; t += niceStep) {
    ticks.push(t);
  }
  return ticks;
}
