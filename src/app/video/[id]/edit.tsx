import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';

import { MetadataForm } from '@/components/MetadataForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { KeyboardAwareScroll } from '@/components/ui/KeyboardAwareScroll';
import { useUpdateVideoMutation } from '@/hooks/useVideoMutations';
import { useVideo } from '@/store/videoStore';

export default function EditVideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = useVideo(id);
  const updateMutation = useUpdateVideoMutation(id);

  if (!video) {
    return (
      <EmptyState
        icon="help-circle-outline"
        title="Clip not found"
        message="It may have been deleted."
        action={<Button title="Close" variant="secondary" onPress={() => router.back()} />}
      />
    );
  }

  return (
    <KeyboardAwareScroll contentContainerClassName="px-5 pb-12 pt-6">
      <MetadataForm
        defaultValues={{ name: video.name, description: video.description }}
        submitLabel="Save changes"
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
