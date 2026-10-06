import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  DESCRIPTION_MAX_LENGTH,
  metadataSchema,
  NAME_MAX_LENGTH,
  type MetadataFormValues,
} from '@/lib';

import { Button, Stack, Typography } from '@/components/commons';
import { Field } from './Field';
import type { MetadataFormProps } from './types';

export type * from './types';

export function MetadataForm({
  defaultValues,
  submitLabel,
  submitIcon,
  onSubmit,
  isSubmitting = false,
  submitError,
}: MetadataFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, formState } = useForm<MetadataFormValues>({
    resolver: yupResolver(metadataSchema),
    defaultValues: { name: '', description: '', ...defaultValues },
    mode: 'onTouched',
  });

  return (
    <Stack gap={20}>
      <Field
        control={control}
        name="name"
        label={t('form.name')}
        placeholder={t('form.namePlaceholder')}
        maxLength={NAME_MAX_LENGTH}
        returnKeyType="next"
        editable={!isSubmitting}
      />
      <Field
        control={control}
        name="description"
        label={t('form.description')}
        placeholder={t('form.descriptionPlaceholder')}
        maxLength={DESCRIPTION_MAX_LENGTH}
        multiline
        editable={!isSubmitting}
      />

      {submitError ? (
        <Animated.View
          entering={FadeIn}
          className="rounded-2xl bg-red-50 px-4 py-3 dark:bg-red-950"
          accessibilityLiveRegion="polite"
        >
          <Typography variant="label" tone="danger">
            {submitError}
          </Typography>
        </Animated.View>
      ) : null}

      <Button
        title={submitLabel}
        icon={submitIcon}
        loading={isSubmitting}
        disabled={formState.isSubmitted && !formState.isValid}
        onPress={handleSubmit(onSubmit)}
      />
    </Stack>
  );
}
