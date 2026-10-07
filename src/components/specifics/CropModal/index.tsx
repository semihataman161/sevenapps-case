import { useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsCropping } from '@/hooks';

import { Button, Header, Sheet } from '@/components/commons';
import { StepIndicator, type CropStep } from '../StepIndicator';
import { Steps } from './Steps';
import type { CropModalProps, CropModalRef } from './types';

export type * from './types';

export function CropModal({ ref, ...props }: CropModalProps) {
  const { t } = useTranslation();
  const isCropping = useIsCropping();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<CropStep>(0);

  const show: CropModalRef['show'] = () => {
    setStep(0);
    setIsVisible(true);
  };

  const hide: CropModalRef['hide'] = () => {
    if (!isCropping) setIsVisible(false);
  };

  useImperativeHandle(ref, () => ({ show, hide }));

  const goBack = () => {
    if (!isCropping && step > 0) setStep((step - 1) as CropStep);
  };

  const handleBackPress = () => {
    if (step > 0) goBack();
    else hide();
  };

  const handleComplete = () => setIsVisible(false);

  const header = (
    <Header
      className="px-5"
      title={t('nav.newClip')}
      left={
        step > 0 ? (
          <Button
            variant="text"
            title={t('common.back')}
            icon="arrow-back"
            disabled={isCropping}
            onPress={goBack}
          />
        ) : null
      }
    />
  );

  return (
    <Sheet
      visible={isVisible}
      dismissible={!isCropping}
      header={header}
      onClose={hide}
      onBackPress={handleBackPress}
      {...props}
    >
      <StepIndicator step={step} />
      <Steps step={step} onStepChange={setStep} onComplete={handleComplete} />
    </Sheet>
  );
}
