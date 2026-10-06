import { useCropDraftStore } from '@/store';

const source = {
  uri: 'file:///video.mov',
  duration: 12,
  width: 1920,
  height: 1080,
  fileName: null,
};

describe('useCropDraftStore', () => {
  beforeEach(() => useCropDraftStore.getState().reset());

  it('starts a new draft at 0s when a source is picked', () => {
    useCropDraftStore.getState().setStart(3);
    useCropDraftStore.getState().setSource(source);
    expect(useCropDraftStore.getState()).toMatchObject({ source, start: 0 });
  });

  it('clamps the start so the segment fits', () => {
    useCropDraftStore.getState().setSource(source);
    useCropDraftStore.getState().setStart(11);
    expect(useCropDraftStore.getState().start).toBe(7);
  });

  it('re-clamps when the player reports a shorter duration', () => {
    useCropDraftStore.getState().setSource(source);
    useCropDraftStore.getState().setStart(7);
    useCropDraftStore.getState().setDuration(10);
    expect(useCropDraftStore.getState()).toMatchObject({ start: 5, source: { duration: 10 } });
  });
});
