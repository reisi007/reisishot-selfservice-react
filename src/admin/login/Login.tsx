import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Calendar } from '../../components/calendar/Calendar';
import { LoginForm } from './LoginForm';
import { Loadable } from '../../components/Loadable';
import { useAdminLogin } from '../AdminLoginContextProvider';
import { ShootingDateEntry, useCalendarData } from '../../components/calendar/calendar.api';

function CalendarWithSlider({ data }: { data: Array<ShootingDateEntry> }) {
  const { t } = useTranslation();
  const [weekSliderValueInternal, setWeekSliderValue] = useState(8);
  const [weekSliderValue] = useDebounce(weekSliderValueInternal, 300, { maxWait: 500 });

  return (
    <Calendar weeks={weekSliderValue} data={data}>
      <div className="flex justify-center items-center text-center">
        <input
          name="weekSlider"
          value={weekSliderValueInternal}
          onChange={(e) => setWeekSliderValue(parseInt(e.target.value, 10))}
          max={20}
          min={4}
          className="mr-2 accent-reisishot"
          type="range"
        />
        <label htmlFor="weekSlider">{`${weekSliderValueInternal} ${t('calendar.weeks')}`}</label>
      </div>
    </Calendar>
  );
}

export function Login() {
  const { t } = useTranslation();
  const [loginInfo, setLoginInfo] = useAdminLogin();
  const [{
    data,
    loading,
    error,
  }] = useCalendarData(loginInfo);

  return (
    <div className="container">
      <h1 className="mb-2">{t('admin.login.title')}</h1>
      {!loginInfo && <LoginForm setData={setLoginInfo} />}
      <Loadable
        data={data}
        loading={loading}
        error={error}
        loadingElement={<LoadingIndicator height="20rem" />}
      >
        {(response) => <CalendarWithSlider data={response} />}
      </Loadable>
    </div>
  );
}
