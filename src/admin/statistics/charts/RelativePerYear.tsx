import {ShootingStatisticsResponse, YearDataType} from '../statistics.api';
import {useMemo} from 'react';
import {withRelativeTooltip} from '../../../charts/Tooltips';
import {useTranslation} from 'react-i18next';
import {StatisticChartProps} from '../Statistics';
import {AdminStatisticsBarChart, YearChartData} from './AdminStatisticsBarChart';
import {AxisConfig, Totals} from '../../../charts/helper';
import {sumValues} from '../statistics.utils';

const yAxisConfig: AxisConfig = {unit: '%', domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100]};

export function RelativePerYear(yearData: YearDataType & StatisticChartProps) {
  const {data: rawData, visibilities} = yearData;
  const {t} = useTranslation();
  const data: ShootingStatisticsResponse = useMemo(() => {
    return Object.fromEntries(
      Object.entries(rawData)
            .map(([year, yearData]) => {
              const filteredYearData = Object.fromEntries(
                Object.entries(yearData)
                      .filter(([shootingType]) => visibilities[shootingType] ?? true),
              );
              return [year, filteredYearData];
            }),
    );
  }, [rawData, visibilities]);
  const totals: Totals = useMemo(() => {
    return Object.fromEntries(
      Object.entries(data)
            .map(([year, yearData]) => [year, sumValues(yearData)]),
    );
  }, [data]);

  const chartData: Array<YearChartData> = useMemo(() => Object.entries(data).map(([key, value]) => {
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



