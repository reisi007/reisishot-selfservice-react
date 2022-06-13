import { ButtonHTMLAttributes, HTMLProps } from 'react';
import classNames from 'classnames';

const BUTTON_CLASSES = 'p-2 border duration-150 rounded-lg focus:ring disabled:opacity-75 disabled:bg-gray-600 disabled:text-gray-200';

export function StyledButton({
  children,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = classNames(
    BUTTON_CLASSES,
    buttonProps.className,
  );
  return (
    <button
      type="button"
      {...buttonProps}
      className={classes}
    >
      {children}
    </button>
  );
}

export function StyledLinkButton({
  children,
  ...buttonProps
}: HTMLProps<HTMLAnchorElement>) {
  const classes = classNames(
    BUTTON_CLASSES,
    'text-center text-black no-underline',
    buttonProps.className,
  );
  return (
    <a
      {...buttonProps}
      className={classes}
    >
      {children}
    </a>
  );
}
