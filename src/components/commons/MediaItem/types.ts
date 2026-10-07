import type { TouchableProps } from '../Touchable';

export type MediaItemProps = Omit<TouchableProps, 'children'> & {
  title: string;
  imageUri?: string | null;
  imageKey?: string;
  meta?: string;
  description?: string;
  titleMaxChars?: number;
  descriptionMaxChars?: number;
};
