import * as Haptics from 'expo-haptics';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCropVideoMutation } from '@/hooks';
import { formatSeconds, formatTime, segmentBounds, type MetadataFormValues } from '@/lib';
import { describeCropError } from '@/services';
import { useCropDraftStore } from '@/store';

import { Icon, KeyboardAwareScroll, Row, Typography } from '@/components/commons';
import { MetadataForm } from '../../MetadataForm';
import type { DetailsStepProps } from './types';

export type * from './types';

export function DetailsStep({
  source,
  onSaved,
  contentContainerClassName = 'px-5 pb-12 pt-3',
  ...props
}: DetailsStepProps) {
  const { t } = useTranslation();
  const start = useCropDraftStore((s) => s.start);
  const cropMutation = useCropVideoMutation();
  const isPending = cropMutation.isPending;
  const bounds = segmentBounds(start, source.duration);

  const onSubmit = (metadata: MetadataFormValues) =>
    cropMutation.mutate(
      { source, start, metadata },
      {
        onSuccess: (video) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          onSaved(video.id);
        },
      },
    );

  return (
    <KeyboardAwareScroll contentContainerClassName={contentContainerClassName} {...props}>
      <Row gap={12} className="mb-6 rounded-2xl bg-accent-soft p-4 dark:bg-surface-dark-muted">
        <Icon name="cut-outline" size={22} tone="accent" />
        <View className="flex-1">
          <Typography variant="label" weight="semibold">
            {formatTime(bounds.start, true)} – {formatTime(bounds.end, true)}
          </Typography>
          <Typography variant="caption" tone="muted">
            {t('crop.segmentFrom', {
              duration: formatSeconds(bounds.end - bounds.start),
              file: source.fileName ?? t('crop.yourVideo'),
            })}
          </Typography>
        </View>
      </Row>

      <MetadataForm
        submitLabel={isPending ? t('crop.cropping') : t('crop.cropAndSave')}
        submitIcon="cut-outline"
        isSubmitting={isPending}
        submitError={cropMutation.isError ? t(describeCropError(cropMutation.error)) : null}
        onSubmit={onSubmit}
      />
    </KeyboardAwareScroll>
  );
}
