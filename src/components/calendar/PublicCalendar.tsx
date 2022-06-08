import { Calendar, Props as CalendarProps } from './Calendar';
import { useCalendarData } from './calendar.api';
import { Loadable } from '../Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';

export function PublicCalendar(props: Omit<CalendarProps, 'data' | 'rowCreator' | 'children'>) {
  const [{
    data,
    loading,
    error,
  }] = useCalendarData();
  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
      {(response) => <Calendar {...props} data={response} />}
    </Loadable>
  );
}
