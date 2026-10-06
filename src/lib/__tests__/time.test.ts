import { clampSegmentStart, clipLengthFor, formatSeconds, formatTime, segmentBounds } from '@/lib';

describe('formatTime', () => {
  it('formats minutes and seconds, rounding to the nearest second', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65.4)).toBe('1:05');
    expect(formatTime(4.95)).toBe('0:05');
    expect(formatTime(59.6)).toBe('1:00');
  });

  it('optionally includes tenths', () => {
    expect(formatTime(3.27, true)).toBe('0:03.2');
  });

  it('formats short durations rounded to tenths', () => {
    expect(formatSeconds(4.95)).toBe('5.0s');
    expect(formatSeconds(2.95)).toBe('3.0s');
    expect(formatSeconds(4.94)).toBe('4.9s');
  });

  it('treats invalid input as zero', () => {
    expect(formatTime(Number.NaN)).toBe('0:00');
    expect(formatTime(-4)).toBe('0:00');
  });
});

describe('segment math', () => {
  it('uses a 5 second clip unless the source is shorter', () => {
    expect(clipLengthFor(20)).toBe(5);
    expect(clipLengthFor(3)).toBe(3);
  });

  it('keeps the segment inside the source', () => {
    expect(clampSegmentStart(-1, 20)).toBe(0);
    expect(clampSegmentStart(18, 20)).toBe(15);
    expect(clampSegmentStart(2, 3)).toBe(0);
  });

  it('produces a full 5s segment away from the end', () => {
    expect(segmentBounds(4, 20)).toEqual({ start: 4, end: 9 });
  });

  it('stays a hair short of the very end so native trimmers accept it', () => {
    const { start, end } = segmentBounds(15, 20);
    expect(start).toBe(15);
    expect(end).toBeLessThan(20);
    expect(end).toBeGreaterThan(19.9);
  });
});
