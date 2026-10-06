import type { TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  invalid?: boolean;
  className?: string;
};
