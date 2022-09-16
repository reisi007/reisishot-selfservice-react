import { Suspense } from 'react';
import {
  BrowserRouter as Router, Navigate, Route, Routes,
} from 'react-router-dom';

import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import Root from './Root';
import { useAdminRoutes } from './admin/routes';
import { useWaitlistRoutes } from './waitlist/routes';
import { useContractRoutes } from './contract/routes';
import { useReviewRoutes } from './review/routes';
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
  const waitlistRoutes = useWaitlistRoutes();
  const contractRoutes = useContractRoutes();
  const reviewRoutes = useReviewRoutes();

  return (
    <div className="container p-4">
      <Router>
        <Suspense fallback={<div />}>
          <TrackPageView />
          <Routes>
            <Route index element={<Root />} />
            {waitlistRoutes}
            {adminRoutes}
            {contractRoutes}
            {reviewRoutes}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
