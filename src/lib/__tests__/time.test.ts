import {
  clampSegmentStart,
  clipLengthFor,
  formatIndex,
  formatSeconds,
  formatTime,
  segmentBounds,
  wholeSeconds,
} from '@/lib/time';

describe('formatTime', () => {
  it.each([
    [0, '0:00'],
    [65.4, '1:05'],
    [4.95, '0:05'],
    [59.6, '1:00'],
  ])('formats %s seconds as %s', (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected);
  });

  it('adds tenths when asked', () => {
    expect(formatTime(3.27, true)).toBe('0:03.2');
  });

  it.each([Number.NaN, -4])('treats %s as zero', (seconds) => {
    expect(formatTime(seconds)).toBe('0:00');
  });
});

describe('formatSeconds', () => {
  it.each([
    [4.95, '5.0s'],
    [2.95, '3.0s'],
    [4.94, '4.9s'],
  ])('rounds %s to tenths as %s', (seconds, expected) => {
    expect(formatSeconds(seconds)).toBe(expected);
  });
});

describe('wholeSeconds', () => {
  it.each([
    [4.95, 5],
    [4.4, 4],
    [-1, 0],
    [Number.NaN, 0],
  ])('turns %s into %s', (seconds, expected) => {
    expect(wholeSeconds(seconds)).toBe(expected);
  });
});

describe('formatIndex', () => {
  it.each([
    [3, '03'],
    [12, '12'],
    [120, '120'],
  ])('pads %s to %s', (value, expected) => {
    expect(formatIndex(value)).toBe(expected);
  });
});

describe('clipLengthFor', () => {
  it('uses 5 seconds when the source is long enough', () => {
    expect(clipLengthFor(20)).toBe(5);
  });

  it('uses the whole source when it is shorter than 5 seconds', () => {
    expect(clipLengthFor(3)).toBe(3);
  });
});

describe('clampSegmentStart', () => {
  it.each([
    [-1, 20, 0],
    [18, 20, 15],
    [2, 3, 0],
  ])('moves a start of %s in a %ss source to %s', (start, duration, expected) => {
    expect(clampSegmentStart(start, duration)).toBe(expected);
  });
});

describe('segmentBounds', () => {
  it('spans 5 seconds from the start', () => {
    expect(segmentBounds(4, 20)).toEqual({ start: 4, end: 9 });
  });

  it('ends just before the end of the source so native trimmers accept it', () => {
    const { start, end } = segmentBounds(15, 20);

    expect(start).toBe(15);
    expect(end).toBeLessThan(20);
    expect(end).toBeGreaterThan(19.9);
  });
});
