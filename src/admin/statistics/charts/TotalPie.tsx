import {YearDataType} from '../statistics.api';
import {StatisticChartProps} from '../Statistics';
import {ResponsiveContainer} from '../../../components/ResponsiveContainer';
import {useTranslation} from 'react-i18next';
import {Cell, Pie, PieChart, Tooltip} from 'recharts';
import React, {useMemo} from 'react';
import {useRelativePieChartLabel} from '../../../charts/PieChartLabel';
import {CHART_SETTINGS, renderLegendOnTop} from '../../../charts/helper';
import {withAbsoluteTooltip} from '../../../charts/Tooltips';

export function TotalPie(yearData: YearDataType & StatisticChartProps) {
  const {data: rawData, visibilities, setVisibilities} = yearData;

  const data = useMemo(() => {
    const d: { [shootingType: string]: number } = {};
    Object.values(rawData).forEach(e => {
      Object.entries(e).forEach(([type, cnt]) => {
        d[type] = (d[type] ?? 0) + cnt;
      });
    });
    return Object.entries(d)
                 .map(
                   ([key, value]) =>
                     ({key, value}),
                 );
  }, [rawData]);

  const totals = useMemo(() => {
    const total = data.map(e => e.value).reduce((a, b) => a + b, 0);
    return Object.fromEntries(
      data.map(e => [e.key, total]),
    );
  }, [data]);
  const renderLabel = useRelativePieChartLabel(totals);

  const {t} = useTranslation();
  return <>
    <h3>{t('admin.statistics.charts.total.title')}</h3>
    <ResponsiveContainer>
      {width => {
        const max = Math.max(600, width);

        return <PieChart width={max} height={max}>
          {renderLegendOnTop(visibilities, setVisibilities)}
          <Tooltip content={withAbsoluteTooltip(totals, visibilities)}/>
          <Pie
            data={data}
            outerRadius={1 / 3 * max}
            labelLine={false}
            label={renderLabel}
            dataKey="value"
          >

            {
              data.map(e => e.key)
                  .map((shootingType) => {
                    const isVisible = visibilities[shootingType] ?? true;
                    return <Cell key={shootingType} name={shootingType}
                                 visibility={isVisible ? undefined : 'collapse'}
                                 fill={CHART_SETTINGS[shootingType].color}/>;
                  })
            }
          </Pie>
        </PieChart>;
      }
      }
    </ResponsiveContainer>
  </>;
}
