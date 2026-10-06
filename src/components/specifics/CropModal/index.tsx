import { useIsMutating } from '@tanstack/react-query';
import { useImperativeHandle, useState } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CLIP_DURATION } from '@/lib';

import { Header, Sheet, TextButton } from '@/components/commons';
import { StepIndicator, type CropStep } from '../StepIndicator';
import { CropSteps } from './CropSteps';
import type { CropModalProps, CropModalRef } from './types';

export type * from './types';

export function CropModal({ ref, onSaved, ...props }: CropModalProps) {
  const { t } = useTranslation();
  const isCropping = useIsMutating({ mutationKey: ['videos', 'crop'] }) > 0;
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

  const titles: Record<CropStep, string> = {
    0: t('nav.newClip'),
    1: t('nav.chooseSeconds', { seconds: CLIP_DURATION }),
    2: t('nav.addDetails'),
  };

  const goBack = () => {
    if (!isCropping && step > 0) setStep((step - 1) as CropStep);
  };

  const handleRequestClose = () => {
    if (Platform.OS === 'android' && step > 0) goBack();
    else hide();
  };

  const handleSaved = (videoId: string) => {
    setIsVisible(false);
    onSaved?.(videoId);
  };

  return (
    <Sheet
      visible={isVisible}
      dismissible={!isCropping}
      onRequestClose={handleRequestClose}
      {...props}
    >
      <Header
        title={titles[step]}
        left={
          step === 0 ? (
            <TextButton title={t('common.cancel')} onPress={hide} />
          ) : (
            <TextButton
              title={t('common.back')}
              icon="chevron-back"
              disabled={isCropping}
              onPress={goBack}
              className="-ml-1.5"
            />
          )
        }
      />
      <StepIndicator step={step} />
      <CropSteps step={step} onStepChange={setStep} onSaved={handleSaved} />
    </Sheet>
  );
}
