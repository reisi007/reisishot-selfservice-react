import { TooltipProps } from 'recharts';
import { ChartVisibilities, Totals } from './helper';

export function withAbsoluteTooltip(totals: Totals, visibilities: ChartVisibilities) {
  return (props: TooltipProps<number, string>) => (
    <GenericTooltip
      {...props}
      totals={totals}
      visibilities={visibilities}
      renderDescription={RENDER_LEGEND_ITEM_ABSOLUTE}
    />
  );
}

export function withRelativeTooltip(totals: Totals, visibilities: ChartVisibilities) {
  return (props: TooltipProps<number, string>) => (
    <GenericTooltip
      {...props}
      totals={totals}
      visibilities={visibilities}
      renderDescription={RENDER_LEGEND_ITEM_RELATIVE}
    />
  );
}

type RenderDescriptionType = (name: string, value: number, totalCnt: number) => JSX.Element;
type GenericTooltipProps = TooltipProps<number, string>
& { totals: Totals, visibilities: ChartVisibilities, renderDescription: RenderDescriptionType };

function GenericTooltip({
  active,
  label,
  payload,
  visibilities,
  totals,
  renderDescription,
}: GenericTooltipProps) {
  const filteredPayload = payload !== undefined && payload !== null && payload
    .filter(({
      name = '',
      value,
    }) => value && (visibilities[name] ?? true));
  return (
    <>
      {filteredPayload && filteredPayload.length > 0 && active
       && (
         <div className="py-2 px-4 bg-white rounded-lg shadow-xl">
           <p className="text-center">{label}</p>
           <ul>
             {filteredPayload.map(({
               name = '',
               value,
               color,
             }) => (
               <li
                 key={name}
                 style={{ color }}
               >
                 {renderDescription(name, value ?? 0, totals[label ?? name])}
               </li>
             ))}
           </ul>
         </div>
       )}
    </>
  );
}

const RENDER_LEGEND_ITEM_ABSOLUTE: RenderDescriptionType = (name, value, total) => (
  <>
    {' '}
    {`${name}: ${value}/${total}`}
  </>
);
const RENDER_LEGEND_ITEM_RELATIVE: RenderDescriptionType = (name, value) => (
  <>
    {' '}
    {`${name}: ${value.toFixed(2)}%`}
  </>
);
