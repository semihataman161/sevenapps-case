export const ELLIPSIS = '…';

const WORD_BREAK_RATIO = 0.6;

export function truncate(text: string, maxChars: number): string {
  if (maxChars <= 0) return '';
  const characters = Array.from(text);
  if (characters.length <= maxChars) return text;

  const kept = characters.slice(0, Math.max(0, maxChars - 1)).join('');
  const lastSpace = kept.lastIndexOf(' ');
  const base = lastSpace > kept.length * WORD_BREAK_RATIO ? kept.slice(0, lastSpace) : kept;
  return `${base.trimEnd()}${ELLIPSIS}`;
}
