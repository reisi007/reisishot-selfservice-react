import {LoginDataProps} from '../login/LoginData';
import {useTranslation} from 'react-i18next';
import {useWaitlistAdminData, WaitlistItemWithRegistrations} from './waitlist.admin';
import {Loadable} from '../../components/Loadable';
import {LoadingIndicator} from '../../LoadingIndicator';
import {formatJson} from '../../utils/json';

export function Waitlist({loginData}: LoginDataProps) {
  const {t} = useTranslation();
  const data = useWaitlistAdminData(loginData);
  return <>
    <h1>{t('admin.waitlist.titles.main')}</h1>
    <Loadable result={data} loadingElement={<LoadingIndicator height="10rem"/>} displayData={
      (d) => <> <DisplayShootingOverview data={d.registrations}/></>
    }/>

  </>;
}

function DisplayShootingOverview({data}: { data: Array<WaitlistItemWithRegistrations> }) {

  const {t} = useTranslation();
  return <>
    <h2>{t('admin.waitlist.titles.registrations')}</h2>
    <div className="flex flex-wrap">
      <pre>{formatJson(data)}</pre>
    </div>
  </>;
}
