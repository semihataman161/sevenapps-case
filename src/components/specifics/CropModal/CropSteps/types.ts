import type { CropStep } from '../../StepIndicator';

export type CropStepsProps = {
  step: CropStep;
  onStepChange: (step: CropStep) => void;
  onSaved: (videoId: string) => void;
};
