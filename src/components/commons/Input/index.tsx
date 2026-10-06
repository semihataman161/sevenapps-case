import { TextInput } from 'react-native';

import { useThemeColors } from '@/lib';

import type { InputProps } from './types';

export type * from './types';

export function Input({ invalid = false, multiline, className = '', ...props }: InputProps) {
  const colors = useThemeColors();

  return (
    <TextInput
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor={colors.muted}
      className={`rounded-2xl border bg-surface-muted px-4 text-base text-ink dark:bg-surface-dark-muted dark:text-white ${
        multiline ? 'min-h-32 py-3.5' : 'h-14'
      } ${invalid ? 'border-red-500' : 'border-transparent'} ${className}`}
      {...props}
    />
  );
}
