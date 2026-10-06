import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export type PressableScaleProps = Omit<PressableProps, 'children' | 'style'> & {
  children?: ReactNode;
  pressedScale?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};
