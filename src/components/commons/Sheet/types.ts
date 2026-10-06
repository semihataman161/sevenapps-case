import type { ModalProps } from 'react-native';

export type SheetProps = ModalProps & {
  dismissible?: boolean;
  className?: string;
};
