import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import Root from './Root';
import { useAdminRoutes } from './admin/routes';

// Configure useAxiosCache
configure({ cache: new LRU({ ttl: 60_000, max: 1_000 }) });

function App() {
  const adminRoutes = useAdminRoutes();
  return (
    <div className="container w-full h-full">
      <Router>
        <Suspense fallback={<div />}>
          <Routes>
            <Route index element={<Root />} />
            {adminRoutes}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
