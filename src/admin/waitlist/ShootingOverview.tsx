import {WaitlistItemWithRegistrations} from './waitlist.api';
import {useTranslation} from 'react-i18next';
import {Registration} from './Registration';
import {LoginData} from '../login/LoginData';

type ShootingOverviewProps = { data: Array<WaitlistItemWithRegistrations>, loginData: LoginData };

export function ShootingOverview({data, loginData}: ShootingOverviewProps) {
  const {t} = useTranslation();
  return <>
    <h2 className="text-3xl">{t('admin.waitlist.titles.registrations')}</h2>
    {data.map(e => <ShootingType key={e.short} item={e} loginData={loginData}/>)}
  </>;
}


function ShootingType({item, loginData}: { item: WaitlistItemWithRegistrations, loginData: LoginData }) {
  return <div className="py-2">
    <h3 className="my-3 text-2xl">{item.title}</h3>
    <div className="flex flex-wrap items-center">
      {item.registrations.map(e => <Registration key={e.person_id} loginData={loginData} registration={e}/>)}
    </div>
  </div>;
}
