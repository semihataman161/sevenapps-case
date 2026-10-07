import { useTranslation } from 'react-i18next';

import { Button, PageHeader, Row, Typography } from '@/components/commons';

import type { ArchiveHeaderProps } from './types';

export type * from './types';

export function ArchiveHeader({
  count,
  onNewClip,
  onOpenSettings,
  className = '',
  ...props
}: ArchiveHeaderProps) {
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
      className={`px-5 ${className}`}
      {...props}
    />
  );
}
