import { useTranslation } from 'react-i18next';
import { LoginDataProps } from '../../utils/LoginData';
import { useWaitlistAdminData } from './waitlist.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ShootingOverview } from './ShootingOverview';
import { Leaderboard } from './Leaderboard';
import { IgnoredPersons } from './IgnoredPersons';

export function Waitlist({ loginData }: LoginDataProps) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }] = useWaitlistAdminData(loginData);

  return (
    <>
      <h1 className="py-2 text-4xl">{t('admin.waitlist.titles.main')}</h1>
      <Loadable
        data={data}
        loading={loading}
        error={error}
        loadingElement={(<LoadingIndicator />)}
      >
        {(d) => (
          <>
            <ShootingOverview data={d.registrations} loginData={loginData} />
            <IgnoredPersons data={d.blocked} />
            <Leaderboard data={d.leaderboard} loginData={loginData} />
          </>
        )}
      </Loadable>
    </>
  );
}
