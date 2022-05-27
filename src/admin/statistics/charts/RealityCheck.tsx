import {YearDataType} from '../statistics.api';
import {StatisticChartProps} from '../Statistics';
import {useTranslation} from 'react-i18next';
import React, {useMemo} from 'react';
import {ResponsiveContainer} from '../../../components/ResponsiveContainer';
import {Cell, Pie, PieChart} from 'recharts';
import {CHART_SETTINGS, ChartVisibilities, renderLegendOnTop, Totals} from '../../../charts/helper';
import {useRelativePieChartLabel} from '../../../charts/PieChartLabel';
import {SetChartVisibilityType} from '../../../charts/CustomLegend';

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
    <ResponsiveContainer>
      {width => {
        return <PieChartChart width={width} data={data} visibilities={visibilities} setVisibilities={setVisibilities}
                              totals={totals}/>;
      }
      }
    </ResponsiveContainer>
  </>;
}

type PieChartProps = { width: number, data: { value: number; key: string }[], visibilities: ChartVisibilities, setVisibilities: SetChartVisibilityType, totals: Totals }

function PieChartChart({width, data, visibilities, setVisibilities, totals}: PieChartProps) {
  const max = Math.max(600, width);
  const renderOuterPieChart = useRenderExpectationPieChart(width, visibilities);
  const renderInnerPieChart = useRenderMaxYearPieChart(data, totals, width, visibilities);
  return <PieChart width={max} height={max}>
    {renderLegendOnTop(visibilities, setVisibilities)}
    {renderOuterPieChart}
    {renderInnerPieChart}
  </PieChart>;
}

function useRenderMaxYearPieChart(data: Array<{ key: string, value: number }>, totals: Totals, size: number, visibilities: ChartVisibilities) {
  const renderLabel = useRelativePieChartLabel(totals, 0.5);
  return <Pie
    data={data}
    outerRadius={7 / 32 * size}
    innerRadius={1 / 16 * size}
    labelLine={false}
    label={renderLabel}
    dataKey="value"
  >
    {
      data.map(e => e.key)
          .map(shootingType => {
            const isVisible = visibilities[shootingType] ?? true;
            return <Cell key={shootingType} name={shootingType}
                         visibility={isVisible ? undefined : 'collapse'}
                         fill={CHART_SETTINGS[shootingType].color}/>;
          })
    }
  </Pie>;
}

function useRenderExpectationPieChart(size: number, visibilities: ChartVisibilities) {
  const data = useMemo(() =>
    Object.entries(CHART_SETTINGS)
          .map(([key, {expectedPercentage: value}]) => ({key, value})), []);

  const totals: Totals = useMemo(() =>
      Object.fromEntries(Object.keys(CHART_SETTINGS).map(k => [k, 100]))
    , []);

  const renderLabel = useRelativePieChartLabel(totals, 0.5);
  return <Pie
    data={data}
    outerRadius={1 / 3 * size}
    innerRadius={1 / 4 * size}
    labelLine={false}
    label={renderLabel}
    dataKey="value"
  >
    {
      data.map(e => e.key)
          .map(shootingType => {
            const isVisible = visibilities[shootingType] ?? true;
            return <Cell key={shootingType} name={shootingType}
                         visibility={isVisible ? undefined : 'collapse'}
                         fill={CHART_SETTINGS[shootingType].color}/>;
          })
    }
  </Pie>;
}
