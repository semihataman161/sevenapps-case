import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { cn, useThemeColors } from '@/lib';

import { ruleClasses, textStyle } from './styles';
import type { InputProps } from './types';

export type * from './types';

export function Input({
  invalid = false,
  multiline,
  leading,
  trailing,
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
    <View
      className={cn(
        'flex-row gap-2 border-b',
        multiline ? 'items-start' : 'items-center',
        ruleClass,
        className,
      )}
    >
      {leading}
      <TextInput
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.muted}
        selectionColor={colors.accent}
        cursorColor={colors.ink}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={cn('flex-1 py-2.5 text-ink', multiline && 'min-h-24')}
        style={[textStyle, style]}
        {...props}
      />
      {trailing}
    </View>
  );
}
