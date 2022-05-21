import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Root from './Root';

import {configure} from 'axios-hooks';
import LRU from 'lru-cache';

// Configure useAxiosCache
configure({cache: new LRU({ttl: 60_000, max: 1_000})});

function useAdminRoutes() {
  const Login = React.lazy(
    () => import('./admin/Admin.module')
      .then(e => ({default: e.LoginPage})));
  return <>
    <Route path="*" element={<Login/>}></Route>
  </>;
}

function App() {
  return (
    <div className={`container w-full h-full py-4`}>
      <Router>
        <Suspense fallback={<div/>}>
          <Routes>
            <Route path="" element={<Root/>}></Route>
            <Route path="/dashboard">
              {useAdminRoutes()}
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
