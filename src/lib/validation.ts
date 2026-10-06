import * as yup from 'yup';

import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from './constants';

export const metadataSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('validation.nameRequired')
    .min(NAME_MIN_LENGTH, 'validation.nameMin')
    .max(NAME_MAX_LENGTH, 'validation.nameMax'),
  description: yup
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, 'validation.descriptionMax')
    .default(''),
});

export type ValidationMessageKey =
  | 'validation.nameRequired'
  | 'validation.nameMin'
  | 'validation.nameMax'
  | 'validation.descriptionMax';

export type MetadataFormValues = yup.InferType<typeof metadataSchema>;
