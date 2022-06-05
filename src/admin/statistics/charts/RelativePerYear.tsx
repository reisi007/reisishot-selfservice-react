import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ShootingStatisticsResponse, YearDataType } from '../statistics.api';
import { withRelativeTooltip } from '../../../charts/Tooltips';
import { AdminStatisticsBarChart, YearChartData } from './AdminStatisticsBarChart';
import { AxisConfig, Totals } from '../../../charts/helper';
import { sumValues } from '../statistics.utils';
import { StatisticChartProps } from '../StatisticChartProps';

const yAxisConfig: AxisConfig = {
  unit: '%',
  domain: [0, 100],
  ticks: [0, 20, 40, 60, 80, 100],
};

export function RelativePerYear(yearData: YearDataType & StatisticChartProps) {
  const {
    data: rawData,
    visibilities,
  } = yearData;
  const { t } = useTranslation();
  const data: ShootingStatisticsResponse = useMemo(() => Object.fromEntries(
    Object.entries(rawData)
      .map(([year, curYearData]) => {
        const filteredYearData = Object.fromEntries(
          Object.entries(curYearData)
            .filter(([shootingType]) => visibilities[shootingType] ?? true),
        );
        return [year, filteredYearData];
      }),
  ), [rawData, visibilities]);
  const totals: Totals = useMemo(() => Object.fromEntries(
    Object.entries(data)
      .map(([year, curYearData]) => [year, sumValues(curYearData)]),
  ), [data]);

  const chartData: Array<YearChartData> = useMemo(() => Object.entries(data)
    .map(([yearKey, value]) => {
      const yearTotals = totals[yearKey];
      return {
        year: yearKey,
        data: Object.fromEntries(Object.entries(value)
          .map(([key, absolute]) => {
            const relative = ((absolute / yearTotals) * 100);
            return [key, relative];
          })),
      };
    }), [data, totals]);

  const renderTooltip = useMemo(() => withRelativeTooltip(totals, visibilities), [totals, visibilities]);

  return (
    <AdminStatisticsBarChart
      chartTitle={t('admin.statistics.charts.absolutePerYear.title')}
      yAxisConfig={yAxisConfig}
      chartData={chartData}
      renderTooltip={renderTooltip}
      chartProps={yearData}
    />
  );
}
