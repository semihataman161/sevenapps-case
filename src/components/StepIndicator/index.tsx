import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useUpperCase } from '@/i18n';

import { StepDot } from './StepDot';
import type { StepIndicatorProps } from './types';

export type * from './types';

const STEPS = ['select', 'trim', 'details'] as const;

export function StepIndicator({ step }: StepIndicatorProps) {
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
