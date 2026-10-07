import type { PageHeaderProps } from '@/components/commons';

export type VideoListHeaderProps = Omit<
  PageHeaderProps,
  'title' | 'meta' | 'topAction' | 'action' | 'footer'
> & {
  count: number;
  onNewClip: () => void;
  onOpenSettings: () => void;
  initialQuery?: string;
  onSearch?: (query: string) => void;
};
