import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useUpperCase } from '@/i18n/useUpperCase';

const STEPS = ['select', 'trim', 'details'] as const;

function StepDot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    flex: withTiming(active ? 2 : 1, { duration: 250 }),
    opacity: withTiming(active ? 1 : 0.35, { duration: 250 }),
  }));
  return <Animated.View style={style} className="h-1.5 rounded-full bg-accent" />;
}

export function StepIndicator({ step }: { step: 0 | 1 | 2 }) {
  const { t } = useTranslation();
  const upper = useUpperCase();
  return (
    <View className="px-5 pb-2 pt-3">
      <View className="mb-2 flex-row gap-2">
        {STEPS.map((key, index) => (
          <StepDot key={key} active={index <= step} />
        ))}
      </View>
      <Text className="text-xs font-semibold tracking-wider text-ink-muted">
        {upper(
          t('crop.stepLabel', {
            current: step + 1,
            total: STEPS.length,
            label: t(`crop.steps.${STEPS[step]}`),
          }),
        )}
      </Text>
    </View>
  );
}
