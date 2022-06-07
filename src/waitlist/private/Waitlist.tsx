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

export function Waitlist({ loginData }: { loginData: LoginData }) {
  const { user } = loginData;
  const { t } = useTranslation();
  const request = usePrivateWaitlistItems(loginData);
  return (
    <>
      <h1 className="mb-2 text-4xl font-thin">
        {t('waitlist.titles.private')}
      </h1>
      <PersonalInformation loginData={loginData} />
      <ContactMe />
      <PublicCalendar weeks={8} />
      <Loadable request={request} loadingElement={<LoadingIndicator height="10rem" />}>
        {(data) => <DisplayWaitlistItems items={data}>{(item) => <WaitlistActionButton item={item} loginData={loginData} />}</DisplayWaitlistItems>}
      </Loadable>
    </>
  );
}
