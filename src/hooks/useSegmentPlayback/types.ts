export type PlaybackSegment = {
  start: number;
  end: number;
};

export type SegmentPlaybackOptions = {
  segment: PlaybackSegment;
  isPlaying: boolean;
  enabled: boolean;
};

export type SegmentPlayback = {
  scrubTo: (seconds: number) => void;
};
