import type { IconName } from '@/types';

export type OptionRowProps = {
  label: string;
  hint?: string;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
};
