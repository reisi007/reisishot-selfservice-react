import React, {useState} from 'react';
import {LoadingIndicator} from '../LoadingIndicator';
import {ShootingDateEntry, useCalendarData} from './admin.api';
import {Calendar} from '../component/calendar/Calendar';
import {useTranslation} from 'react-i18next';
import {useAdminLogin} from './useAdminLogin';
import {LoginForm} from './LoginForm';
import {Loadable} from '../component/Loadable';


function CalendarWithSlider({data}: { data: Array<ShootingDateEntry> }) {
  const {t} = useTranslation();
  const [weekSliderValue, setWeekSliderValue] = useState(8);
  return <Calendar weeks={weekSliderValue} data={data}>
    <div className="flex justify-center items-center text-center">
      <input name="weekSlider" value={weekSliderValue}
             onChange={e => setWeekSliderValue(parseInt(e.target.value, 10))} max={20} min={4}
             className="mr-2 accent-reisishot" type="range"/>
      <label htmlFor="weekSlider">{weekSliderValue + ' ' + t('calendar.weeks')}</label>
    </div>
  </Calendar>;
}

export function Login() {
  const {t} = useTranslation();
  const [loginInfo, setLoginInfo] = useAdminLogin();
  const calendarData = useCalendarData(loginInfo);

  return <div className="container">
    <h1 className="mb-2">{t('admin.login')}</h1>
    <Loadable result={calendarData} loadingElement={<LoadingIndicator height="20rem"/>}
              displayData={data => <CalendarWithSlider data={data}/>}></Loadable>
    {!loginInfo && <LoginForm setData={setLoginInfo}/>}
  </div>;
}
