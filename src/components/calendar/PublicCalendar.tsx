import { Calendar, Props as CalendarProps } from './Calendar';
import { useCalendarData } from './calendar.api';
import { Loadable } from '../Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';

export function PublicCalendar(props: Omit<CalendarProps, 'data' | 'rowCreator' | 'children'>) {
  const request = useCalendarData();
  return (
    <Loadable request={request} loadingElement={<LoadingIndicator height="10rem" />}>
      {(data) => <Calendar {...props} data={data} />}
    </Loadable>
  );
}
