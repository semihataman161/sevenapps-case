import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useFilmstrip, useMediaPlayer, usePlayerStatus, useSegmentPlayback } from '@/hooks';
import {
  CLIP_DURATION,
  clipLengthFor,
  cn,
  formatTime,
  palette,
  segmentBounds,
  useBottomGap,
  wholeSeconds,
} from '@/lib';
import { useCropDraftStore, usePick } from '@/stores';

import { Button, Icon, Spinner, Touchable, Typography, VideoFrame } from '@/components/commons';
import { TrimScrubber } from '../../../TrimScrubber';
import { FRAME_COUNT, TIME_UPDATE_INTERVAL } from './constants';
import type { TrimStepProps } from './types';

export type * from './types';

export function TrimStep({
  source,
  onNext,
  active = true,
  className = '',
  style,
  ...props
}: TrimStepProps) {
  const { t } = useTranslation();
  const bottomGap = useBottomGap();
  const { start, setStart, setDuration } = usePick(useCropDraftStore, [
    'start',
    'setStart',
    'setDuration',
  ]);

  const media = useMediaPlayer(source.uri, {
    loop: false,
    timeUpdateInterval: TIME_UPDATE_INTERVAL,
  });
  const { status, isPlaying, isLoaded } = usePlayerStatus(media, setDuration);
  const bounds = segmentBounds(start, source.duration);
  const windowLength = clipLengthFor(source.duration);
  const ready = isLoaded && source.duration > 0;
  const filmstrip = useFilmstrip(media, source.duration, FRAME_COUNT, ready);
  const isPreparing = status !== 'error' && (!ready || !filmstrip.settled);
  const { scrubTo } = useSegmentPlayback(media, {
    segment: bounds,
    isPlaying,
    enabled: active && ready && !isPreparing,
  });

  const handleChange = useCallback(
    (seconds: number) => {
      setStart(seconds);
      media.playFrom(seconds);
    },
    [setStart, media],
  );

  if (isPreparing) {
    return (
      <View
        className={cn('flex-1 items-center justify-center gap-4', className)}
        style={[{ paddingBottom: bottomGap }, style]}
        {...props}
      >
        <Spinner />
        <Typography variant="overline" tone="secondary">
          {t('crop.preparing')}
        </Typography>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      className={cn('flex-1', className)}
      style={[{ paddingBottom: bottomGap }, style]}
      {...props}
    >
      <ScrollView contentContainerClassName="grow justify-center px-5 py-4" bounces={false}>
        <Touchable
          pressedOpacity={1}
          onPress={() => media.toggle()}
          accessibilityLabel={isPlaying ? t('crop.pause') : t('crop.play')}
        >
          <VideoFrame
            player={media.native}
            nativeControls={false}
            aspectRatio={source.width && source.height ? source.width / source.height : undefined}
          />
          {!isPlaying && ready ? (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              pointerEvents="none"
              className="absolute inset-0 items-center justify-center"
            >
              <View className="h-12 w-12 items-center justify-center rounded-sm bg-black/55">
                <Icon name="play" size={22} color={palette.light.paper} style={{ marginLeft: 2 }} />
              </View>
            </Animated.View>
          ) : null}
        </Touchable>

        {status === 'error' ? (
          <Typography variant="label" tone="danger" className="mt-4">
            {t('crop.playbackError')}
          </Typography>
        ) : null}

        <View className="mt-8">
          <TrimScrubber
            media={media}
            disabled={!active}
            duration={source.duration}
            windowLength={windowLength}
            start={start}
            frames={filmstrip.frames}
            labels={{
              selector: t('crop.segmentSelector'),
              start: t('crop.start'),
              end: t('crop.end'),
              hint:
                windowLength < source.duration
                  ? t('crop.dragHint', { seconds: windowLength })
                  : t('crop.shortHint', { seconds: CLIP_DURATION }),
            }}
            formatLength={(seconds) => t('common.seconds', { count: wholeSeconds(seconds) })}
            formatRange={(from, to) =>
              t('crop.segmentRange', { start: formatTime(from), end: formatTime(to) })
            }
            onScrub={scrubTo}
            onChange={handleChange}
          />
        </View>
      </ScrollView>

      <View className="px-5">
        <Button title={t('common.next')} icon="arrow-forward" disabled={!ready} onPress={onNext} />
      </View>
    </Animated.View>
  );
}
