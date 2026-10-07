import * as Haptics from 'expo-haptics';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCropVideoMutation, videoErrorKey } from '@/hooks';
import { formatSeconds, formatTime, segmentBounds, type MetadataFormValues } from '@/lib';
import { useCropDraftStore } from '@/stores';

import { Divider, KeyboardAwareScroll, Typography } from '@/components/commons';
import { MetadataForm } from '../../../MetadataForm';
import type { DetailsStepProps } from './types';

export type * from './types';

export function DetailsStep({
  source,
  onComplete,
  contentContainerClassName = 'px-5 pb-12 pt-3',
  ...props
}: DetailsStepProps) {
  const { t } = useTranslation();
  const start = useCropDraftStore((s) => s.start);
  const cropMutation = useCropVideoMutation();
  const isPending = cropMutation.isPending;
  const bounds = segmentBounds(start, source.duration);

  const onSubmit = (details: MetadataFormValues) =>
    cropMutation.mutate(
      { source, start, details },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          onComplete();
        },
      },
    );

  return (
    <KeyboardAwareScroll contentContainerClassName={contentContainerClassName} {...props}>
      <View className="mb-10">
        <Typography variant="overline" tone="secondary">
          {t('crop.segmentLabel')}
        </Typography>
        <Typography variant="title" tabular className="mt-2">
          {`${formatTime(bounds.start, true)} — ${formatTime(bounds.end, true)}`}
        </Typography>
        <Typography variant="caption" tone="secondary" className="mt-1.5">
          {t('crop.segmentFrom', {
            duration: formatSeconds(bounds.end - bounds.start),
            file: source.fileName ?? t('crop.yourVideo'),
          })}
        </Typography>
        <Divider className="mt-6" />
      </View>

      <MetadataForm
        submitLabel={isPending ? t('crop.cropping') : t('crop.cropAndSave')}
        submitIcon="arrow-forward"
        isSubmitting={isPending}
        submitError={cropMutation.isError ? t(videoErrorKey(cropMutation.error, 'crop')) : null}
        onSubmit={onSubmit}
      />
    </KeyboardAwareScroll>
  );
}
