import { useEffect, useState } from 'react';
import { Modal, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useThemeColors } from '@/lib';

import type { SheetProps } from '../types';

const TOP_GAP = 40;
const CORNER_RADIUS = 24;
const ANIMATION_MS = 280;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 1000;

export function BottomSheet({
  visible,
  onClose,
  onBackPress,
  header,
  dismissible = true,
  className = '',
  children,
  ...props
}: SheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useSharedValue(height);

  if (visible && !isMounted) setIsMounted(true);

  useEffect(() => {
    if (!isMounted) return;
    if (visible) {
      translateY.set(withTiming(0, { duration: ANIMATION_MS }));
      return;
    }
    translateY.set(
      withTiming(height, { duration: ANIMATION_MS }, (finished) => {
        if (finished) scheduleOnRN(setIsMounted, false);
      }),
    );
  }, [visible, isMounted, height, translateY]);

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
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onBackPress ?? onClose}
      {...props}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          pointerEvents="none"
          style={backdropStyle}
          className="absolute inset-0 bg-black/50"
        />
        <Animated.View
          className={className}
          style={[
            {
              flex: 1,
              marginTop: insets.top + TOP_GAP,
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
      </GestureHandlerRootView>
    </Modal>
  );
}
