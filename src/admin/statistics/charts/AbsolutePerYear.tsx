import {YearDataType} from '../statistics.api';
import {CHART_SETTINGS, renderLegendOnTop, useWidth} from '../../../charts/helper';
import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from 'recharts';
import {useMemo, useRef, useState} from 'react';
import {ChartData, withAbsoluteTooltip} from '../../../charts/AbsoluteTooltip';
import {useTranslation} from 'react-i18next';

export function AbsolutePerYear(yearData: YearDataType) {
  const {data, totals} = yearData;
  const {t} = useTranslation();
  const chartData: Array<ChartData> = useMemo(() => Object.entries(data).map(([key, value]) => ({
    year: key,
    data: value,
  })), [data]);

  const divRef = useRef<HTMLDivElement | null>(null);
  const width = useWidth(divRef);

  const [visibilities, setVisibilities] = useState(Object.fromEntries(Object.keys(CHART_SETTINGS).map((k) => ([k, true]))));
  const tooltipContent = useMemo(() => withAbsoluteTooltip(totals, visibilities), [totals, visibilities]);
  return <div ref={divRef}>
    <h3>{t('admin.statistics.charts.absolutePerYear.title')}</h3>
    {width !== undefined &&
     <>
         <BarChart width={width} height={600} data={chartData}>
             <CartesianGrid strokeDasharray="3 3" vertical={false}/>
           {renderLegendOnTop(visibilities, setVisibilities)}
             <XAxis dataKey="year"/>
             <YAxis/>
             <Tooltip content={tooltipContent}/>
           {
             Object.entries(CHART_SETTINGS)
                   .sort(([a], [b]) => (visibilities[b] ? 1 : 0) - (visibilities[a] ? 1 : 0))
                   .map(([shootingType, {color}]) =>
                     <Bar key={shootingType} dataKey={`data.${shootingType}`} isAnimationActive={false}
                          visibility={visibilities[shootingType] ? undefined : 'collapse'} name={shootingType}
                          stackId="a"
                          fill={color}/>,
                   )
           }

         </BarChart>
     </>}
  </div>;
}


