import { Route } from 'react-router-dom';
import { lazyInternal, ReactFunctionComponent } from '../lazy';

export function useContractRoutes() {
  const DisplayContracts = lazy((m) => m.SignContractPage);

  return (
    <Route path="/contracts">
      <Route path=":email/:accessKey" element={<DisplayContracts />} />
    </Route>
  );
}

function lazy<T>(selector: (m: typeof import('./Contract.module')) => ReactFunctionComponent<T>) {
  return lazyInternal(import('./Contract.module'), selector);
}
