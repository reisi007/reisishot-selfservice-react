import React, {Suspense} from 'react';
import {BrowserRouter as Router, Navigate, Outlet, Route, Routes} from 'react-router-dom';
import Root from './Root';

import {configure} from 'axios-hooks';
import LRU from 'lru-cache';
import {useAdminLogin} from './admin/useAdminLogin';

// Configure useAxiosCache
configure({cache: new LRU({ttl: 60_000, max: 1_000})});

function useAdminRoutes() {
  const [loginData] = useAdminLogin();

  const Login = React.lazy(
    () => import('./admin/Admin.module')
      .then(e => ({default: e.LoginPage})));
  const Stats = React.lazy(
    () => import('./admin/Admin.module')
      .then(e => ({default: e.StatisticsPage})));
  const AdminMenu = React.lazy(
    () => import('./admin/Admin.module')
      .then(e => ({default: e.LazyAdminMenu})));

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

function App() {
  return (
    <div className={`container w-full h-full`}>
      <Router>
        <Suspense fallback={<div/>}>
          <Routes>
            <Route index element={<Root/>}></Route>
            {useAdminRoutes()}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
