import { pickSupportedLanguage } from '@/i18n/languages';
import { de, en, es, tr } from '@/i18n/locales';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string'
      ? { ...acc, [path]: value }
      : { ...acc, ...flatten(value, path) };
  }, {});
}

function placeholders(text: string): string[] {
  return (text.match(/{{\s*\w+\s*}}/g) ?? []).sort();
}

const reference = flatten(en);

describe.each([
  ['tr', tr],
  ['de', de],
  ['es', es],
])('%s locale', (_, locale) => {
  const translated = flatten(locale);

  it('has exactly the English keys', () => {
    expect(Object.keys(translated).sort()).toEqual(Object.keys(reference).sort());
  });

  it('has no empty texts', () => {
    const empty = Object.keys(translated).filter((key) => translated[key].trim() === '');

    expect(empty).toEqual([]);
  });

  it('uses the same placeholders as English', () => {
    const mismatched = Object.keys(reference).filter(
      (key) => placeholders(translated[key] ?? '').join() !== placeholders(reference[key]).join(),
    );

    expect(mismatched).toEqual([]);
  });
});

describe('pickSupportedLanguage', () => {
  it('picks the first supported device language', () => {
    expect(pickSupportedLanguage(['fr', 'de', 'tr'])).toBe('de');
  });

  it('ignores the case of language codes', () => {
    expect(pickSupportedLanguage(['TR'])).toBe('tr');
  });

  it.each([[['fr', null, undefined]], [[]]])('falls back to English for %j', (codes) => {
    expect(pickSupportedLanguage(codes)).toBe('en');
  });
});
