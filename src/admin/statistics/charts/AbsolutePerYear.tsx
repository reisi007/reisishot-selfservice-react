import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { YearDataType } from '../statistics.api';
import { withAbsoluteTooltip } from '../../../charts/Tooltips';
import { AdminStatisticsBarChart, YearChartData } from './AdminStatisticsBarChart';
import { StatisticChartProps } from '../StatisticChartProps';

export function AbsolutePerYear(yearData: YearDataType & StatisticChartProps) {
  const {
    data,
    totals,
    visibilities,
  } = yearData;
  const { t } = useTranslation();
  const chartData: Array<YearChartData> = useMemo(() => Object.entries(data)
    .map(([key, value]) => ({
      year: key,
      data: value,
    })), [data]);

  const renderTooltip = useMemo(() => withAbsoluteTooltip(totals, visibilities), [totals, visibilities]);

  return (
    <AdminStatisticsBarChart
      chartTitle={t('admin.statistics.charts.absolutePerYear.title')}
      chartData={chartData}
      renderTooltip={renderTooltip}
      chartProps={yearData}
    />
  );
}
