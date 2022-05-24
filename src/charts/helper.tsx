import {Legend, ResponsiveContainer} from 'recharts';
import {Props} from 'recharts/types/component/DefaultLegendContent';
import {Dispatch, SetStateAction, useCallback} from 'react';
import {CustomLegend} from './CustomLegend';

export function withResponsiveContainer(e: JSX.Element) {
  return <ResponsiveContainer width={'100%'} minHeight={500} height={'33%'}>
    {e}
  </ResponsiveContainer>;
}


export type ChartVisibilities = { [p: string]: boolean };

export function useLegendOnTop(barVisibility: ChartVisibilities, setBarVisibility: Dispatch<SetStateAction<ChartVisibilities>>) {
  // eslint-disable-next-line react/jsx-no-undef
  const content = useCallback((props: Props) => <CustomLegend {...props}
                                                              visibilities={barVisibility}
                                                              setVisibilities={setBarVisibility}/>, [barVisibility, setBarVisibility]);
  return <Legend layout="horizontal" verticalAlign="top" align="center" content={content}/>;
}

export type YearTotals = { [year: string]: number };

export const CHART_SETTINGS: { [name: string]: { color: string, expectedPercentage: number } } = {
  'Porträt Shooting': {color: '#0031d1', expectedPercentage: 30},
  'Tanz / Yoga Shooting': {color: '#1e90ff', expectedPercentage: 15},
  'Sport Shooting': {color: '#6bb6ff', expectedPercentage: 5},
  'Boudoir Shooting': {color: '#daa520', expectedPercentage: 25},
  'Pärchen Shooting': {color: '#ff69b4', expectedPercentage: 15},
  'Hochzeit Shooting': {color: '#d3d3d3', expectedPercentage: 0},
  'Haustier Shooting': {color: '#ff6200', expectedPercentage: 10},
};
