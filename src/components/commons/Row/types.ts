import type { ViewProps } from 'react-native';

export type RowAlign = 'start' | 'center' | 'end' | 'stretch';

export type RowJustify = 'start' | 'center' | 'end' | 'between';

export type RowProps = ViewProps & {
  gap?: number;
  align?: RowAlign;
  justify?: RowJustify;
  className?: string;
};
