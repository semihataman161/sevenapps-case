import { CLIP_DURATION } from '../constants';
import type { SegmentBounds } from './types';

export type * from './types';

const END_SAFETY_MARGIN = 0.05;

export function formatTime(seconds: number, withTenths = false): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  if (!withTenths) {
    const total = Math.round(safe);
    return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
  }
  const minutes = Math.floor(safe / 60);
  const rest = safe - minutes * 60;
  const whole = Math.floor(rest);
  const tenths = Math.floor((rest - whole) * 10);
  return `${minutes}:${whole.toString().padStart(2, '0')}.${tenths}`;
}

export function formatSeconds(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  return `${(Math.round(safe * 10) / 10).toFixed(1)}s`;
}

export function clipLengthFor(sourceDuration: number): number {
  return Math.min(CLIP_DURATION, Math.max(0, sourceDuration));
}

export function clampSegmentStart(start: number, sourceDuration: number): number {
  const maxStart = Math.max(0, sourceDuration - clipLengthFor(sourceDuration));
  return Math.min(Math.max(0, start), maxStart);
}

export function formatDate(timestamp: number, locale?: string): string {
  return new Date(timestamp).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function segmentBounds(start: number, sourceDuration: number): SegmentBounds {
  const clampedStart = clampSegmentStart(start, sourceDuration);
  const maxEnd = Math.max(clampedStart, sourceDuration - END_SAFETY_MARGIN);
  const end = Math.min(clampedStart + clipLengthFor(sourceDuration), maxEnd);
  return { start: clampedStart, end };
}
