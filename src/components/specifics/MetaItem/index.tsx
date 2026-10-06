import { Icon, Row, Typography } from '@/components/commons';

import type { MetaItemProps } from './types';

export type * from './types';

export function MetaItem({ icon, text, ...props }: MetaItemProps) {
  return (
    <Row gap={4} {...props}>
      <Icon name={icon} size={14} tone="muted" />
      <Typography variant="label" tone="muted">
        {text}
      </Typography>
    </Row>
  );
}
