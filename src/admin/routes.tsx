import {useAdminLogin} from './useAdminLogin';
import React from 'react';
import {Navigate, Outlet, Route} from 'react-router-dom';
import {lazyInternal, ReactFunctionComponent} from '../lazy';

export function useAdminRoutes() {
  const [loginData] = useAdminLogin();

  const AdminMenu = lazy(m => m.LazyAdminMenu);
  const Login = lazy(m => m.LoginPage);
  const Stats = lazy(m => m.StatisticsPage);

  const isUserLoggedIn = loginData !== undefined;
  return <Route path="/dashboard" element={
    <>
      <AdminMenu isUserLoggedIn={isUserLoggedIn}/>
      <Outlet/>
    </>
  }>

    {isUserLoggedIn &&
     <>
         <Route path="statistics" element={<Stats/>}/>
     </>
    }
    <Route index element={<Login/>}/>
    <Route path="*" element={<Navigate to="../"/>}/>
  </Route>;
}


function lazy<T>(selector: (m: typeof import('./Admin.module')) => ReactFunctionComponent<T>) {
  return lazyInternal(import('./Admin.module'), selector);
}
