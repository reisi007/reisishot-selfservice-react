import {useRef} from 'react';
import {useWidth} from '../charts/helper';

type Props = { children: (width: number) => JSX.Element | Array<JSX.Element> }

export function ResponsiveContainer({children}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const width = useWidth(divRef);
  return <div ref={divRef}>
    {width !== undefined && children(width)}
  </div>;
}
