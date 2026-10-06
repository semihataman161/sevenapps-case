import { Controller } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { NAME_MIN_LENGTH, useThemeColors, type ValidationMessageKey } from '@/lib';

import type { FieldProps } from './types';

export type * from './types';

export function Field({ control, name, label, maxLength, multiline, ...inputProps }: FieldProps) {
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
