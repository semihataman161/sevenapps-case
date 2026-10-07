import type { ReactNode } from 'react';

export type SheetPanelProps = {
  visible: boolean;
  dismissible: boolean;
  header?: ReactNode;
  className?: string;
  children?: ReactNode;
  onClose: () => void;
  onHidden: () => void;
};
