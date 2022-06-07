import { useTranslation } from 'react-i18next';
import { LoginData } from '../../utils/LoginData';
import { RequestActionButton } from './ActionButton';
import { AdminWaitlistRecord } from './waitlist.api';
import { useAddPointsDirect } from '../../waitlist/referral.api';

export function AssessPerson({
  loginData,
  registration,
}: { loginData: LoginData, registration: AdminWaitlistRecord }) {
  const { t } = useTranslation();
  const [request, put] = useAddPointsDirect();

  const { email } = registration;
  return (
    <>
      <RequestActionButton
        onClick={() => put({
          email,
          action: 'shooting_good',
        }, loginData)}
        className="text-white bg-reisishot"
        request={request}
      >
        {t('admin.waitlist.positive')}
      </RequestActionButton>
      <RequestActionButton
        onClick={() => put({
          email,
          action: 'shooting_bad',
        }, loginData)}
        className="text-white bg-red-500"
        request={request}
      >
        {t('admin.waitlist.negative')}
      </RequestActionButton>
    </>
  );
}
