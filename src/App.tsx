import { Suspense } from 'react';
import {
  BrowserRouter as Router, Navigate, Route, Routes,
} from 'react-router-dom';

import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import { useAdminRoutes } from './admin/routes';
import { useContractRoutes } from './contract/routes';
import { TrackPageView } from './Matomo';

// Configure useAxiosCache
configure({
  cache: new LRU({
    ttl: 60_000,
    max: 1_000,
  }),
});

function App() {
  const adminRoutes = useAdminRoutes();
  const contractRoutes = useContractRoutes();

  return (
    <div className="container p-4">
      <Router>
        <Suspense fallback={<div />}>
          <TrackPageView />
          <Routes>
            <Route />
            {adminRoutes}
            {contractRoutes}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
