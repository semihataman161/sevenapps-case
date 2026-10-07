import { Row, Typography } from '@/components/commons';

import type { InfoRowProps } from './types';

export type * from './types';

export function InfoRow({ label, value, className = '', ...props }: InfoRowProps) {
  return (
    <Row justify="between" className={`min-h-14 py-4 ${className}`} {...props}>
      <Typography>{label}</Typography>
      <Typography tone="secondary" tabular>
        {value}
      </Typography>
    </Row>
  );
}
