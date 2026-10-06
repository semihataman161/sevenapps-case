import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Row, Typography } from '@/components/commons';
import { useUpperCase } from '@/i18n';

import { StepDot } from './StepDot';
import type { StepIndicatorProps } from './types';

export type * from './types';

const STEPS = ['select', 'trim', 'details'] as const;

export function StepIndicator({ step, className = '', ...props }: StepIndicatorProps) {
  const { t } = useTranslation();
  const upper = useUpperCase();

  return (
    <View className={`px-5 pb-2 pt-3 ${className}`} {...props}>
      <Row gap={8} className="mb-2">
        {STEPS.map((key, index) => (
          <StepDot key={key} active={index <= step} />
        ))}
      </Row>
      <Typography variant="overline" tone="muted">
        {upper(
          t('crop.stepLabel', {
            current: step + 1,
            total: STEPS.length,
            label: t(`crop.steps.${STEPS[step]}`),
          }),
        )}
      </Typography>
    </View>
  );
}
