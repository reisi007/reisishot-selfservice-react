import {
  Bar, BarChart, CartesianGrid, Tooltip, TooltipProps, XAxis, YAxis,
} from 'recharts';
import { ResponsiveContainer } from '../../../components/ResponsiveContainer';
import { AxisConfig, CHART_SETTINGS } from '../../../charts/helper';
import { StatisticChartProps } from '../StatisticChartProps';
import { renderLegendOnTop } from './ShootingTypeLegend';

type RenderBarType = (shootingType: string, color: string) => JSX.Element;
type RenderTooltipType = (props: TooltipProps<number, string>) => JSX.Element;

type Props = {
  chartTitle: string,
  chartData: Array<YearChartData>,
  renderTooltip: RenderTooltipType,
  renderBar?: RenderBarType,
  chartProps: StatisticChartProps
  yAxisConfig?: AxisConfig
};

export function AdminStatisticsBarChart({
  chartTitle,
  chartData,
  renderTooltip,
  renderBar = DEFAULT_RENDER_BAR,
  chartProps,
  yAxisConfig,
}: Props) {
  const {
    visibilities,
    setVisibilities,
  } = chartProps;
  return (
    <>
      <h3>{chartTitle}</h3>
      <ResponsiveContainer>
        {(width) => {
          const height = Math.min(600, window.innerHeight);
          return (
            <BarChart width={width} height={height} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              {renderLegendOnTop(visibilities, setVisibilities)}
              <XAxis dataKey="year" />
              <YAxis type="number" unit={yAxisConfig?.unit} ticks={yAxisConfig?.ticks} domain={yAxisConfig?.domain} />
              <Tooltip content={renderTooltip} />
              {
                Object.entries(CHART_SETTINGS)
                  .filter(([e]) => visibilities[e] ?? true)
                  .map(([shootingType, { color }]) => renderBar(shootingType, color))
              }

            </BarChart>
          );
        }}
      </ResponsiveContainer>
    </>
  );
}

const DEFAULT_RENDER_BAR: RenderBarType = (shootingType: string, color: string) => (
  <Bar
    key={shootingType}
    dataKey={`data.${shootingType}`}
    name={shootingType}
    stackId="a"
    fill={color}
  />
);

export type YearChartData = {
  year: string,
  data: {
    [shootingType: string]: number
  }
};
