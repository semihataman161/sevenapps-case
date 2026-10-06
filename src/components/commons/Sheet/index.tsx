import { Modal, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SheetProps } from './types';

export type * from './types';

export function Sheet({ children, dismissible = true, className = '', ...props }: SheetProps) {
  return (
    <Modal
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}
      allowSwipeDismissal={dismissible}
      statusBarTranslucent
      navigationBarTranslucent
      {...props}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className={`flex-1 bg-surface dark:bg-surface-dark ${className}`}>
          <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
            {children}
          </SafeAreaView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
