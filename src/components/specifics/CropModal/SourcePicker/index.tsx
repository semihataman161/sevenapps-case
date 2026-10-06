import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CLIP_DURATION, MIN_SOURCE_DURATION } from '@/lib';
import { useCropDraftStore } from '@/store';

import { Button, Icon, Typography } from '@/components/commons';
import type { SourcePickerProps } from './types';

export type * from './types';

export function SourcePicker({ onPicked, className = '', ...props }: SourcePickerProps) {
  const { t } = useTranslation();
  const setSource = useCropDraftStore((s) => s.setSource);
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickVideo = async () => {
    setError(null);
    setIsPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      const duration = (asset.duration ?? 0) / 1000;
      if (asset.duration != null && duration < MIN_SOURCE_DURATION) {
        setError(t('crop.tooShort', { seconds: MIN_SOURCE_DURATION }));
        return;
      }

      setSource({
        uri: asset.uri,
        duration,
        width: asset.width || null,
        height: asset.height || null,
        fileName: asset.fileName ?? null,
      });
      onPicked();
    } catch (e) {
      console.warn('Video picker failed', e);
      setError(t('crop.libraryError'));
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <View className={`flex-1 pb-4 ${className}`} {...props}>
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="mb-8 h-28 w-28 items-center justify-center rounded-[36px] bg-accent-soft dark:bg-surface-dark-muted"
        >
          <Icon name="film-outline" size={52} tone="accent" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Typography variant="display" className="mb-3 text-center">
            {t('crop.pickTitle')}
          </Typography>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Typography tone="muted" className="text-center leading-6">
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
          icon="images-outline"
          loading={isPicking}
          onPress={pickVideo}
        />
      </View>
    </View>
  );
}
