import type { ViewProps } from 'react-native';

import type { TypographyVariant, TypographyWeight } from '../Typography';

export type FormFieldProps = ViewProps & {
  label: string;
  counter?: string;
  error?: string | null;
  labelVariant?: TypographyVariant;
  labelWeight?: TypographyWeight;
  counterVariant?: TypographyVariant;
  errorVariant?: TypographyVariant;
  className?: string;
};
