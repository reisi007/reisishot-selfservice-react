import { useTranslation } from 'react-i18next';
import { LoginDataProps } from '../login/LoginData';
import { useWaitlistAdminData } from './waitlist.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ShootingOverview } from './ShootingOverview';
import { PendingContractsOverview } from './PendingContractsOverview';
import { Leaderboard } from './Leaderboard';

export function Waitlist({ loginData }: LoginDataProps) {
  const { t } = useTranslation();
  const data = useWaitlistAdminData(loginData);

  return (
    <>
      <h1 className="py-2 text-4xl">{t('admin.waitlist.titles.main')}</h1>
      <Loadable
        result={data}
        loadingElement={(
          <LoadingIndicator height="10rem" />
)}
      >
        {(d) => (
          <>
            <PendingContractsOverview data={d.pendingContracts} loginData={loginData} />
            <ShootingOverview data={d.registrations} loginData={loginData} />
            <Leaderboard data={d.leaderboard} loginData={loginData} />
          </>
        )}
      </Loadable>
    </>
  );
}
