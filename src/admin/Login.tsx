import React from 'react';
import {LoadingIndicator} from '../LoadingIndicator';
import {useCalendarData} from './admin.api';
import {Calendar} from '../component/calendar/Calendar';
import {useTranslation} from 'react-i18next';

export function Login() {
  const {t} = useTranslation();
  const [{data, loading, error}] = useCalendarData();


  return <div className="container">
    <h1 className="mb-2">{t('admin.login')}</h1>
    <>
      {loading && <LoadingIndicator height="20rem"/>}
      {error && JSON.stringify(error)}
      {data && <Calendar weeks={8} data={data}/>}
    </>
  </div>;
}
