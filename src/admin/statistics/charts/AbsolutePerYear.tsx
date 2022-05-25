import {YearDataType} from '../statistics.api';
import {useMemo} from 'react';
import {withAbsoluteTooltip} from '../../../charts/Tooltips';
import {useTranslation} from 'react-i18next';
import {StatisticChartProps} from '../Statistics';
import {AdminStatisticsBarChart, YearChartData} from './AdminStatisticsBarChart';

export function AbsolutePerYear(yearData: YearDataType & StatisticChartProps) {
  const {data, totals, visibilities} = yearData;
  const {t} = useTranslation();
  const chartData: Array<YearChartData> = useMemo(() => Object.entries(data).map(([key, value]) => ({
    year: key,
    data: value,
  })), [data]);

  const renderTooltip = useMemo(() => withAbsoluteTooltip(totals, visibilities), [totals, visibilities]);

  return <AdminStatisticsBarChart
    chartTitle={t('admin.statistics.charts.absolutePerYear.title')}
    chartData={chartData}
    renderTooltip={renderTooltip}
    chartProps={yearData}
  />;
}



