import { pickKeys } from '@/stores/usePick';

describe('pickKeys', () => {
  it('returns only the requested keys with their values', () => {
    const action = () => {};
    const state = { ids: ['a'], status: 'ready', total: 1, hydrate: action };

    expect(pickKeys(state, ['ids', 'hydrate'])).toEqual({ ids: ['a'], hydrate: action });
  });

  it('returns an empty object when no keys are requested', () => {
    expect(pickKeys({ total: 1 }, [])).toEqual({});
  });
});
