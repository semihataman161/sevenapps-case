import { useCropDraftStore } from '@/stores/cropDraftStore';
import { INITIAL_CROP_DRAFT_STATE } from '@/stores/cropDraftStore/constants';
import { buildSource } from '@/testing';

const source = buildSource({ duration: 12 });

describe('cropDraftStore', () => {
  beforeEach(() => {
    useCropDraftStore.setState(INITIAL_CROP_DRAFT_STATE);
  });

  it('starts a new draft at 0s when a source is picked', () => {
    useCropDraftStore.getState().setStart(3);

    useCropDraftStore.getState().setSource(source);

    expect(useCropDraftStore.getState()).toMatchObject({ source, start: 0 });
  });

  it('keeps the start where a full segment still fits', () => {
    useCropDraftStore.getState().setSource(source);

    useCropDraftStore.getState().setStart(11);

    expect(useCropDraftStore.getState().start).toBe(7);
  });

  it('moves the start back when the player reports a shorter duration', () => {
    useCropDraftStore.getState().setSource(source);
    useCropDraftStore.getState().setStart(7);

    useCropDraftStore.getState().setDuration(10);

    expect(useCropDraftStore.getState()).toMatchObject({ start: 5, source: { duration: 10 } });
  });

  it('clears the draft on reset', () => {
    useCropDraftStore.getState().setSource(source);

    useCropDraftStore.getState().reset();

    expect(useCropDraftStore.getState()).toMatchObject(INITIAL_CROP_DRAFT_STATE);
  });
});
