import {YearDataType} from '../statistics.api';
import {useMemo} from 'react';
import {withRelativeTooltip} from '../../../charts/Tooltips';
import {useTranslation} from 'react-i18next';
import {StatisticChartProps} from '../Statistics';
import {AdminStatisticsBarChart, ChartData} from './AdminStatisticsBarChart';
import {AxisConfig} from '../../../charts/helper';

const yAxisConfig: AxisConfig = {unit: '%', domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100]};

export function RelativePerYear(yearData: YearDataType & StatisticChartProps) {
  const {data, totals, visibilities} = yearData;
  const {t} = useTranslation();
  const chartData: Array<ChartData> = useMemo(() => Object.entries(data).map(([key, value]) => {
    const yearTotals = totals[key];
    return {
      year: key,
      data: Object.fromEntries(Object.entries(value).map(([key, absolute]) => {
        const relative = (absolute / yearTotals * 100);
        return [key, relative];
      })),
    };
  }), [data, totals]);

  const renderTooltip = useMemo(() => withRelativeTooltip(totals, visibilities), [totals, visibilities]);

  return <AdminStatisticsBarChart
    chartTitle={t('admin.statistics.charts.absolutePerYear.title')}
    yAxisConfig={yAxisConfig}
    chartData={chartData}
    renderTooltip={renderTooltip}
    chartProps={yearData}
  />;
}



