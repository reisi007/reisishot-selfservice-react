import {Bar, BarChart, CartesianGrid, Tooltip, TooltipProps, XAxis, YAxis} from 'recharts';
import {StatisticChartProps} from '../Statistics';
import {ResponsiveContainer} from '../../../components/ResponsiveContainer';
import {AxisConfig, CHART_SETTINGS, renderLegendOnTop} from '../../../charts/helper';

type RenderBarType = (shootingType: string, isVisible: boolean, color: string) => JSX.Element;
type RenderTooltipType = (props: TooltipProps<number, string>) => JSX.Element;


type Props = {
  chartTitle: string,
  chartData: Array<YearChartData>,
  renderTooltip: RenderTooltipType,
  renderBar?: RenderBarType,
  chartProps: StatisticChartProps
  yAxisConfig?: AxisConfig
}

export function AdminStatisticsBarChart({
                                          chartTitle,
                                          chartData,
                                          renderTooltip,
                                          renderBar = DEFAULT_RENDER_BAR,
                                          chartProps,
                                          yAxisConfig,
                                        }: Props) {
  const {visibilities, setVisibilities} = chartProps;
  return <>
    <h3>{chartTitle}</h3>
    <ResponsiveContainer>
      {width =>
        <BarChart width={width} height={600} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          {renderLegendOnTop(visibilities, setVisibilities)}
          <XAxis dataKey="year"/>
          <YAxis type="number" unit={yAxisConfig?.unit} ticks={yAxisConfig?.ticks} domain={yAxisConfig?.domain}/>
          <Tooltip content={renderTooltip}/>
          {
            Object.entries(CHART_SETTINGS)
                  .sort(([a], [b]) => Number(visibilities[b]) - Number(visibilities[a]))
                  .map(([shootingType, {color}]) => {
                      const visibility = visibilities[shootingType] ?? true;
                      return renderBar(shootingType, visibility, color);
                    },
                  )
          }

        </BarChart>
      }
    </ResponsiveContainer>
  </>;
}

const DEFAULT_RENDER_BAR: RenderBarType = (shootingType: string, isVisible: boolean, color: string) => {
  return <Bar key={shootingType} dataKey={`data.${shootingType}`}
              visibility={isVisible ? undefined : 'collapse'} name={shootingType}
              stackId="a"
              fill={color}/>;
};

export type YearChartData = {
  year: string,
  data: {
    [shootingType: string]: number
  }
}
