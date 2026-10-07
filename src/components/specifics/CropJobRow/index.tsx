import { useTranslation } from 'react-i18next';

import { cn } from '@/lib';

import { Button, Icon, MediaItem, Row, Spinner } from '@/components/commons';

import { TITLE_MAX_CHARS } from '../VideoEntry/constants';
import type { CropJobRowProps } from './types';

export type * from './types';

export function CropJobRow({ job, onRetry, onDismiss, className = '', ...props }: CropJobRowProps) {
  const { t } = useTranslation();
  const failed = job.status === 'error';

  return (
    <MediaItem
      title={job.title}
      titleMaxChars={TITLE_MAX_CHARS}
      meta={failed ? t('list.cropFailed') : t('list.cropping')}
      description={job.errorKey ? t(job.errorKey) : undefined}
      leading={
        <Row justify="center" className="flex-1">
          {failed ? <Icon name="alert-circle-outline" size={22} tone="danger" /> : <Spinner />}
        </Row>
      }
      footer={
        failed ? (
          <Row gap={20}>
            <Button
              variant="text"
              icon="refresh"
              title={t('common.tryAgain')}
              onPress={() => onRetry(job.id)}
            />
            <Button variant="text" title={t('common.dismiss')} onPress={() => onDismiss(job.id)} />
          </Row>
        ) : null
      }
      accessible={false}
      disabled
      className={cn('px-5', className)}
      {...props}
    />
  );
}
