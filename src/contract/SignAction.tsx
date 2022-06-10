import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginData } from '../utils/LoginData';
import { Loadable } from '../components/Loadable';
import { LoadingIndicator } from '../LoadingIndicator';
import { SignStatus, useSignStatus } from '../admin/contract/contract.api';
import { useGetLogEntries, usePutLogEntry } from './contract-private.api';
import { ActionButton, RequestActionButton } from '../admin/waitlist/ActionButton';
import { computeContractLink } from '../utils/baseUrl';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useModal } from '../components/Modal';
import { FormattedDateTime } from '../utils/Age';

export function SignAction({ loginData }: { loginData: LoginData }) {
  const [{
    data,
    loading,
    error,
  }, get] = useSignStatus(loginData);

  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
      {(response) => <SignActionArea cur={response} refetchSignStatus={get} loginData={loginData} />}
    </Loadable>
  );
}

function SignActionArea({
  loginData,
  refetchSignStatus,
  cur,
}: { loginData: LoginData, cur: Array<SignStatus>, refetchSignStatus: () => Promise<Array<SignStatus>> }) {
  const { t } = useTranslation();
  const isSigned = useMemo(() => cur.findIndex(({
    signed,
    email,
  }) => signed && email === loginData.user) >= 0, [cur, loginData.user]);

  const [{
    data,
    loading,
    error,
  }, putLogEntry] = usePutLogEntry(loginData);
  useEffect(() => {
    if (!isSigned) {
      putLogEntry({
        action: 'OPEN',
        baseUrl: computeContractLink(loginData),
      });
    }
  }, [isSigned, loginData, putLogEntry]);

  const signAction = useCallback(() => {
    putLogEntry({
      action: 'SIGN',
      baseUrl: computeContractLink(loginData),
    })
      .then(() => {
        refetchSignStatus();
      });
  }, [loginData, putLogEntry, refetchSignStatus]);

  const content = useCallback(() => <ViewLogModalContent loginData={loginData} />, [loginData]);
  const [logDetail, setLogDetailVisible] = useModal(t('contracts.display.log.title'), content);
  const [, refetchLogEntries] = useGetLogEntries(loginData);

  const dialogOpen = useCallback(() => {
    setLogDetailVisible(true);
    refetchLogEntries(undefined, { useCache: false });
  }, [refetchLogEntries, setLogDetailVisible]);
  return (
    <div className="grid gap-2 ">
      <RequestActionButton
        className="text-white bg-reisishot"
        data={data}
        loading={loading}
        error={error}
        onClick={signAction}
        disabled={isSigned}
      >
        {isSigned ? t('contracts.display.signDisabled') : t('contracts.display.sign')}
      </RequestActionButton>
      <ActionButton onClick={dialogOpen}>
        {t('contracts.display.log.details')}
      </ActionButton>
      {logDetail}
    </div>
  );
}

function ViewLogModalContent({ loginData }: { loginData: LoginData }) {
  const [{
    data,
    loading,
    error,
  }] = useGetLogEntries(loginData);
  const { t } = useTranslation();
  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
      {(response) => (
        <div className="grid gap-2 md:grid-cols-2 xxl:grid-cols-3">
          {response.map(({
            log_type: type,
            timestamp,
            email,
          }) => (
            <Card key={timestamp + type}>
              <h3>{email}</h3>
              <div className="flex justify-center items-center my-1"><Badge>{type}</Badge></div>
              <span className="text-sm text-center">
                <FormattedDateTime dateString={timestamp} />
              </span>
            </Card>
          ))}
        </div>
      )}
    </Loadable>
  );
}
