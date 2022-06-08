import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { LoginData } from '../utils/LoginData';
import { DisplayContract } from './DisplayContract';

export function SignContract() {
  const {
    accessKey,
    email,
  } = useParams<'email' | 'accessKey'>();
  const navigate = useNavigate();

  if (accessKey === undefined || email === undefined) {
    navigate('/');
  }

  const loginData = useMemo((): LoginData | undefined => {
    if (email === undefined || accessKey === undefined) {
      return undefined;
    }
    return ({
      user: email,
      auth: accessKey,
    });
  }, [accessKey, email]);
  return (
    <>
      {loginData !== undefined && <DisplayContract loginData={loginData} />}
    </>
  );
}
