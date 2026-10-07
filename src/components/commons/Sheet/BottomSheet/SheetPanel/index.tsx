import { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useThemeColors } from '@/lib';

import type { SheetPanelProps } from './types';

export type * from './types';

const TOP_GAP = 40;
const CORNER_RADIUS = 24;
const ANIMATION_MS = 280;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 1000;

export function SheetPanel({
  visible,
  dismissible,
  header,
  className = '',
  children,
  onClose,
  onHidden,
}: SheetPanelProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.set(withTiming(0, { duration: ANIMATION_MS }));
      return;
    }
    translateY.set(
      withTiming(height, { duration: ANIMATION_MS }, (finished) => {
        if (finished) scheduleOnRN(onHidden);
      }),
    );
  }, [visible, height, translateY, onHidden]);

  const pan = Gesture.Pan()
    .enabled(dismissible)
    .activeOffsetY(8)
    .onUpdate((event) => {
      translateY.set(Math.max(0, event.translationY));
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY) {
        scheduleOnRN(onClose);
      } else {
        translateY.set(withTiming(0, { duration: ANIMATION_MS }));
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [0, height], [1, 0], Extrapolation.CLAMP),
  }));
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        entering={FadeIn.duration(ANIMATION_MS)}
        pointerEvents="none"
        className="absolute inset-0"
      >
        <Animated.View style={backdropStyle} className="flex-1 bg-black/50" />
      </Animated.View>
      <Animated.View
        entering={SlideInDown.duration(ANIMATION_MS)}
        style={{ flex: 1, marginTop: insets.top + TOP_GAP }}
      >
        <Animated.View
          className={className}
          style={[
            {
              flex: 1,
              backgroundColor: colors.background,
              borderTopLeftRadius: CORNER_RADIUS,
              borderTopRightRadius: CORNER_RADIUS,
              overflow: 'hidden',
            },
            panelStyle,
          ]}
        >
          <GestureDetector gesture={pan}>
            <View>
              <View className="items-center pb-1 pt-2">
                <View
                  className="h-1 w-10 rounded-full"
                  style={{ backgroundColor: colors.border }}
                />
              </View>
              {header}
            </View>
          </GestureDetector>
          <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            {children}
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
