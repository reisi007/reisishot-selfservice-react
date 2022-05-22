import {useAdminLogin} from './useAdminLogin';
import React, {lazy} from 'react';
import {Navigate, Outlet, Route} from 'react-router-dom';

export function useAdminRoutes() {
  const [loginData] = useAdminLogin();

  const AdminMenu = lazy(() => {
    return import('./Admin.module').then(m => ({default: (m => m.LazyAdminMenu)(m)}));
  });
  const Login = lazyPage(m => m.LoginPage);
  const Stats = lazyPage(m => m.StatisticsPage);


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


function lazyPage(selector: (m: typeof import('./Admin.module')) => () => JSX.Element) {
  return lazy(() => import('./Admin.module').then(m => {
    return ({default: selector(m)});
  }));
}
