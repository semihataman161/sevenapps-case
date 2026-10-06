import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, Input } from '@/components/commons';
import { NAME_MIN_LENGTH, type ValidationMessageKey } from '@/lib';

import type { FieldProps } from './types';

export type * from './types';

export function Field({ control, name, label, maxLength, ...props }: FieldProps) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <FormField
          label={label}
          counter={`${value?.length ?? 0}/${maxLength}`}
          error={
            error
              ? t(error.message as ValidationMessageKey, { min: NAME_MIN_LENGTH, max: maxLength })
              : null
          }
        >
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            invalid={!!error}
            accessibilityLabel={label}
            {...props}
          />
        </FormField>
      )}
    />
  );
}
