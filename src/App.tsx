import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Root from './Root';
import {CachePolicies, Provider} from 'use-http';
import {HOST} from './env';

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
        <Provider url={HOST} options={{
          cachePolicy: CachePolicies.CACHE_FIRST,
          cacheLife: 60,
        }}>
          <Suspense fallback={<div/>}>
            <Routes>
              <Route path="" element={<Root/>}></Route>
              <Route path="/dashboard">
                {useAdminRoutes()}
              </Route>
            </Routes>
          </Suspense>
        </Provider>
      </Router>
    </div>
  );
}

export default App;
