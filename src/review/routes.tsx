import { Navigate, Route } from 'react-router-dom';
import { lazyInternal, ReactFunctionComponent } from '../lazy';
import { MODE_DEBUG } from '../env';

export function useReviewRoutes() {
  const Review = lazy((m) => m.ReviewPage);
  // TODO only available in DEBUG mode -> remove that
  return MODE_DEBUG && (
    <Route path="/reviews">
      <Route index element={<Navigate to="write" />} />
      <Route path="write" element={<Review />} />
      <Route path="*" element={<Navigate to="../" />} />
    </Route>
  );
}

function lazy<T>(selector: (m: typeof import('./Review.module')) => ReactFunctionComponent<T>) {
  return lazyInternal(import('./Review.module'), selector);
}
