import type { PressableProps } from 'react-native';

import type { IconName } from '@/types';

export type OptionRowProps = Omit<PressableProps, 'children'> & {
  label: string;
  hint?: string;
  icon?: IconName;
  selected: boolean;
  className?: string;
};
