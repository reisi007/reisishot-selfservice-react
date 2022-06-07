import { CSSProperties, useRef } from 'react';
import { useWidth } from '../charts/helper';

type Props = { children: (width: number) => JSX.Element | Array<JSX.Element>, className?: string, style?: CSSProperties };

export function ResponsiveContainer({
  children,
  className,
  style,
}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const width = useWidth(divRef);
  return (
    <div className={className} style={style} ref={divRef}>
      {width !== undefined && children(width)}
    </div>
  );
}
