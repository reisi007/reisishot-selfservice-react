import {CSSProperties} from 'react';
import {CHART_SETTINGS, ChartVisibilities} from '../../../charts/helper';
import {StyledButton} from '../../../components/StyledButton';

function computeStyle(color: string, isVisible: any) {
  const untoggledStyle: CSSProperties = {borderColor: color};
  const toggledStyle: CSSProperties = {backgroundColor: color, borderColor: color, color: 'white'};
  return isVisible ? toggledStyle : untoggledStyle;
}

export type SetChartVisibilityType = (callback: (data: ChartVisibilities) => void) => void;

export function ShootingTypeLegend(props: { visibilities: ChartVisibilities, setVisibilities: SetChartVisibilityType }) {
  const {visibilities, setVisibilities} = props;
  return <>
    <ul className="flex flex-wrap justify-center items-stretch mb-4">
      {Object.entries(CHART_SETTINGS)
             .map(([value, {color}]) => {
               const isVisible = visibilities[value] ?? true;

               const style = computeStyle(color, isVisible);
               return <li className="m-2 text-sm list-none" style={{color}}
                          key={value}>
                 <StyledButton style={style} className="py-1 px-4 rounded-lg border"
                               onClick={() => setVisibilities(v => v[value] = !v[value])}><>{value}</>
                 </StyledButton>

               </li>;

             })
      }
    </ul>
  </>;
}
