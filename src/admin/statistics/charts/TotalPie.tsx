import {YearDataType} from '../statistics.api';
import {StatisticChartProps} from '../Statistics';
import {ResponsiveContainer} from '../../../components/ResponsiveContainer';
import {useTranslation} from 'react-i18next';
import {Cell, Pie, PieChart, Tooltip} from 'recharts';
import React, {useMemo} from 'react';
import {useRelativePieChartLabel} from '../../../charts/PieChartLabel';
import {CHART_SETTINGS, renderLegendOnTop} from '../../../charts/helper';
import {withAbsoluteTooltip} from '../../../charts/Tooltips';
import './Pie.module.css';

export function TotalPie(yearData: YearDataType & StatisticChartProps) {
  const {data: rawData, visibilities, setVisibilities} = yearData;

  const data = useMemo(() => {
    const d: { [shootingType: string]: number } = {};

    Object.values(rawData).forEach((o) => {
      Object.keys(CHART_SETTINGS).forEach(k => {
        d[k] = (d[k] ?? 0) + (o[k] ?? 0);
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
  const renderLabel = useRelativePieChartLabel(totals, visibilities);

  const {t} = useTranslation();
  return <>
    <h3>{t('admin.statistics.charts.total.title')}</h3>
    <ResponsiveContainer>
      {width => {
        const min = Math.min(600, width);

        return <PieChart width={min} height={min}>
          {renderLegendOnTop(visibilities, setVisibilities)}
          <Tooltip content={withAbsoluteTooltip(totals, visibilities)}/>
          <Pie
            data={data}
            outerRadius={1 / 3 * min}
            labelLine={false}
            label={renderLabel}
            dataKey="value"
          >

            {
              Object.keys(CHART_SETTINGS)
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
