import { View } from 'react-native';

import { Typography } from '../Typography';
import type { SectionProps } from './types';

export type * from './types';

export function Section({
  title,
  titleVariant = 'overline',
  titleTone = 'muted',
  titleWeight,
  className = '',
  children,
  ...props
}: SectionProps) {
  return (
    <View className={className} {...props}>
      {title ? (
        <Typography
          variant={titleVariant}
          tone={titleTone}
          weight={titleWeight}
          className="mb-2 ml-4"
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </View>
  );
}
