import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Root from './Root';

import {configure} from 'axios-hooks';
import LRU from 'lru-cache';
import {useAdminRoutes} from './admin/routes';

// Configure useAxiosCache
configure({cache: new LRU({ttl: 60_000, max: 1_000})});


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
