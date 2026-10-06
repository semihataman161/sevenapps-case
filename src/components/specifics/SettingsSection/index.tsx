import { Children, Fragment } from 'react';

import { Card, Divider, Section } from '@/components/commons';
import { useUpperCase } from '@/i18n';

import type { SettingsSectionProps } from './types';

export type * from './types';

export function SettingsSection({ title, children, ...props }: SettingsSectionProps) {
  const upper = useUpperCase();
  const rows = Children.toArray(children);

  return (
    <Section title={upper(title)} {...props}>
      <Card className="overflow-hidden">
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <Divider className="ml-4" /> : null}
            {row}
          </Fragment>
        ))}
      </Card>
    </Section>
  );
}
