import {MonthDataType} from '../statistics.api';
import {StatisticChartProps} from '../Statistics';
import {useTranslation} from 'react-i18next';
import {ResponsiveContainer} from '../../../components/ResponsiveContainer';
import {CartesianGrid, DotProps, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {CHART_SETTINGS, renderLegendOnTop} from '../../../charts/helper';
import {withAbsoluteTooltip} from '../../../charts/Tooltips';
import {ReactElement, useMemo} from 'react';

const DEFAULT_RENDER_LINE = (i: number, shootingType: string, isVisible: boolean, color: string) => {
  const dot = (props: any) => CustomizedDot({...props, isVisible});
  return <Line
    key={i}
    strokeWidth="2px"
    dataKey={`data.${shootingType}`}
    dot={dot}
    activeDot={dot}
    name={shootingType}
    visibility={isVisible ? undefined : 'collapse'}
    type="monotoneX"
    stroke={color}
  />;
};

const CustomizedDot = (props: DotProps & { isVisible: boolean, value: number }): ReactElement<SVGElement> => {
  const {cx = 0, cy = 0, stroke, fill, key, value, isVisible} = props;
  console.log(props);
  return (
    <svg key={key} x={cx - 4} y={cy - 4} width={8} height={8} fill="black">
      <g transform="translate(4 4)">
        {value > 0 && isVisible && <>
            <circle r="4" fill={stroke}/>
            <circle r="2" fill={fill}/>
        </>}
      </g>
    </svg>
  );
};

export function AbsolutePerMonth(monthData: MonthDataType & StatisticChartProps) {
  const {data, totals, visibilities, setVisibilities} = monthData;
  const {t} = useTranslation();
  const chartData: Array<MonthChartData> = useMemo(() => Object.entries(data).map(([key, value]) => ({
    month: key,
    data: Object.fromEntries(Object.keys(CHART_SETTINGS).map(s => {
      return [s, value[s] ?? 0];
    })),
  })), [data]);
  const renderLine = DEFAULT_RENDER_LINE;
  return <>
    <h3>{t('admin.statistics.charts.absolutePerMonth.title')}</h3>
    <ResponsiveContainer>
      {width =>
        <LineChart data={chartData} width={width} height={600}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          {renderLegendOnTop(visibilities, setVisibilities)}
          <XAxis type={'category'} dataKey="month"/>
          <YAxis interval={0} type="number"/>
          <Tooltip content={withAbsoluteTooltip(totals, visibilities)}/>
          {renderLegendOnTop(visibilities, setVisibilities)}
          {
            Object.entries(CHART_SETTINGS).map(([shootingType, {color}], i) => {
              const isVisible = visibilities[shootingType] ?? true;
              return renderLine(i, shootingType, isVisible, color);
            })
          }
        </LineChart>
      }
    </ResponsiveContainer>
  </>;
}

export type MonthChartData = {
  month: string,
  data: {
    [shootingType: string]: number
  }
}
