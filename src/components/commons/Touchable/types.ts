import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export type TouchableProps = Omit<PressableProps, 'children' | 'style'> & {
  children?: ReactNode;
  pressedOpacity?: number;
  pressedScale?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};
