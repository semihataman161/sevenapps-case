import type { TouchableProps } from '@/components/commons';

import type { IconName } from '@/types';

export type ActionRowTone = 'default' | 'danger';

export type ActionRowProps = Omit<TouchableProps, 'children'> & {
  label: string;
  icon: IconName;
  tone?: ActionRowTone;
  loading?: boolean;
};
