import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useWaitlistLogin } from '../WaitlistContextProvider';
import { LoadingIndicator } from '../../LoadingIndicator';

function WaitForRedirect({
  email,
  hash,
  chooseId,
}: { email: string, hash: string, chooseId: string }) {
  const [loginData, setLoginData] = useWaitlistLogin();
  const navigate = useNavigate();
  setLoginData({
    user: email,
    auth: hash,
  });
  useEffect(() => {
    if (loginData === undefined) return;
    const {
      user,
      auth,
    } = loginData;
    if (user === email && hash === auth) {
      navigate(`/waitlist/choose/${chooseId}`);
    }
  }, [chooseId, email, hash, loginData, navigate]);
  return <LoadingIndicator />;
}

export function EmaiChooselLanding() {
  const {
    email,
    hash,
    choose_id: chooseId,
  } = useParams<'email' | 'hash' | 'choose_id'>();
  if (email === undefined || hash === undefined || chooseId === undefined) {
    return <Navigate to="/waitlist" />;
  }
  return <WaitForRedirect email={email} hash={hash} chooseId={chooseId} />;
}
