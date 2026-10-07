import { screen, userEvent, waitFor } from '@testing-library/react-native';

import { MetadataForm, type MetadataFormProps } from '@/components/specifics/MetadataForm';
import { renderWithProviders } from '@/testing/render';

async function renderForm(props: Partial<MetadataFormProps> = {}) {
  const onSubmit = jest.fn();
  const user = userEvent.setup();
  await renderWithProviders(<MetadataForm submitLabel="Save" onSubmit={onSubmit} {...props} />);
  return { onSubmit, user };
}

describe('MetadataForm', () => {
  it('submits the trimmed name and description', async () => {
    const { onSubmit, user } = await renderForm();

    await user.type(screen.getByLabelText('Name'), '  Sunset  ');
    await user.type(screen.getByLabelText('Description'), ' At the pier ');
    await user.press(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Sunset', description: 'At the pier' });
  });

  it('asks for a name instead of submitting without one', async () => {
    const { onSubmit, user } = await renderForm();

    await user.press(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText('Give your clip a name')).toBeOnTheScreen();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('starts with the given values', async () => {
    await renderForm({ defaultValues: { name: 'Beach', description: 'Windy' } });

    expect(screen.getByLabelText('Name')).toHaveDisplayValue('Beach');
    expect(screen.getByLabelText('Description')).toHaveDisplayValue('Windy');
  });

  it('shows an error from the last submit', async () => {
    await renderForm({ submitError: 'Your changes could not be saved.' });

    expect(screen.getByText('Your changes could not be saved.')).toBeOnTheScreen();
  });

  it('locks the fields and the button while submitting', async () => {
    await renderForm({ isSubmitting: true });

    expect(screen.getByLabelText('Name')).not.toBeEnabled();
    expect(screen.getByRole('button')).toBeBusy();
  });
});
