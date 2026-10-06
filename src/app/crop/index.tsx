import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/Button';
import { CLIP_DURATION, MIN_SOURCE_DURATION } from '@/lib/constants';
import { useThemeColors } from '@/lib/theme';
import { useCropDraftStore } from '@/store/cropDraftStore';

export default function SelectVideoScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
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
      router.push('/crop/trim');
    } catch (e) {
      console.warn('Video picker failed', e);
      setError(t('crop.libraryError'));
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom + 16 }}>
      <StepIndicator step={0} />

      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="mb-8 h-28 w-28 items-center justify-center rounded-[36px] bg-accent-soft dark:bg-surface-dark-muted"
        >
          <Ionicons name="film-outline" size={52} color={colors.accent} />
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.delay(80).duration(400)}
          className="mb-3 text-center text-2xl font-bold text-ink dark:text-white"
        >
          {t('crop.pickTitle')}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(160).duration(400)}
          className="text-center text-base leading-6 text-ink-muted"
        >
          {t('crop.pickMessage', { seconds: CLIP_DURATION })}
        </Animated.Text>
        {error ? (
          <Text className="mt-6 text-center text-sm text-red-600 dark:text-red-400">{error}</Text>
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
