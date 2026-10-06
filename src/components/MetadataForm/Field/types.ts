import type { Control } from 'react-hook-form';
import type { TextInputProps } from 'react-native';

import type { MetadataFormValues } from '@/lib';

export type FieldProps = TextInputProps & {
  control: Control<MetadataFormValues>;
  name: keyof MetadataFormValues;
  label: string;
  maxLength: number;
};
