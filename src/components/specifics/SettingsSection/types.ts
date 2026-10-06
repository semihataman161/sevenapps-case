import type { SectionProps } from '@/components/commons';

export type SettingsSectionProps = Omit<SectionProps, 'title'> & {
  title: string;
};
