import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, KeyboardAwareScroll } from '@/components/commons';
import { EmptyState, MetadataForm } from '@/components/specifics';
import { useUpdateVideoMutation } from '@/hooks';
import { useVideo } from '@/store';
import type { IdRouteParams } from '@/types';

export default function EditVideoScreen() {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams<IdRouteParams>();
  const video = useVideo(id);
  const updateMutation = useUpdateVideoMutation(id);

  if (!video) {
    return (
      <View className="flex-1 justify-center" style={{ paddingBottom: headerHeight }}>
        <EmptyState
          icon="help-circle-outline"
          title={t('video.notFoundTitle')}
          message={t('video.notFoundMessage')}
          action={
            <Button title={t('common.close')} variant="secondary" onPress={() => router.back()} />
          }
        />
      </View>
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
