import { useState } from 'react';
import { TextInput } from 'react-native';

import { useThemeColors } from '@/lib';

import { ruleClasses, textStyle } from './styles';
import type { InputProps } from './types';

export type * from './types';

export function Input({
  invalid = false,
  multiline,
  className = '',
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);
  const ruleClass = ruleClasses[invalid ? 'invalid' : focused ? 'focused' : 'idle'];

  return (
    <TextInput
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor={colors.muted}
      selectionColor={colors.accent}
      cursorColor={colors.text}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      className={`border-b py-2.5 text-ink dark:text-ink-dark ${multiline ? 'min-h-24' : ''} ${ruleClass} ${className}`}
      style={[textStyle, style]}
      {...props}
    />
  );
}
