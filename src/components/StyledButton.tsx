import { ButtonHTMLAttributes } from 'react';

export function StyledButton({
  children,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...buttonProps}
      className={`p-2 border duration-150 rounded-lg focus:ring disabled:opacity-75 disabled:bg-gray-600 disabled:text-gray-200 ${buttonProps.className ? buttonProps.className : ''}`}
    >
      {children}
    </button>
  );
}
