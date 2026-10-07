import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/commons';

import { EmptyState } from '../EmptyState';
import type { ErrorScreenProps } from './types';

export type * from './types';

export function ErrorScreen({ onRetry, className = '', ...props }: ErrorScreenProps) {
  const { t } = useTranslation();

  return (
    <View className={`flex-1 justify-center bg-paper dark:bg-paper-dark ${className}`} {...props}>
      <EmptyState
        className="px-5"
        align="center"
        eyebrow={t('crash.title')}
        title={t('crash.message')}
        action={
          <Button variant="text" icon="refresh" title={t('common.tryAgain')} onPress={onRetry} />
        }
      />
    </View>
  );
}
