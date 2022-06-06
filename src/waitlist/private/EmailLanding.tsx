import { Navigate, useParams } from 'react-router-dom';
import { useWaitlistLogin } from '../WaitlistContextProvider';

export function EmailLanding() {
  const [, setLoginData] = useWaitlistLogin();
  const {
    email,
    hash,
  } = useParams<'email' | 'hash'>();
  if (email === undefined || hash === undefined) {
    return <Navigate to="/waitlist" />;
  }
  setLoginData({
    user: email,
    auth: hash,
  });
  return <Navigate to="/waitlist/book" />;
}
