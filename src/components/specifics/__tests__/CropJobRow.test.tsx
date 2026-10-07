import { screen, userEvent } from '@testing-library/react-native';

import { CropJobRow } from '@/components/specifics/CropJobRow';
import type { CropJob } from '@/hooks/useVideoMutations';
import { renderWithProviders } from '@/testing/render';

function job(overrides: Partial<CropJob> = {}): CropJob {
  return { id: 7, title: 'Sunset', status: 'pending', errorKey: null, ...overrides };
}

async function renderRow(cropJob: CropJob) {
  const onRetry = jest.fn();
  const onDismiss = jest.fn();
  await renderWithProviders(<CropJobRow job={cropJob} onRetry={onRetry} onDismiss={onDismiss} />);
  return { onRetry, onDismiss };
}

describe('CropJobRow', () => {
  it('shows a running crop without actions', async () => {
    await renderRow(job());

    expect(screen.getByText('Sunset')).toBeOnTheScreen();
    expect(screen.getByText(/cropping/i)).toBeOnTheScreen();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows why a crop failed', async () => {
    await renderRow(job({ status: 'error', errorKey: 'errors.sourceUnreadable' }));

    expect(screen.getByText(/not saved/i)).toBeOnTheScreen();
    expect(
      screen.getByText('The original video could not be read. Try picking it again.'),
    ).toBeOnTheScreen();
  });

  it('retries or dismisses a failed crop by its id', async () => {
    const user = userEvent.setup();
    const { onRetry, onDismiss } = await renderRow(
      job({ status: 'error', errorKey: 'errors.cropFailed' }),
    );

    await user.press(screen.getByRole('button', { name: /try again/i }));
    await user.press(screen.getByRole('button', { name: /dismiss/i }));

    expect(onRetry).toHaveBeenCalledWith(7);
    expect(onDismiss).toHaveBeenCalledWith(7);
  });
});
