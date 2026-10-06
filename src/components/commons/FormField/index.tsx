import { View } from 'react-native';

import { Row } from '../Row';
import { Typography } from '../Typography';
import type { FormFieldProps } from './types';

export type * from './types';

export function FormField({
  label,
  counter,
  error,
  labelVariant = 'label',
  labelWeight = 'semibold',
  counterVariant = 'caption',
  errorVariant = 'label',
  className = '',
  children,
  ...props
}: FormFieldProps) {
  return (
    <View className={className} {...props}>
      <Row justify="between" align="end" className="mb-2">
        <Typography variant={labelVariant} weight={labelWeight}>
          {label}
        </Typography>
        {counter ? (
          <Typography variant={counterVariant} tone="muted">
            {counter}
          </Typography>
        ) : null}
      </Row>
      {children}
      {error ? (
        <Typography variant={errorVariant} tone="danger" className="mt-1.5">
          {error}
        </Typography>
      ) : null}
    </View>
  );
}
