import { View } from 'react-native';

import { Row } from '../Row';
import { Typography } from '../Typography';
import type { HeaderProps } from './types';

export type * from './types';

export function Header({
  title,
  left,
  right,
  titleVariant = 'action',
  titleWeight,
  className = '',
  ...props
}: HeaderProps) {
  return (
    <Row gap={8} className={`h-12 ${className}`} {...props}>
      <View className="flex-1 items-start">{left}</View>
      <Typography
        variant={titleVariant}
        weight={titleWeight}
        numberOfLines={1}
        accessibilityRole="header"
        className="shrink text-center"
      >
        {title}
      </Typography>
      <View className="flex-1 items-end">{right}</View>
    </Row>
  );
}
