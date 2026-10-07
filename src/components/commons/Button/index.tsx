import { Icon } from '../Icon';
import { Row } from '../Row';
import { Spinner } from '../Spinner';
import { Touchable } from '../Touchable';
import { Typography } from '../Typography';
import { sizeClasses, variants } from './styles';
import type { ButtonProps } from './types';

export type * from './types';

export function Button({
  title,
  variant = 'primary',
  size = 'regular',
  icon,
  iconPosition,
  loading = false,
  textVariant = 'action',
  textTone,
  textWeight,
  iconSize,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const style = variants[variant];
  const isDisabled = !!disabled || loading;
  const position = iconPosition ?? style.iconPosition;
  const iconElement = icon ? (
    <Icon name={icon} size={iconSize ?? style.iconSize} tone={textTone ?? style.icon} />
  ) : null;

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={style.hitSlop}
      pressedOpacity={style.pressedOpacity}
      className={`flex-row items-center ${style.container} ${style.boxed ? sizeClasses[size] : ''} ${
        isDisabled ? style.disabled.container : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Spinner tone={style.spinner} />
      ) : (
        <Row
          gap={style.gap}
          justify="between"
          className={`${style.boxed && size === 'regular' ? 'flex-1' : ''} ${isDisabled ? style.disabled.content : ''}`}
        >
          {position === 'start' ? iconElement : null}
          {title ? (
            <Typography variant={textVariant} weight={textWeight} tone={textTone ?? style.text}>
              {title}
            </Typography>
          ) : null}
          {position === 'end' ? iconElement : null}
        </Row>
      )}
    </Touchable>
  );
}
