import { Navigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useWaitlistLogin } from '../WaitlistContextProvider';
import { useWaitlistPerson } from './waitlist-private.api';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Loadable } from '../../components/Loadable';
import { LoginData } from '../../utils/LoginData';
import { NavigateToReview } from '../../review/LinkToReview';

export function EmailReviewLanding() {
  const {
    email,
    hash,
  } = useParams<'email' | 'hash'>();
  if (email === undefined || hash === undefined) {
    return <Navigate to="/waitlist" />;
  }
  return <EmailReviewInternalLanding email={email} hash={hash} />;
}

function EmailReviewInternalLanding({
  email,
  hash,
}: { email: string, hash: string }) {
  const [, setLoginData] = useWaitlistLogin();
  const loginData: LoginData = useMemo(() => ({
    user: email,
    auth: hash,
  }), [email, hash]);
  setLoginData(loginData);
  const [{
    data,
    loading,
    error,
  }] = useWaitlistPerson(loginData);
  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
      {(result) => <NavigateToReview person={result} />}
    </Loadable>
  );
}
