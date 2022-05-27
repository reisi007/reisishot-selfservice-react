import {Legend} from 'recharts';
import {Props} from 'recharts/types/component/DefaultLegendContent';
import {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {CustomLegend, SetChartVisibilityType} from './CustomLegend';


export type ChartVisibilities = { [p: string]: boolean };

export function renderLegendOnTop(barVisibility: ChartVisibilities, setBarVisibility: SetChartVisibilityType) {
  const content = (props: Props) => <CustomLegend {...props}
                                                  visibilities={barVisibility}
                                                  setVisibilities={setBarVisibility}/>;
  return <Legend layout="horizontal" verticalAlign="top" align="center" content={content}/>;
}

export type Totals = { [key: string]: number };
// TODO programmatically compute domain & ticks
export type AxisConfig = { unit?: string, domain?: [number, number], ticks?: number[] };

export const CHART_SETTINGS: { [name: string]: { color: string, expectedPercentage: number } } = {
  'Porträt Shooting': {color: '#0031d1', expectedPercentage: 30},
  'Tanz / Yoga Shooting': {color: '#1e90ff', expectedPercentage: 15},
  'Sport Shooting': {color: '#6bb6ff', expectedPercentage: 5},
  'Boudoir Shooting': {color: '#daa520', expectedPercentage: 25},
  'Pärchen Shooting': {color: '#ff69b4', expectedPercentage: 15},
  'Hochzeit Shooting': {color: '#d3d3d3', expectedPercentage: 0},
  'Haustier Shooting': {color: '#ff6200', expectedPercentage: 10},
};

export function useWidth(divRef: React.MutableRefObject<HTMLDivElement | null>): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);

  const testWidth = useCallback(() => {
    if(divRef.current) {
      setWidth(divRef.current?.offsetWidth);
    }
  }, [divRef]);

  useLayoutEffect(testWidth, [testWidth]);

  useEffect(() => {
    const listener = testWidth;
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  });

  return width;
}
