import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { LoginData } from '../utils/LoginData';
import { DisplayContract } from './DisplayContract';
import { SignAction } from './SignAction';
import { useGetContractData } from './contract-private.api';
import { LoadingIndicator } from '../LoadingIndicator';
import { Loadable } from '../components/Loadable';

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
      {loginData !== undefined && (
        <LoadContractData loginData={loginData} />
      )}
    </>
  );
}

function LoadContractData({ loginData }: { loginData: LoginData }) {
  const [{
    data,
    loading,
    error,
  }] = useGetContractData(loginData);
  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
      {(response) => (
        <>
          <DisplayContract loginData={loginData} contractData={response} />
          <SignAction loginData={loginData} dsgvo={response.dsgvo_markdown} />
        </>
      )}
    </Loadable>
  );
}
