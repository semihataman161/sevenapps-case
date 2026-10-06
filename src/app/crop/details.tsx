import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Redirect, router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MetadataForm } from '@/components/MetadataForm';
import { StepIndicator } from '@/components/StepIndicator';
import { KeyboardAwareScroll } from '@/components/ui/KeyboardAwareScroll';
import { useCropVideoMutation } from '@/hooks/useVideoMutations';
import { formatSeconds, formatTime, segmentBounds } from '@/lib/time';
import { useThemeColors } from '@/lib/theme';
import { describeCropError } from '@/services/cropVideo';
import { useCropDraftStore } from '@/store/cropDraftStore';
import type { MetadataFormValues } from '@/lib/validation';

export default function DetailsScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const source = useCropDraftStore((s) => s.source);
  const start = useCropDraftStore((s) => s.start);
  const cropMutation = useCropVideoMutation();
  const isPending = cropMutation.isPending;

  useEffect(() => {
    if (!isPending) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [isPending]);

  if (!source) return <Redirect href="/crop" />;

  const bounds = segmentBounds(start, source.duration);

  const onSubmit = (metadata: MetadataFormValues) =>
    cropMutation.mutate(
      { source, start, metadata },
      {
        onSuccess: (video) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          router.dismissTo({ pathname: '/video/[id]', params: { id: video.id } });
        },
      },
    );

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: !isPending, headerBackVisible: !isPending }} />
      <StepIndicator step={2} />
      <KeyboardAwareScroll contentContainerClassName="px-5 pb-12 pt-3">
        <View className="mb-6 flex-row items-center gap-3 rounded-2xl bg-accent-soft p-4 dark:bg-surface-dark-muted">
          <Ionicons name="cut-outline" size={22} color={colors.accent} />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-ink dark:text-white">
              {formatTime(bounds.start, true)} – {formatTime(bounds.end, true)}
            </Text>
            <Text className="text-xs text-ink-muted">
              {t('crop.segmentFrom', {
                duration: formatSeconds(bounds.end - bounds.start),
                file: source.fileName ?? t('crop.yourVideo'),
              })}
            </Text>
          </View>
        </View>

        <MetadataForm
          submitLabel={isPending ? t('crop.cropping') : t('crop.cropAndSave')}
          submitIcon="cut-outline"
          isSubmitting={isPending}
          submitError={cropMutation.isError ? t(describeCropError(cropMutation.error)) : null}
          onSubmit={onSubmit}
        />
      </KeyboardAwareScroll>
    </>
  );
}
