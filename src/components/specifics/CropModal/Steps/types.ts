import type { CropStep } from '../../StepIndicator';

export type StepsProps = {
  step: CropStep;
  onStepChange: (step: CropStep) => void;
  onComplete: () => void;
};
