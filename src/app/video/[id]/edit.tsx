import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { MetadataForm } from '@/components/MetadataForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { KeyboardAwareScroll } from '@/components/ui/KeyboardAwareScroll';
import { useUpdateVideoMutation } from '@/hooks/useVideoMutations';
import { useVideo } from '@/store/videoStore';

export default function EditVideoScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = useVideo(id);
  const updateMutation = useUpdateVideoMutation(id);

  if (!video) {
    return (
      <EmptyState
        icon="help-circle-outline"
        title={t('video.notFoundTitle')}
        message={t('video.notFoundMessage')}
        action={
          <Button title={t('common.close')} variant="secondary" onPress={() => router.back()} />
        }
      />
    );
  }

  return (
    <KeyboardAwareScroll contentContainerClassName="px-5 pb-12 pt-6">
      <MetadataForm
        defaultValues={{ name: video.name, description: video.description }}
        submitLabel={t('form.saveChanges')}
        submitIcon="checkmark"
        isSubmitting={updateMutation.isPending}
        submitError={updateMutation.error?.message}
        onSubmit={(values) =>
          updateMutation.mutate(values, {
            onSuccess: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              router.back();
            },
          })
        }
      />
    </KeyboardAwareScroll>
  );
}
