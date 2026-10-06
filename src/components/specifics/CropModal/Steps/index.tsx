import { useEffect } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useCropDraftStore } from '@/store';

import { DetailsStep } from './DetailsStep';
import { PickerStep } from './PickerStep';
import { TrimStep } from './TrimStep';
import type { StepsProps } from './types';

export type * from './types';

export function Steps({ step, onStepChange, onComplete }: StepsProps) {
  const source = useCropDraftStore((s) => s.source);
  const reset = useCropDraftStore((s) => s.reset);

  useEffect(() => reset, [reset]);

  return (
    <Animated.View key={source ? step : 0} entering={FadeIn.duration(200)} className="flex-1">
      {step === 0 || !source ? (
        <PickerStep onPicked={() => onStepChange(1)} />
      ) : step === 1 ? (
        <TrimStep source={source} onNext={() => onStepChange(2)} />
      ) : (
        <DetailsStep source={source} onComplete={onComplete} />
      )}
    </Animated.View>
  );
}
