import * as yup from 'yup';

import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from './constants';

export const metadataSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Give your clip a name')
    .min(2, 'Name must be at least 2 characters')
    .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`),
  description: yup
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`)
    .default(''),
});

export type MetadataFormValues = yup.InferType<typeof metadataSchema>;
