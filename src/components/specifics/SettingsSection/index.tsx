import { Children, Fragment } from 'react';

import { Divider, Section } from '@/components/commons';

import type { SettingsSectionProps } from './types';

export type * from './types';

export function SettingsSection({ title, children, ...props }: SettingsSectionProps) {
  const rows = Children.toArray(children);

  return (
    <Section title={title} {...props}>
      <Divider className="-mx-5" />
      {rows.map((row, index) => (
        <Fragment key={index}>
          {row}
          <Divider className="-mx-5" />
        </Fragment>
      ))}
    </Section>
  );
}
