import { NAME_MAX_LENGTH } from '../constants';
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
    [{ name: '' }, 'Give your clip a name'],
    [{ name: '   ' }, 'Give your clip a name'],
    [{ name: 'a' }, 'Name must be at least 2 characters'],
    [
      { name: 'a'.repeat(NAME_MAX_LENGTH + 1) },
      `Name must be at most ${NAME_MAX_LENGTH} characters`,
    ],
  ])('rejects %j', async (input, message) => {
    await expect(metadataSchema.validate(input)).rejects.toThrow(message);
  });
});
