import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CLIP_DURATION, MIN_SOURCE_DURATION, useBottomGap } from '@/lib';
import { videoService } from '@/services';
import { useCropDraftStore } from '@/stores';

import { Button, Typography } from '@/components/commons';
import type { PickerStepProps } from './types';

export type * from './types';

export function PickerStep({ onPicked, className = '', style, ...props }: PickerStepProps) {
  const { t } = useTranslation();
  const bottomGap = useBottomGap();
  const setSource = useCropDraftStore((s) => s.setSource);
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickVideo = async () => {
    setError(null);
    setIsPicking(true);
    try {
      const source = await videoService.pickFromLibrary();
      if (!source) return;

      if (source.duration > 0 && source.duration < MIN_SOURCE_DURATION) {
        setError(t('crop.tooShort', { seconds: MIN_SOURCE_DURATION }));
        return;
      }

      setSource(source);
      onPicked();
    } catch (e) {
      console.warn('Video picker failed', e);
      setError(t('crop.libraryError'));
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <View
      className={`flex-1 ${className}`}
      style={[{ paddingBottom: bottomGap }, style]}
      {...props}
    >
      <View className="flex-1 items-center justify-center px-5">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Typography variant="headline" className="text-center">
            {t('crop.pickTitle')}
          </Typography>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Typography tone="secondary" className="mt-3 max-w-[320px] text-center">
            {t('crop.pickMessage', { seconds: CLIP_DURATION })}
          </Typography>
        </Animated.View>
        {error ? (
          <Typography variant="label" tone="danger" className="mt-6 text-center">
            {error}
          </Typography>
        ) : null}
      </View>

      <View className="px-5">
        <Button
          title={t('crop.chooseFromLibrary')}
          icon="arrow-forward"
          loading={isPicking}
          onPress={pickVideo}
        />
      </View>
    </View>
  );
}
