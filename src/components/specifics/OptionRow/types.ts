import type { TouchableProps } from '@/components/commons';

export type OptionRowProps = Omit<TouchableProps, 'children'> & {
  label: string;
  hint?: string;
  selected: boolean;
};
