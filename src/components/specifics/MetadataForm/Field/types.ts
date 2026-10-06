import type { Control } from 'react-hook-form';

import type { InputProps } from '@/components/commons';
import type { MetadataFormValues } from '@/lib';

export type FieldProps = Omit<InputProps, 'value' | 'onChangeText' | 'onBlur' | 'invalid'> & {
  control: Control<MetadataFormValues>;
  name: keyof MetadataFormValues;
  label: string;
  maxLength: number;
};
