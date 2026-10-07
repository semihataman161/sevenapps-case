import type { PageHeaderProps } from '@/components/commons';

export type ArchiveHeaderProps = Omit<
  PageHeaderProps,
  'title' | 'meta' | 'topAction' | 'action'
> & {
  count: number;
  onNewClip: () => void;
  onOpenSettings: () => void;
};
