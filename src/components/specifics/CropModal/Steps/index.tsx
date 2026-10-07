import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useCropDraftStore, usePick } from '@/stores';

import { DetailsStep } from './DetailsStep';
import { PickerStep } from './PickerStep';
import { TrimStep } from './TrimStep';
import type { StepsProps } from './types';

export type * from './types';

export function Steps({ step, onStepChange, onComplete }: StepsProps) {
  const { source, reset } = usePick(useCropDraftStore, ['source', 'reset']);

  useEffect(() => reset, [reset]);

  return (
    <View className="flex-1">
      {step === 0 || !source ? (
        <Animated.View entering={FadeIn.duration(200)} className="flex-1">
          <PickerStep onPicked={() => onStepChange(1)} />
        </Animated.View>
      ) : (
        <>
          <Animated.View
            entering={FadeIn.duration(200)}
            className="flex-1"
            style={step === 1 ? undefined : { display: 'none' }}
            pointerEvents={step === 1 ? 'auto' : 'none'}
          >
            <TrimStep source={source} active={step === 1} onNext={() => onStepChange(2)} />
          </Animated.View>
          {step === 2 ? (
            <Animated.View entering={FadeIn.duration(200)} className="flex-1">
              <DetailsStep source={source} onComplete={onComplete} />
            </Animated.View>
          ) : null}
        </>
      )}
    </View>
  );
}
