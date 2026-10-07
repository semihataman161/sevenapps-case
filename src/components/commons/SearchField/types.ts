import type { InputProps } from '../Input';

export type SearchFieldProps = Omit<
  InputProps,
  'leading' | 'trailing' | 'value' | 'defaultValue' | 'onChangeText'
> & {
  onSearch: (query: string) => void;
  clearLabel: string;
  initialQuery?: string;
  debounceMs?: number;
};
