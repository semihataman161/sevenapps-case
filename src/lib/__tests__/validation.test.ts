import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '../constants';
import { metadataSchema } from '../validation';

describe('metadataSchema', () => {
  it('accepts a valid name with an optional description', async () => {
    await expect(metadataSchema.validate({ name: 'Beach day' })).resolves.toEqual({
      name: 'Beach day',
      description: '',
    });
  });

  it('trims input before validating', async () => {
    await expect(metadataSchema.validate({ name: '  Hi  ', description: ' x ' })).resolves.toEqual({
      name: 'Hi',
      description: 'x',
    });
  });

  it.each([
    [{ name: '' }, 'validation.nameRequired'],
    [{ name: '   ' }, 'validation.nameRequired'],
    [{ name: 'a' }, 'validation.nameMin'],
    [{ name: 'a'.repeat(NAME_MAX_LENGTH + 1) }, 'validation.nameMax'],
    [
      { name: 'Ok', description: 'x'.repeat(DESCRIPTION_MAX_LENGTH + 1) },
      'validation.descriptionMax',
    ],
  ])('rejects %j', async (input, message) => {
    await expect(metadataSchema.validate(input)).rejects.toThrow(message);
  });
});
