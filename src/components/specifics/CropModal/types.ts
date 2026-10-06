import type { Ref } from 'react';

import type { SheetProps } from '@/components/commons';

export type CropModalRef = {
  show: () => void;
  hide: () => void;
};

export type CropModalProps = Omit<
  SheetProps,
  'children' | 'visible' | 'dismissible' | 'header' | 'onClose' | 'onBackPress'
> & {
  ref?: Ref<CropModalRef>;
};
