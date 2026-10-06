import type { MetadataFormValues } from '@/lib';
import type { IconName } from '@/types';

export type MetadataFormProps = {
  defaultValues?: Partial<MetadataFormValues>;
  submitLabel: string;
  submitIcon?: IconName;
  onSubmit: (values: MetadataFormValues) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
};
