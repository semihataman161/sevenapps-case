import { useTranslation } from 'react-i18next';

import { cn } from '@/lib';

import { Stepper } from '@/components/commons';

import { STEPS } from './constants';
import type { StepIndicatorProps } from './types';

export type * from './types';

export function StepIndicator({ step, className = '', ...props }: StepIndicatorProps) {
  const { t } = useTranslation();
  const labels = STEPS.map((key) => t(`crop.steps.${key}`));

  return (
    <Stepper steps={labels} current={step} className={cn('px-5 pb-6 pt-2', className)} {...props} />
  );
}
