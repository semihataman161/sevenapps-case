import { ELLIPSIS, truncate } from '@/lib/text';

describe('truncate', () => {
  it('leaves text within the limit untouched', () => {
    expect(truncate('Sunset at the pier', 40)).toBe('Sunset at the pier');
  });

  it('cuts at a word boundary and adds an ellipsis', () => {
    expect(truncate('A long walk along the windy northern coast', 20)).toBe(
      `A long walk along${ELLIPSIS}`,
    );
  });

  it('cuts inside a word when there is no space near the limit', () => {
    expect(truncate('abcdefghijklmnopqrstuvwxyz', 10)).toBe(`abcdefghi${ELLIPSIS}`);
  });

  it('never returns more characters than the limit', () => {
    const result = truncate('One two three four five six seven', 12);

    expect(Array.from(result).length).toBeLessThanOrEqual(12);
  });

  it('counts an emoji as one character', () => {
    expect(truncate('🎬🎬🎬🎬🎬', 3)).toBe(`🎬🎬${ELLIPSIS}`);
  });

  it('returns an empty string for a limit of zero', () => {
    expect(truncate('Anything', 0)).toBe('');
  });
});
