import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, KeyboardAwareScroll } from '@/components/commons';
import { EmptyState, HeaderBackButton, MetadataForm, ScreenHeader } from '@/components/specifics';
import { useUpdateVideoMutation } from '@/hooks';
import { useVideo } from '@/store';
import type { IdRouteParams } from '@/types';

export default function EditVideoScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<IdRouteParams>();
  const video = useVideo(id);
  const updateMutation = useUpdateVideoMutation(id);

  const header = (
    <ScreenHeader
      title={t('nav.editDetails')}
      left={<HeaderBackButton icon="close" title={t('common.close')} />}
    />
  );

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
    </View>
  );
}
