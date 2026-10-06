import type { ButtonProps } from '@/components/commons';

export type HeaderBackButtonProps = Omit<ButtonProps, 'title' | 'variant'> & {
  title?: string;
  canGoBack?: boolean;
};
