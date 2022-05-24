import {TooltipProps} from 'recharts';
import {ChartVisibilities, YearTotals} from './helper';

export function withAbsoluteTooltip(totals: YearTotals, visibilities: ChartVisibilities) {
  return (props: TooltipProps<number, string>) => (
    <AbsoluteTooltip {...props} visibilities={visibilities} totals={totals}/>);
}

function AbsoluteTooltip({
                           active,
                           payload,
                           label,
                           totals,
                           visibilities,
                         }: TooltipProps<number, string> & { totals: YearTotals, visibilities: ChartVisibilities }) {
  return <>
    {active && <div className="py-2 px-4 bg-white rounded-lg shadow-xl">
        <p className="text-center">{label}</p>
        <ul>
          {payload !== undefined && payload
            .filter(({name = ''}) => visibilities[name] ?? true)
            .map(({name = '', value, color}) => {
              return <li key={name} style={{color}}>{`${name}: ${value}/${totals[label] ?? ''}`}</li>;
            })}
        </ul>
    </div>
    }
  </>;
}

export type ChartData = {
  year: string,
  data: {
    [shootingType: string]: number
  }
}

