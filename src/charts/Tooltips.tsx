import {TooltipProps} from 'recharts';
import {ChartVisibilities, YearTotals} from './helper';

export function withAbsoluteTooltip(totals: YearTotals, visibilities: ChartVisibilities) {
  return (props: TooltipProps<number, string>) => <GenericTooltip
    {...props}
    totals={totals}
    visibilities={visibilities}
    renderDescription={RENDER_LEGEND_ITEM_ABSOLUTE}
  />;
}

export function withRelativeTooltip(totals: YearTotals, visibilities: ChartVisibilities) {
  return (props: TooltipProps<number, string>) => <GenericTooltip
    {...props}
    totals={totals}
    visibilities={visibilities}
    renderDescription={RENDER_LEGEND_ITEM_RELATIVE}
  />;
}

type RenderDescriptionType = (name: string, value: number, totalCnt: number) => JSX.Element;
type GenericTooltipProps = TooltipProps<number, string>
  & { totals: YearTotals, visibilities: ChartVisibilities, renderDescription: RenderDescriptionType };

function GenericTooltip({active, label, payload, visibilities, totals, renderDescription}: GenericTooltipProps) {
  return <>
    {active && <div className="py-2 px-4 bg-white rounded-lg shadow-xl">
        <p className="text-center">{label}</p>
        <ul>
          {payload !== undefined && payload
            .filter(({name = ''}) => visibilities[name] ?? true)
            .map(({name = '', value, color}) => <li key={name}
                                                    style={{color}}>{renderDescription(name, value ?? 0, totals[label] ?? NaN)}</li>)}
        </ul>
    </div>
    }
  </>;
}

const RENDER_LEGEND_ITEM_ABSOLUTE: RenderDescriptionType = (name, value, total) => <> {`${name}: ${value}/${total}`}</>;
const RENDER_LEGEND_ITEM_RELATIVE: RenderDescriptionType = (name, value, _) => <> {`${name}: ${value.toFixed(2)}%`}</>;


