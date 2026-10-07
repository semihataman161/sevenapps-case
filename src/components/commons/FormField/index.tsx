import { View } from 'react-native';

import { Row } from '../Row';
import { Typography } from '../Typography';
import type { FormFieldProps } from './types';

export type * from './types';

export function FormField({
  label,
  counter,
  error,
  labelVariant = 'overline',
  labelWeight,
  counterVariant = 'caption',
  errorVariant = 'caption',
  className = '',
  children,
  ...props
}: FormFieldProps) {
  return (
    <View className={className} {...props}>
      <Row justify="between" align="end">
        <Typography variant={labelVariant} weight={labelWeight} tone="secondary">
          {label}
        </Typography>
        {counter ? (
          <Typography variant={counterVariant} tone="muted" tabular>
            {counter}
          </Typography>
        ) : null}
      </Row>
      {children}
      {error ? (
        <Typography variant={errorVariant} tone="danger" className="mt-2">
          {error}
        </Typography>
      ) : null}
    </View>
  );
}
