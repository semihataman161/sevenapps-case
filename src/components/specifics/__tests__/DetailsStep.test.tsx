import { screen, userEvent, waitFor } from '@testing-library/react-native';

import { DetailsStep } from '@/components/specifics/CropModal/Steps/DetailsStep';
import { useCropDraftStore } from '@/stores/cropDraftStore';
import { buildSource } from '@/testing';
import { renderWithProviders } from '@/testing/render';
import type { ServicesMock } from '@/testing/services';

jest.mock('@/services', () =>
  jest
    .requireActual<typeof import('@/testing/services')>('@/testing/services')
    .createServicesMock(),
);

const { videoService } = jest.requireMock<ServicesMock>('@/services');

const source = buildSource({ duration: 20 });

async function renderStep() {
  useCropDraftStore.setState({ source, start: 4 });
  const onComplete = jest.fn();
  const user = userEvent.setup();
  await renderWithProviders(<DetailsStep source={source} onComplete={onComplete} />);
  return { onComplete, user };
}

describe('DetailsStep', () => {
  it('shows the selected segment', async () => {
    await renderStep();

    expect(screen.getByText('0:04.0 — 0:09.0')).toBeOnTheScreen();
  });

  it('starts the crop in the background and closes right away', async () => {
    videoService.crop.mockReturnValue(new Promise(() => {}));
    const { onComplete, user } = await renderStep();

    await user.type(screen.getByLabelText('Name'), ' Sunset ');
    await user.press(screen.getByRole('button', { name: /crop & save/i }));

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    expect(videoService.crop).toHaveBeenCalledWith({
      source,
      range: { start: 4, end: 9 },
      details: { name: 'Sunset', description: '' },
    });
  });
});
