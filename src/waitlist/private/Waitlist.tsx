import { useTranslation } from 'react-i18next';
import { LoginData } from '../../utils/LoginData';
import { usePrivateWaitlistItems } from './waitlist-private.api';
import { DisplayWaitlistItems } from '../shared/DisplayWaitlistItems';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { WaitlistActionButton } from './WaitlistActionButton';
import { PublicCalendar } from '../../components/calendar/PublicCalendar';
import { ContactMe } from '../shared/ContactMe';
import { PersonalInformation } from './PersonalInformation';
import { Selfservice } from './selfservice/Selfservice';

export function Waitlist({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }] = usePrivateWaitlistItems(loginData);
  return (
    <>
      <h1 className="mb-2 text-4xl font-thin">
        {t('waitlist.titles.private')}
      </h1>
      <PersonalInformation loginData={loginData} />
      <ContactMe />
      <Selfservice loginData={loginData} />
      <PublicCalendar weeks={8} />
      <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
        {(response) => <DisplayWaitlistItems items={response}>{(item) => <WaitlistActionButton item={item} loginData={loginData} />}</DisplayWaitlistItems>}
      </Loadable>
    </>
  );
}
