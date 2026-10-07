import { Modal, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn, useThemeColors } from '@/lib';

import type { SheetProps } from '../types';

export function PageSheet({
  visible,
  onClose,
  onBackPress,
  header,
  dismissible = true,
  className = '',
  children,
  ...props
}: SheetProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      allowSwipeDismissal={dismissible}
      onRequestClose={onClose}
      {...props}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className={cn('flex-1', className)} style={{ backgroundColor: colors.paper }}>
          <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            {header}
            {children}
          </SafeAreaView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
