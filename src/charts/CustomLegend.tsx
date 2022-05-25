import {Props} from 'recharts/types/component/DefaultLegendContent';
import {CSSProperties} from 'react';
import {CHART_SETTINGS, ChartVisibilities} from './helper';

function computeStyle(color: string, isVisible: any) {
  const untoggledStyle: CSSProperties = {borderColor: color};
  const toggledStyle: CSSProperties = {backgroundColor: color, borderColor: color, color: 'white'};
  return isVisible ? toggledStyle : untoggledStyle;
}

export type SetChartVisibilityType = (callback: (data: ChartVisibilities) => void) => void;

export function CustomLegend(props: Props & { visibilities: ChartVisibilities, setVisibilities: SetChartVisibilityType }) {
  const {payload, visibilities, setVisibilities} = props;
  const sortHelper = Object.keys(CHART_SETTINGS);
  return <>
    <ul className="flex flex-wrap justify-center items-stretch mb-4">
      {payload !== undefined && payload.map((payload) => {
        const {value, color = 'black'} = payload;
        const isVisible = visibilities[value] ?? true;
        const order = sortHelper.indexOf(value) + 1;

        const style = computeStyle(color, isVisible);
        return <li className="m-2 list-none" style={{color, order}}
                   key={value}>
          <button style={style} className="py-1 px-4 rounded-lg border"
                  onClick={() => setVisibilities(v => v[value] = !v[value])}>{value}</button>
        </li>;
      })}
    </ul>
  </>;
}
