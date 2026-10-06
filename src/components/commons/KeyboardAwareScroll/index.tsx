import { useEffect, useState } from 'react';
import { Keyboard, Platform, ScrollView, View } from 'react-native';

import type { KeyboardAwareScrollProps } from './types';

export type * from './types';

export function KeyboardAwareScroll({
  children,
  contentContainerClassName = '',
  ...props
}: KeyboardAwareScrollProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscriptions = [
      Keyboard.addListener('keyboardDidShow', (event) =>
        setKeyboardHeight(event.endCoordinates.height),
      ),
      Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0)),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName={contentContainerClassName}
      {...props}
    >
      {children}
      <View style={{ height: keyboardHeight }} />
    </ScrollView>
  );
}
