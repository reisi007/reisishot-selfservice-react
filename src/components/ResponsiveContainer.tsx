import { useRef } from 'react';
import { useWidth } from '../charts/helper';

type Props = { children: (width: number) => JSX.Element | Array<JSX.Element>, className?: string };

export function ResponsiveContainer({
  children,
  className,
}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const width = useWidth(divRef);
  return (
    <div className={className} ref={divRef}>
      {width !== undefined && children(width)}
    </div>
  );
}
