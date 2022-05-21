import React, {useCallback} from 'react';
import {LoadingIndicator} from '../LoadingIndicator';
import {ShootingDateEntry, useCalendarData} from './admin.api';
import {Calendar} from './Calendar';

export function Login() {
  const {loading, error, data} = useCalendarData();
  const rowCreator = useCallback((e: ShootingDateEntry, idx: number) => <li
    key={idx}>{e.kw + ' ' + e.state + ' ' + (e.text ?? '')}</li>, []);

  return <div className="container">
    <h1>Login</h1>
    <pre>{JSON.stringify({loading, error, data})}</pre>
    {loading && <LoadingIndicator height="20rem"/>}
    {error && ':\'/'}
    {
      data && <Calendar data={data} rowCreator={rowCreator}/>
    }
  </div>;
}
