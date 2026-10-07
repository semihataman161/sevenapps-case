import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider } from '../Divider';
import { Row } from '../Row';
import { Typography } from '../Typography';
import type { PageHeaderProps } from './types';

export type * from './types';

export function PageHeader({
  title,
  meta,
  topAction,
  action,
  className = '',
  style,
  ...props
}: PageHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className={className} style={[{ paddingTop: insets.top + 8 }, style]} {...props}>
      <Row justify="between" className="h-12">
        <View>{meta}</View>
        {topAction}
      </Row>

      <Row justify="between" gap={16} className="mb-6 mt-8">
        <Typography
          variant="headline"
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          className="shrink"
        >
          {title}
        </Typography>
        {action}
      </Row>
      <Divider />
    </View>
  );
}
