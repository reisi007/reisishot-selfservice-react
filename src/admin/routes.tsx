import {Navigate, Outlet, Route} from 'react-router-dom';
import {lazyInternal, ReactFunctionComponent} from '../lazy';
import {useAdminLogin} from './AdminLoginContextProvider';
import {withLoginData} from './login/LoginData';

export function useAdminRoutes() {
  const [loginData] = useAdminLogin();

  const AdminMenu = lazy(m => m.LazyAdminMenu);
  const Login = lazy(m => m.LoginPage);
  const Waitlist = lazy(m => m.WaitlistPage);
  const Stats = lazy(m => m.StatisticsPage);
  const Contracts = lazy(m => m.ContractsPage);

  const adminArea = withLoginData(loginData, data =>
    <>
      <Route path="statistics" element={<Stats loginData={data}/>}/>
      <Route path="contracts" element={<Contracts loginData={data}/>}/>
      <Route path="waitlist" element={<Waitlist loginData={data}/>}/>
    </>,
  );

  return <Route path="/dashboard" element={
    <>
      <AdminMenu/>
      <Outlet/>
    </>
  }>
    {adminArea}
    <Route index element={<Login/>}/>
    <Route path="*" element={<Navigate to="../"/>}/>
  </Route>;
}


function lazy<T>(selector: (m: typeof import('./Admin.module')) => ReactFunctionComponent<T>) {
  return lazyInternal(import('./Admin.module'), selector);
}
