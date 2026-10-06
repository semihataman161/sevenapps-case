import type { ReactNode } from 'react';
import type { ModalProps } from 'react-native';

export type SheetProps = Omit<
  ModalProps,
  'visible' | 'onRequestClose' | 'animationType' | 'presentationStyle' | 'transparent'
> & {
  visible: boolean;
  onClose: () => void;
  onBackPress?: () => void;
  header?: ReactNode;
  dismissible?: boolean;
  className?: string;
};
