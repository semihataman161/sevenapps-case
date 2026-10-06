import * as yup from 'yup';

import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../constants';
import type { MetadataFormValues } from './types';

export type * from './types';

export const metadataSchema: yup.ObjectSchema<MetadataFormValues> = yup.object({
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
