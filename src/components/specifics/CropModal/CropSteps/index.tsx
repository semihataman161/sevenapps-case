import { useEffect } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useCropDraftStore } from '@/store';

import { TrimEditor } from '../../TrimEditor';
import { DetailsStep } from '../DetailsStep';
import { SourcePicker } from '../SourcePicker';
import type { CropStepsProps } from './types';

export type * from './types';

export function CropSteps({ step, onStepChange, onSaved }: CropStepsProps) {
  const source = useCropDraftStore((s) => s.source);
  const reset = useCropDraftStore((s) => s.reset);

  useEffect(() => reset, [reset]);

  return (
    <Animated.View key={source ? step : 0} entering={FadeIn.duration(200)} className="flex-1">
      {step === 0 || !source ? (
        <SourcePicker onPicked={() => onStepChange(1)} />
      ) : step === 1 ? (
        <TrimEditor source={source} onNext={() => onStepChange(2)} />
      ) : (
        <DetailsStep source={source} onSaved={onSaved} />
      )}
    </Animated.View>
  );
}
