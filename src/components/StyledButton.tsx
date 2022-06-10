import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

export function StyledButton({
  children,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = classNames(
    'p-2 border duration-150 rounded-lg focus:ring disabled:opacity-75 disabled:bg-gray-600 disabled:text-gray-200',
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
