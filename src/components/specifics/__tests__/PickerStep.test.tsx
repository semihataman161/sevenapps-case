import { screen, userEvent } from '@testing-library/react-native';

import { PickerStep } from '@/components/specifics/CropModal/Steps/PickerStep';
import type { PickedVideo } from '@/services';
import type { ServicesMock } from '@/testing/services';
import { useCropDraftStore } from '@/stores/cropDraftStore';
import { INITIAL_CROP_DRAFT_STATE } from '@/stores/cropDraftStore/constants';
import { buildSource } from '@/testing';
import { renderWithProviders } from '@/testing/render';

jest.mock('@/services', () =>
  jest
    .requireActual<typeof import('@/testing/services')>('@/testing/services')
    .createServicesMock(),
);

const { mediaPicker } = jest.requireMock<ServicesMock>('@/services');

async function pickWith(result: () => Promise<PickedVideo | null>) {
  mediaPicker.pickVideo.mockImplementationOnce(result);
  const onPicked = jest.fn();
  const user = userEvent.setup();
  await renderWithProviders(<PickerStep onPicked={onPicked} />);

  await user.press(screen.getByRole('button', { name: /choose from library/i }));

  return { onPicked };
}

describe('PickerStep', () => {
  beforeEach(() => {
    useCropDraftStore.setState(INITIAL_CROP_DRAFT_STATE);
  });

  it('keeps the picked video in the draft and moves on', async () => {
    const source = buildSource({ duration: 20 });

    const { onPicked } = await pickWith(async () => source);

    expect(useCropDraftStore.getState().source).toEqual(source);
    expect(onPicked).toHaveBeenCalledTimes(1);
  });

  it('rejects a video shorter than one second', async () => {
    const { onPicked } = await pickWith(async () => buildSource({ duration: 0.5 }));

    expect(await screen.findByText(/too short/i)).toBeOnTheScreen();
    expect(useCropDraftStore.getState().source).toBeNull();
    expect(onPicked).not.toHaveBeenCalled();
  });

  it('stays on the step when the user cancels', async () => {
    const { onPicked } = await pickWith(async () => null);

    expect(onPicked).not.toHaveBeenCalled();
    expect(screen.queryByText(/too short|could not open/i)).toBeNull();
  });

  it('explains when the library cannot be opened', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { onPicked } = await pickWith(async () => {
      throw new Error('denied');
    });

    expect(await screen.findByText('Could not open your video library.')).toBeOnTheScreen();
    expect(onPicked).not.toHaveBeenCalled();
  });
});
