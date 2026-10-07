import { useState } from 'react';
import { Modal } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type { SheetProps } from '../types';
import { SheetPanel } from './SheetPanel';

export function BottomSheet({
  visible,
  onClose,
  onBackPress,
  header,
  dismissible = true,
  className = '',
  children,
  ...props
}: SheetProps) {
  const [isMounted, setIsMounted] = useState(visible);

  if (visible && !isMounted) setIsMounted(true);

  const handleHidden = () => setIsMounted(false);

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onBackPress ?? onClose}
      {...props}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SheetPanel
          visible={visible}
          dismissible={dismissible}
          header={header}
          className={className}
          onClose={onClose}
          onHidden={handleHidden}
        >
          {children}
        </SheetPanel>
      </GestureHandlerRootView>
    </Modal>
  );
}
