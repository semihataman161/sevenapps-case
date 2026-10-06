import { de, en, es, pickSupportedLanguage, tr } from '@/i18n';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string'
      ? { ...acc, [path]: value }
      : { ...acc, ...flatten(value, path) };
  }, {});
}

const placeholders = (text: string) => (text.match(/{{\s*\w+\s*}}/g) ?? []).sort();

describe('locales', () => {
  const reference = flatten(en);

  it.each([
    ['tr', tr],
    ['de', de],
    ['es', es],
  ])('%s has every key with the same placeholders as English', (_, locale) => {
    const translated = flatten(locale);
    expect(Object.keys(translated).sort()).toEqual(Object.keys(reference).sort());
    for (const [key, text] of Object.entries(reference)) {
      expect(translated[key].trim()).not.toBe('');
      expect({ key, vars: placeholders(translated[key]) }).toEqual({
        key,
        vars: placeholders(text),
      });
    }
  });
});

describe('pickSupportedLanguage', () => {
  it('uses the first supported device language', () => {
    expect(pickSupportedLanguage(['fr', 'de', 'tr'])).toBe('de');
    expect(pickSupportedLanguage(['TR'])).toBe('tr');
  });

  it('falls back to English', () => {
    expect(pickSupportedLanguage(['fr', null, undefined])).toBe('en');
    expect(pickSupportedLanguage([])).toBe('en');
  });
});

describe('locale-aware upper-casing', () => {
  it('keeps the Turkish dotted İ', () => {
    expect('Dil'.toLocaleUpperCase('tr')).toBe('DİL');
    expect('Bitiş'.toLocaleUpperCase('tr')).toBe('BİTİŞ');
    expect('Dil'.toLocaleUpperCase('en')).toBe('DIL');
  });
});
