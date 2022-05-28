import React, {useCallback} from 'react';
import {ChartVisibilities, Totals} from './helper';

const RADIAN = Math.PI / 180;

export function useRelativePieChartLabel(totals: Totals, visibilities: ChartVisibilities, position?: number) {
  return useCallback((props: any) => <RelativePieChartLabel
    {...props}
    totals={totals}
    position={position}
    visibilities={visibilities}
  />, [position, totals, visibilities]);
}

const RelativePieChartLabel = ({
                                 cx,
                                 cy,
                                 midAngle,
                                 innerRadius,
                                 outerRadius,
                                 value,
                                 totals,
                                 name,
                                 label,
                                 position = 2 / 3,
                                 visibilities,
                               }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * position;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const number = value / totals[label ?? name] * 100;
  return <>
    {(!!number) && (visibilities[label ?? name] ?? true) && <text
        x={x}
        y={y}
        fill="white"
        className="text-lg"
        textAnchor={'middle'}
        dominantBaseline="central"
    >
      {`${number.toFixed(2)}%`}
    </text>}
  </>;
};
