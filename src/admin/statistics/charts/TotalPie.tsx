import { useTranslation } from 'react-i18next';
import {
  Cell, Pie, PieChart, Tooltip,
} from 'recharts';
import React, { useMemo } from 'react';
import { YearDataType } from '../statistics.api';
import { ResponsiveContainer } from '../../../components/ResponsiveContainer';
import { useRelativePieChartLabel } from '../../../charts/PieChartLabel';
import { CHART_SETTINGS } from '../../../charts/helper';
import { withAbsoluteTooltip } from '../../../charts/Tooltips';
import { ShootingTypeLegend } from './ShootingTypeLegend';
import './Recharts.module.css';
import { StatisticChartProps } from '../StatisticChartProps';

export function TotalPie(yearData: YearDataType & StatisticChartProps) {
  const {
    data: rawData,
    visibilities,
    setVisibilities,
  } = yearData;

  const data = useMemo(() => {
    const d: { [shootingType: string]: number } = {};
    Object.values(rawData)
      .forEach((o) => {
        Object.keys(CHART_SETTINGS)
          .filter((shootingType) => visibilities[shootingType] ?? true)
          .forEach((k) => {
            d[k] = (d[k] ?? 0) + (o[k] ?? 0);
          });
      });

    return Object.entries(d)
      .map(
        ([key, value]) => ({
          key,
          value,
        }),
      );
  }, [rawData, visibilities]);

  const totals = useMemo(() => {
    const total = data
      .map((e) => e.value)
      .reduce((a, b) => a + b, 0);
    return Object.fromEntries(
      data.map((e) => [e.key, total]),
    );
  }, [data]);
  const renderLabel = useRelativePieChartLabel(totals, visibilities);
  const { t } = useTranslation();
  return (
    <>
      <h3>{t('admin.statistics.charts.total.title')}</h3>
      <ShootingTypeLegend visibilities={visibilities} setVisibilities={setVisibilities} />
      <ResponsiveContainer>
        {(rawWidth) => {
          const width = 0.95 * Math.min(rawWidth, window.innerHeight, window.innerWidth);
          return (
            <PieChart width={width} height={width}>
              <Tooltip content={withAbsoluteTooltip(totals, visibilities)} />
              <Pie
                data={data}
                outerRadius={(1 / 2) * width}
                labelLine={false}
                label={renderLabel}
                isAnimationActive={false} // Needed because of https://github.com/recharts/recharts/issues/829#issuecomment-1117950598
                dataKey="value"
              >
                {
                  Object.keys(CHART_SETTINGS)
                    .filter((shootingType) => visibilities[shootingType] ?? true)
                    .map((shootingType) => (
                      <Cell
                        key={shootingType}
                        name={shootingType}
                        fill={CHART_SETTINGS[shootingType].color}
                      />
                    ))
                }
              </Pie>
            </PieChart>
          );
        }}
      </ResponsiveContainer>
    </>
  );
}
