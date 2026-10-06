import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/commons';

import type { HeaderBackButtonProps } from './types';

export type * from './types';

export function HeaderBackButton({
  title,
  canGoBack = true,
  className = '',
  ...props
}: HeaderBackButtonProps) {
  const { t } = useTranslation();

  if (!canGoBack) return null;

  return (
    <Button
      variant="text"
      title={title ?? t('common.back')}
      icon="chevron-back"
      onPress={() => router.back()}
      className={`-ml-1.5 mr-4 ${className}`}
      {...props}
    />
  );
}
