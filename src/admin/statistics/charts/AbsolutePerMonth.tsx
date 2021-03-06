import { useTranslation } from 'react-i18next';
import {
  CartesianGrid, DotProps, Line, LineChart, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Fragment, ReactElement, useMemo } from 'react';
import { MonthDataType } from '../statistics.api';
import { ResponsiveContainer } from '../../../components/ResponsiveContainer';
import { CHART_SETTINGS } from '../../../charts/helper';
import { withAbsoluteTooltip } from '../../../charts/Tooltips';
import { ShootingTypeLegend } from './ShootingTypeLegend';
import { StatisticChartProps } from '../StatisticChartProps';

type DefaultLineProps = { shootingType: string, color: string };

function renderDefaultLine(props: DefaultLineProps) {
  const {
    shootingType,
    color,
  } = props;
  return (
    <Line
      key={shootingType}
      strokeWidth="2px"
      dataKey={`data.${shootingType}`}
      dot={CustomizedDot}
      activeDot={CustomizedDot}
      name={shootingType}
      type="monotoneX"
      stroke={color}
    />
  );
}

function CustomizedDot(props: DotProps & { value: number }): ReactElement<SVGElement> {
  const {
    cx = 0,
    cy = 0,
    stroke,
    fill,
    key,
    value,
  } = props;
  return (
    <Fragment key={key}>
      {value > 0 && !Number.isNaN(cx) && !Number.isNaN(cy)
       && (
         <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="black">
           <g transform="translate(4 4)">
             <circle r="4" fill={stroke} />
             <circle r="2" fill={fill} />
           </g>
         </svg>
       )}
    </Fragment>
  );
}

export function AbsolutePerMonth(monthData: MonthDataType & StatisticChartProps) {
  const {
    data,
    totals,
    visibilities,
    setVisibilities,
  } = monthData;
  const { t } = useTranslation();
  const chartData: Array<MonthChartData> = useMemo(() => Object.entries(data)
    .map(([key, value]) => ({
      month: key,
      data: Object.fromEntries(Object.keys(CHART_SETTINGS)
        .map((s) => [s, value[s] ?? 0])),
    })), [data]);
  const renderLine = renderDefaultLine;
  return (
    <>
      <h3>{t('admin.statistics.charts.absolutePerMonth.title')}</h3>
      <ShootingTypeLegend visibilities={visibilities} setVisibilities={setVisibilities} />
      <ResponsiveContainer>
        {(width) => (
          <LineChart data={chartData} width={width} height={600}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis type="category" dataKey="month" />
            <YAxis interval={0} type="number" />
            <Tooltip content={withAbsoluteTooltip(totals, visibilities)} />
            {
              Object.entries(CHART_SETTINGS)
                .filter(([shootingType]) => visibilities[shootingType] ?? true)
                .map(([shootingType, { color }]) => renderLine({
                  shootingType,
                  color,
                }))
            }
          </LineChart>
        )}
      </ResponsiveContainer>
    </>
  );
}

export type MonthChartData = {
  month: string,
  data: {
    [shootingType: string]: number
  }
};
