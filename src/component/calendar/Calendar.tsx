import {ShootingDateEntry, ShootingSlotState} from '../../admin/admin.api';
import React, {HTMLProps, useMemo} from 'react';
import {CalendarWeekAvailability} from './CalendarWeekAvailability';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';

type RowCreator = (e: CalendarWeekAvailability, idx: number) => React.ReactElement<HTMLProps<HTMLDataListElement>>;
type Props = { data: Array<ShootingDateEntry>, weeks: number, rowCreator?: RowCreator, children?: React.ReactElement }

const defaultRowCreator = (e: CalendarWeekAvailability, idx: number) => <CalendarRow key={idx} data={e}/>;

export function Calendar({data, weeks, children, rowCreator = defaultRowCreator}: Props) {
  const {t} = useTranslation();
  const rows = useMemo(() => prepareDate(data, weeks)
    .map(rowCreator), [data, rowCreator, weeks],
  );
  return <>
    <h2 className="mb-2"> {t('calendar.title')}</h2>
    {children}
    <ul className="flex flex-col justify-center mx-auto w-full md:w-1/2">{rows}</ul>
  </>;
}


const prepareDate = (values: Array<ShootingDateEntry>, displayedWeeks: number): Array<CalendarWeekAvailability> => {
  const calculationOffset = 1;
  const startWeek = dayjs()
    .add(-calculationOffset, 'weeks');
  const weeks = displayedWeeks + 2 * calculationOffset;

  // Set all green
  const computedValues = new Array<CalendarWeekAvailability>();
  for(let i = 0; i < weeks; i++) {
    computedValues.push(
      new CalendarWeekAvailability(startWeek.add(i, 'weeks')),
    );
  }

  values.forEach(event => {
    computedValues.forEach((consumer) => {
      consumer.process(event);
    });
  });

  computedValues.forEach((consumer, idx) => consumer.process(computedValues, idx));
  computedValues.forEach((consumer) => consumer.process(computedValues, computedValues.length));

  return computedValues.slice(calculationOffset, -calculationOffset);
};

function CalendarRow({data}: { data: CalendarWeekAvailability }) {
  const {t} = useTranslation();
  const {state, calendarWeek, text: rawText = ''} = data;
  return <>
    {rawText.split('&&').map((_text, i) => {
      const idx = _text.indexOf('|');
      let text = (idx > 0 ? _text.substring(0, idx) : _text).trim();
      if(text.length > 0) {
        text = `(${text})`;
      }
      const final = `KW ${calendarWeek.kw().toString(10).padStart(2, '0')} - ${t('calendar.weekFrom')} ${calendarWeek.format()} ${text}`;
      return <li key={i}
                 className={getCellColor(state) + '  text-center flex items-center justify-center p-2'}><Emoji
        text={_text}/><span
        className="grow">{final}</span>
      </li>;
    })}
  </>;
}

const _RAW_EMOJI_DATA: { [key: string]: string | Array<string> } = {
  '🌇': 'Sonnenuntergang',
  '🛋️': 'Indoor',
  '🏞️': 'Outdoor',
  '👙': 'Boudoir',
  '👧': ['Portrait', 'Porträt'],
  '🐶': 'Hund',
  '❓❓': '??',
};

const EMOJI_CONFIG: Array<[string, Array<string>]> = Object.entries(_RAW_EMOJI_DATA)
                                                           .map(data => {
                                                             const [key, value] = data;
                                                             if(typeof value == 'string') {
                                                               return [key, [value.toLowerCase()]];
                                                             }
                                                             else {
                                                               return [key, value.map(e => e.toLowerCase())];
                                                             }
                                                           });


export function Emoji({text: _text}: { text: string }) {
  const text = _text.toLowerCase();
  let emojis = '';
  for(const [key, value] of EMOJI_CONFIG) {
    const includes = value.some(v => text.includes(v));
    if(includes) {
      emojis += key;
    }

  }
  return <>
    {!!emojis && <span
        className="inline-flex justify-self-start items-center p-1 text-left align-middle bg-white rounded-lg">{emojis}</span>}
  </>;
}


function getCellColor(state: ShootingSlotState): string {
  switch(state) {
    case ShootingSlotState.BLOCKED:
      return 'text-white bg-gray-500';
    case ShootingSlotState.BUSY:
      return 'text-black bg-yellow-300';
    case ShootingSlotState.FREE:
      return 'text-white bg-reisishot';
    case ShootingSlotState.TAKEN:
      return 'text-white bg-red-500';
    case ShootingSlotState.NOT_YET_OPENED:
      return 'text-gray-700 bg-gray-300';
    default:
      return neverException(state);
  }
}


function neverException(e: never): never {
  throw Error('This should never happen: ' + e);
}
