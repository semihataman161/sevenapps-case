import type { ViewProps } from 'react-native';

import type { IconName } from '@/types';

import type { IconTone } from '../Icon';

export type IconBadgeProps = ViewProps & {
  icon: IconName;
  iconSize?: number;
  iconTone?: IconTone;
  className?: string;
};
