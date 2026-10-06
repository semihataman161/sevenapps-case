import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import type { KeyboardAwareScrollProps } from './types';

export type * from './types';

export function KeyboardAwareScroll({
  children,
  contentContainerClassName = '',
  ...props
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
        {...props}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
