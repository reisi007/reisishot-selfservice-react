import { ReactNode } from 'react';

type Props = {
  background?: string
  text?: string,
  className?: string
  children: ReactNode
};

export function Badge({
  background = 'bg-gray-100',
  text = 'text-gray-800',
  className = '',
  children,
}: Props) {
  return (
    <span className={`inline-block py-0.5 px-2.5 mr-2 font-light rounded-lg ${background} ${text} ${className}`}>
      {children}
    </span>
  );
}
