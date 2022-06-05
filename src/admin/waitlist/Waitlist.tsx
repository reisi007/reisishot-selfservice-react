import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { LoginDataProps } from '../login/LoginData';
import { useWaitlistAdminData, WaitlistAdminData } from './waitlist.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ShootingOverview } from './ShootingOverview';
import { PendingContractsOverview } from './PendingContractsOverview';
import { Leaderboard } from './Leaderboard';

export function Waitlist({ loginData }: LoginDataProps) {
  const { t } = useTranslation();
  const data = useWaitlistAdminData(loginData);
  const displayData = useCallback((d: WaitlistAdminData) => (
    <>
      <PendingContractsOverview data={d.pendingContracts} loginData={loginData} />
      <ShootingOverview data={d.registrations} loginData={loginData} />
      <Leaderboard data={d.leaderboard} loginData={loginData} />
    </>
  ), [loginData]);
  return (
    <>
      <h1 className="py-2 text-4xl">{t('admin.waitlist.titles.main')}</h1>
      <Loadable
        result={data}
        loadingElement={<LoadingIndicator height="10rem" />}
        displayData={displayData}
      />
    </>
  );
}
