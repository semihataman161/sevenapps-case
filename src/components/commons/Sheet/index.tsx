import { Platform } from 'react-native';

import { BottomSheet } from './BottomSheet';
import { PageSheet } from './PageSheet';
import type { SheetProps } from './types';

export type * from './types';

export function Sheet(props: SheetProps) {
  return Platform.OS === 'ios' ? <PageSheet {...props} /> : <BottomSheet {...props} />;
}
