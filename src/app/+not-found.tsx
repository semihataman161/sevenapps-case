import { router } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/commons';
import { EmptyState } from '@/components/specifics';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();

  return (
    <View className="flex-1 justify-center" style={{ paddingBottom: headerHeight }}>
      <EmptyState
        icon="compass-outline"
        title={t('notFound.title')}
        message={t('notFound.message')}
        action={
          <Button
            title={t('notFound.goHome')}
            variant="secondary"
            onPress={() => router.dismissTo('/')}
          />
        }
      />
    </View>
  );
}
