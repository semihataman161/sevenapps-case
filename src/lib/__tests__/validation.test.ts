import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@/lib/constants';
import { metadataSchema } from '@/lib/validation';

describe('metadataSchema', () => {
  it('accepts a name without a description', async () => {
    await expect(metadataSchema.validate({ name: 'Beach day' })).resolves.toEqual({
      name: 'Beach day',
      description: '',
    });
  });

  it('trims both fields', async () => {
    await expect(metadataSchema.validate({ name: '  Hi  ', description: ' x ' })).resolves.toEqual({
      name: 'Hi',
      description: 'x',
    });
  });

  it.each([
    ['an empty name', { name: '' }, 'validation.nameRequired'],
    ['a blank name', { name: '   ' }, 'validation.nameRequired'],
    ['a one-letter name', { name: 'a' }, 'validation.nameMin'],
    ['a too long name', { name: 'a'.repeat(NAME_MAX_LENGTH + 1) }, 'validation.nameMax'],
    [
      'a too long description',
      { name: 'Ok', description: 'x'.repeat(DESCRIPTION_MAX_LENGTH + 1) },
      'validation.descriptionMax',
    ],
  ])('rejects %s with its translation key', async (_, input, key) => {
    await expect(metadataSchema.validate(input)).rejects.toThrow(key);
  });
});
