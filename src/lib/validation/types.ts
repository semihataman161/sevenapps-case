export type MetadataFormValues = {
  name: string;
  description: string;
};

export type ValidationMessageKey =
  | 'validation.nameRequired'
  | 'validation.nameMin'
  | 'validation.nameMax'
  | 'validation.descriptionMax';
