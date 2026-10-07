import { useTranslation } from 'react-i18next';

import { cn } from '@/lib';

import { Button, PageHeader, Row, SearchField, Typography } from '@/components/commons';

import type { VideoListHeaderProps } from './types';

export type * from './types';

export function VideoListHeader({
  count,
  onNewClip,
  onOpenSettings,
  initialQuery,
  onSearch,
  className = '',
  ...props
}: VideoListHeaderProps) {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t('nav.diary')}
      meta={
        <Row gap={6}>
          <Typography variant="meta" tone="secondary">
            {t('home.totalClips')}
          </Typography>
          <Typography variant="meta" weight="semibold" tabular>
            {count}
          </Typography>
        </Row>
      }
      topAction={
        <Button
          variant="text"
          icon="settings-outline"
          iconSize={22}
          accessibilityLabel={t('nav.settings')}
          onPress={onOpenSettings}
        />
      }
      action={
        <Button
          variant="secondary"
          size="compact"
          icon="add"
          iconSize={16}
          iconPosition="start"
          title={t('list.newClip')}
          onPress={onNewClip}
        />
      }
      footer={
        onSearch ? (
          <SearchField
            initialQuery={initialQuery}
            onSearch={onSearch}
            placeholder={t('list.searchPlaceholder')}
            clearLabel={t('list.clearSearch')}
            accessibilityLabel={t('list.searchPlaceholder')}
          />
        ) : null
      }
      className={cn('px-5', className)}
      {...props}
    />
  );
}
