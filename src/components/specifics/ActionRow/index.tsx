import { Divider, Icon, Row, Spinner, Touchable, Typography } from '@/components/commons';

import type { ActionRowProps } from './types';

export type * from './types';

export function ActionRow({
  label,
  icon,
  tone = 'default',
  loading = false,
  disabled,
  className = '',
  ...props
}: ActionRowProps) {
  const isDisabled = !!disabled || loading;
  const textTone = tone === 'danger' ? 'danger' : 'default';

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={`${isDisabled ? 'opacity-40' : ''} ${className}`}
      {...props}
    >
      <Row justify="between" className="h-16">
        <Typography variant="action" tone={textTone}>
          {label}
        </Typography>
        {loading ? (
          <Spinner tone={tone === 'danger' ? 'accent' : 'default'} />
        ) : (
          <Icon name={icon} tone={textTone} />
        )}
      </Row>
      <Divider />
    </Touchable>
  );
}
