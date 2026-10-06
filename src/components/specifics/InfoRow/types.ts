import type { RowProps } from '@/components/commons';

export type InfoRowProps = Omit<RowProps, 'children'> & {
  label: string;
  value: string;
};
