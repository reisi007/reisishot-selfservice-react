import { useTranslation } from 'react-i18next';
import { LoginData } from '../../utils/LoginData';
import { RequestActionButton } from './ActionButton';
import { AdminWaitlistRecord } from './waitlist.api';
import { useAddPoints } from '../../waitlist/referral.api';

export function AssessPerson({
  loginData,
  registration,
}: { loginData: LoginData, registration: AdminWaitlistRecord }) {
  const { t } = useTranslation();
  const [request, post] = useAddPoints();
  const { email } = registration;
  return (
    <>
      <RequestActionButton
        onClick={() => {
          post({
            email,
            directAction: 'shooting_good',
            referrerAction: 'shooting_referred_good',
          }, loginData);
        }}
        className="text-white bg-reisishot"
        request={request}
      >
        {t('admin.waitlist.positive')}
      </RequestActionButton>
      <RequestActionButton
        onClick={() => {
          post({
            email,
            directAction: 'shooting_bad',
            referrerAction: 'shooting_referred_bad',
          }, loginData);
        }}
        className="text-white bg-red-500"
        request={request}
      >
        {t('admin.waitlist.negative')}
      </RequestActionButton>
    </>
  );
}
