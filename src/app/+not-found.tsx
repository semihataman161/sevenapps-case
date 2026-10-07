import { router } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/commons';
import { EmptyState, ScreenHeader } from '@/components/specifics';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <ScreenHeader />
      <View className="flex-1 justify-center" style={{ paddingBottom: insets.top + 48 }}>
        <EmptyState
          className="px-5"
          eyebrow="404"
          title={t('notFound.title')}
          message={t('notFound.message')}
          action={
            <Button
              variant="text"
              icon="arrow-forward"
              iconPosition="end"
              title={t('notFound.goHome')}
              onPress={() => router.dismissTo('/')}
            />
          }
        />
      </View>
    </View>
  );
}
