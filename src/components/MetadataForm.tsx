import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, type Control } from 'react-hook-form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '@/lib/constants';
import { useThemeColors } from '@/lib/theme';
import {
  metadataSchema,
  type MetadataFormValues,
  type ValidationMessageKey,
} from '@/lib/validation';

import { Button } from './ui/Button';

type MetadataFormProps = {
  defaultValues?: Partial<MetadataFormValues>;
  submitLabel: string;
  submitIcon?: Parameters<typeof Button>[0]['icon'];
  onSubmit: (values: MetadataFormValues) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
};

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

type FieldProps = TextInputProps & {
  control: Control<MetadataFormValues>;
  name: keyof MetadataFormValues;
  label: string;
  maxLength: number;
};

function Field({ control, name, label, maxLength, multiline, ...inputProps }: FieldProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View>
          <View className="mb-2 flex-row items-end justify-between">
            <Text className="text-sm font-semibold text-ink dark:text-white">{label}</Text>
            <Text className="text-xs text-ink-muted">
              {value?.length ?? 0}/{maxLength}
            </Text>
          </View>
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            placeholderTextColor={colors.muted}
            accessibilityLabel={label}
            className={`rounded-2xl border bg-surface-muted px-4 text-base text-ink dark:bg-surface-dark-muted dark:text-white ${
              multiline ? 'min-h-32 py-3.5' : 'h-14'
            } ${error ? 'border-red-500' : 'border-transparent'}`}
            {...inputProps}
          />
          {error ? (
            <Text className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {t(error.message as ValidationMessageKey, { min: NAME_MIN_LENGTH, max: maxLength })}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
