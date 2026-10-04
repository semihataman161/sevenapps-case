import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const STEPS = ['Select', 'Trim', 'Details'] as const;

function StepDot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    flex: withTiming(active ? 2 : 1, { duration: 250 }),
    opacity: withTiming(active ? 1 : 0.35, { duration: 250 }),
  }));
  return <Animated.View style={style} className="h-1.5 rounded-full bg-accent" />;
}

export function StepIndicator({ step }: { step: 0 | 1 | 2 }) {
  return (
    <View className="px-5 pb-2 pt-3">
      <View className="mb-2 flex-row gap-2">
        {STEPS.map((label, index) => (
          <StepDot key={label} active={index <= step} />
        ))}
      </View>
      <Text className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        Step {step + 1} of {STEPS.length} · {STEPS[step]}
      </Text>
    </View>
  );
}
