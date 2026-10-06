import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  DESCRIPTION_MAX_LENGTH,
  metadataSchema,
  NAME_MAX_LENGTH,
  type MetadataFormValues,
} from '@/lib';

import { Button } from '../ui';
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
    <View className="gap-5">
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
          <Text className="text-sm text-red-600 dark:text-red-400">{submitError}</Text>
        </Animated.View>
      ) : null}

      <Button
        title={submitLabel}
        icon={submitIcon}
        loading={isSubmitting}
        disabled={formState.isSubmitted && !formState.isValid}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
