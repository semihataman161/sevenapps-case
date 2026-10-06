import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import type { KeyboardAwareScrollProps } from './types';

export type * from './types';

export function KeyboardAwareScroll({
  children,
  contentContainerClassName = '',
  ...rest
}: KeyboardAwareScrollProps) {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={contentContainerClassName}
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
