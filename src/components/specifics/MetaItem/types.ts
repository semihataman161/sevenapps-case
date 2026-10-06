import type { RowProps } from '@/components/commons';
import type { IconName } from '@/types';

export type MetaItemProps = Omit<RowProps, 'children'> & {
  icon: IconName;
  text: string;
};
