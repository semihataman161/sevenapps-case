import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, KeyboardAwareScroll, Spinner } from '@/components/commons';
import { EmptyState, HeaderBackButton, MetadataForm, ScreenHeader } from '@/components/specifics';
import { useUpdateVideoMutation, useVideoRecord, videoErrorKey } from '@/hooks';

export default function EditVideoScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<'/videos/[id]/edit'>();
  const { video, isLoading } = useVideoRecord(id);
  const updateMutation = useUpdateVideoMutation(id);

  const header = (
    <ScreenHeader
      title={t('nav.editDetails')}
      left={<HeaderBackButton icon="close" title={t('common.close')} />}
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1">
        {header}
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  if (!video) {
    return (
      <View className="flex-1">
        {header}
        <View className="flex-1 justify-center" style={{ paddingBottom: insets.top + 48 }}>
          <EmptyState
            className="px-5"
            title={t('video.notFoundTitle')}
            message={t('video.notFoundMessage')}
            action={
              <Button
                variant="text"
                icon="close"
                title={t('common.close')}
                onPress={() => router.back()}
              />
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {header}
      <KeyboardAwareScroll contentContainerClassName="px-5 pb-12 pt-8">
        <MetadataForm
          defaultValues={{ name: video.name, description: video.description }}
          submitLabel={t('form.saveChanges')}
          submitIcon="arrow-forward"
          isSubmitting={updateMutation.isPending}
          submitError={
            updateMutation.isError ? t(videoErrorKey(updateMutation.error, 'update')) : null
          }
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
    </View>
  );
}
