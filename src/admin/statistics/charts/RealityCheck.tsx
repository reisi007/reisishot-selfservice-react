import {YearDataType} from '../statistics.api';
import {StatisticChartProps} from '../Statistics';
import {useTranslation} from 'react-i18next';
import React, {useMemo} from 'react';
import {ResponsiveContainer} from '../../../components/ResponsiveContainer';
import {Cell, Pie, PieChart} from 'recharts';
import {CHART_SETTINGS, ChartVisibilities, Totals} from '../../../charts/helper';
import {useRelativePieChartLabel} from '../../../charts/PieChartLabel';
import {SetChartVisibilityType, ShootingTypeLegend} from './ShootingTypeLegend';
import './Pie.module.css';

export function RealityCheck(yearData: YearDataType & StatisticChartProps) {
  const {data: rawData, visibilities, setVisibilities} = yearData;
  const maxYear = useMemo(() => Math.max(...Object.keys(rawData).map(e => parseInt(e, 10))).toString(10), [rawData]);
  const data = useMemo(() => {
    return Object.keys(CHART_SETTINGS).map((shootingType) => {
      return {key: shootingType, value: rawData[maxYear][shootingType] ?? 0};
    });
  }, [rawData, maxYear]);
  const totals = useMemo(() => {
    const sum = data.map(e => e.value)
                    .reduce((a, b) => a + b, 0);
    return Object.fromEntries(data.map(({key}) => ([key, sum])));
  }, [data]);
  const {t} = useTranslation();
  return <>
    <h3>{t('admin.statistics.charts.realityCheck.title')}</h3>
    <ShootingTypeLegend visibilities={visibilities} setVisibilities={setVisibilities}/>
    <ResponsiveContainer>
      {width => {
        return <PieChartChart
          width={width}
          data={data}
          year={maxYear}
          visibilities={visibilities}
          setVisibilities={setVisibilities}
          totals={totals}
        />;
      }
      }
    </ResponsiveContainer>
  </>;
}

type PieChartProps = { year: string, width: number, data: Array<{ value: number; key: string }>, visibilities: ChartVisibilities, setVisibilities: SetChartVisibilityType, totals: Totals }

function PieChartChart({width, data, visibilities, totals, year}: PieChartProps) {
  const min = width;
  const renderOuterPieChart = useRenderExpectationPieChart(width, visibilities);
  const renderInnerPieChart = useRenderMaxYearPieChart(width, visibilities, data, totals);
  return <PieChart
    width={min}
    height={min}
  >
    {renderOuterPieChart}
    {renderInnerPieChart}
    <text x={min / 2} y={min / 2} className="text-3xl" stroke="black" textAnchor="middle" dominantBaseline="middle">
      {year}
    </text>
  </PieChart>;
}

function useRenderMaxYearPieChart(size: number, visibilities: ChartVisibilities, data: Array<{ key: string; value: number }>, totals: Totals) {
  const renderLabel = useRelativePieChartLabel(totals, visibilities, 0.5);
  const filteredData = useMemo(() =>
    data.filter(({key: shootingType}) => visibilities[shootingType] ?? true), [data, visibilities]);
  return <Pie
    data={filteredData}
    innerRadius={1 / 10 * size}
    outerRadius={3 / 10 * size}
    labelLine={false}
    label={renderLabel}
    dataKey="value"
  >
    {
      filteredData.map(e => e.key)
                  .map(shootingType => {
                    return <Cell key={shootingType} name={shootingType} fill={CHART_SETTINGS[shootingType].color}/>;
                  })
    }
  </Pie>;
}

function useRenderExpectationPieChart(size: number, visibilities: ChartVisibilities) {
  const data = useMemo(() =>
    Object.entries(CHART_SETTINGS)
          .filter(([shootingType]) => visibilities[shootingType] ?? true)
          .map(([key, {expectedPercentage: value}]) => ({key, value})), [visibilities]);

  const totals: Totals = useMemo(() =>
      Object.fromEntries(Object.keys(CHART_SETTINGS).map(k => [k, 100]))
    , []);

  const renderLabel = useRelativePieChartLabel(totals, visibilities, 0.5);
  return <Pie
    data={data}
    innerRadius={4 / 10 * size}
    outerRadius={1 / 2 * size}
    labelLine={false}
    label={renderLabel}
    dataKey="value"
  >
    {
      data.map(e => e.key)
          .map(shootingType => {
            return <Cell key={shootingType} name={shootingType}
                         fill={CHART_SETTINGS[shootingType].color}/>;
          })
    }
  </Pie>;
}
