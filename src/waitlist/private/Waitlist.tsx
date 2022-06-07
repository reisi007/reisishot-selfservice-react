import { useTranslation } from 'react-i18next';
import { LoginData } from '../../utils/LoginData';
import { usePrivateWaitlistItems } from './waitlist-private.api';
import { DisplayWaitlistItems } from '../shared/DisplayWaitlistItems';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { WaitlistActionButton } from './WaitlistActionButton';

export function Waitlist({ loginData }: { loginData: LoginData }) {
  const { user } = loginData;
  const { t } = useTranslation();
  const request = usePrivateWaitlistItems(loginData);
  return (
    <>
      <h1>
        {t('waitlist.titles.private')}
      </h1>
      <Loadable request={request} loadingElement={<LoadingIndicator height="10rem" />}>
        {(data) => <DisplayWaitlistItems items={data}>{(item) => <WaitlistActionButton item={item} loginData={loginData} />}</DisplayWaitlistItems>}
      </Loadable>
    </>
  );
}
