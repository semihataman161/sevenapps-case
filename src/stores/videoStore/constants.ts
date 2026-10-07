import type { VideoState } from './types';

export const PAGE_SIZE = 20;

export const INITIAL_VIDEO_STATE: VideoState = {
  status: 'idle',
  ids: [],
  byId: {},
  total: 0,
  nextCursor: null,
  isLoadingMore: false,
  query: '',
  isSearching: false,
};
