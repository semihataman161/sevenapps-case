import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconTone = 'default' | 'secondary' | 'muted' | 'accent' | 'danger' | 'inverse';

export type IconProps = Omit<ComponentProps<typeof Ionicons>, 'color'> & {
  tone?: IconTone;
  color?: string;
};
