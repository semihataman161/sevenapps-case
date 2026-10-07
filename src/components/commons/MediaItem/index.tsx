import { View } from 'react-native';

import { Divider } from '../Divider';
import { Row } from '../Row';
import { Thumbnail } from '../Thumbnail';
import { Touchable } from '../Touchable';
import { Typography } from '../Typography';
import { THUMBNAIL_RATIO, THUMBNAIL_WIDTH } from './styles';
import type { MediaItemProps } from './types';

export type * from './types';

export function MediaItem({
  title,
  imageUri,
  imageKey,
  meta,
  description,
  titleMaxChars,
  descriptionMaxChars,
  ...props
}: MediaItemProps) {
  return (
    <Touchable accessibilityRole="button" {...props}>
      <Row align="start" gap={16} className="py-5">
        <View
          className="overflow-hidden rounded bg-surface dark:bg-surface-dark"
          style={{ width: THUMBNAIL_WIDTH, aspectRatio: THUMBNAIL_RATIO }}
        >
          {imageUri ? <Thumbnail source={{ uri: imageUri }} recyclingKey={imageKey} /> : null}
        </View>

        <View className="flex-1">
          {meta ? (
            <Typography variant="overline" tone="secondary" tabular className="mb-2">
              {meta}
            </Typography>
          ) : null}
          <Typography variant="subtitle" maxChars={titleMaxChars}>
            {title}
          </Typography>
          {description ? (
            <Typography
              variant="label"
              tone="secondary"
              maxChars={descriptionMaxChars}
              className="mt-1"
            >
              {description}
            </Typography>
          ) : null}
        </View>
      </Row>
      <Divider />
    </Touchable>
  );
}
