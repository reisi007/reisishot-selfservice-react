import { Navigate, useParams } from 'react-router-dom';
import { useWaitlistLogin } from '../WaitlistContextProvider';

export function EmaiChooselLanding() {
  const [, setLoginData] = useWaitlistLogin();
  const {
    email,
    hash,
    choose_id: chooseId,
  } = useParams<'email' | 'hash' | 'choose_id'>();
  if (email === undefined || hash === undefined || chooseId === undefined) {
    return <Navigate to="/waitlist" />;
  }
  setLoginData({
    user: email,
    auth: hash,
  });
  return <Navigate to={`waitlist/choose/${chooseId}`} />;
}
