import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Root from './Root';

function App() {
  return (
    <div className={`container w-100 h-100 py-4`}>
      <Router>
        <Suspense fallback={<div/>}>
          <Routes>
            <Route path="" element={<Root/>}></Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
