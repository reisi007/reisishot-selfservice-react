import { ReactNode } from 'react';

export function Card({
  className = '',
  children,
}: { className?: string, children: ReactNode }) {
  return <div className={`flex flex-col p-2 rounded-xl border ${className}`}>{children}</div>;
}
