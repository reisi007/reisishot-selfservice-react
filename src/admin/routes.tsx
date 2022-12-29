import { Navigate, Outlet, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { lazyInternal, ReactFunctionComponent } from '../lazy';
import { useAdminLogin } from './AdminLoginContextProvider';
import { withLoginData } from '../utils/LoginData';

export function useAdminRoutes() {
  const [loginData] = useAdminLogin();

  const AdminMenu = lazy((m) => m.LazyAdminMenu);
  const Login = lazy((m) => m.LoginPage);
  const Contracts = lazy((m) => m.ContractsPage);
  const Review = lazy((m) => m.ReviewPage);

  const adminArea = withLoginData(loginData, (data) => (
    <>
      <Route path="contracts" element={<Contracts loginData={data} />} />
      <Route path="reviews" element={<Review loginData={data} />} />
    </>
  ));

  return (
    <Route
      path="/dashboard"
      element={(
        <>
          <AdminMenu />
          <Suspense fallback={<div />}>
            <Outlet />
          </Suspense>
        </>
      )}
    >
      {adminArea}
      <Route index element={<Login />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Route>
  );
}

function lazy<T>(selector: (m: typeof import('./Admin.module')) => ReactFunctionComponent<T>) {
  return lazyInternal(import('./Admin.module'), selector);
}
