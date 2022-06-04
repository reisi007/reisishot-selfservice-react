import {LoginData} from '../login/LoginData';
import {RequestActionButton} from './ActionButton';
import {useTranslation} from 'react-i18next';
import {AdminWaitlistRecord} from './waitlist.api';
import {ReferralType, useAddPointsDirect} from './referral.api';

export function AssessPerson({loginData, registration}: { loginData: LoginData, registration: AdminWaitlistRecord }) {
  const {t} = useTranslation();
  const [request, put] = useAddPointsDirect();

  const {email} = registration;
  return <>
    <RequestActionButton onClick={() => put({email, action: ReferralType.SHOOTING_GOOD}, loginData)}
                         className="text-white bg-reisishot"
                         request={request}>{t('waitlist.positive')}</RequestActionButton>
    <RequestActionButton onClick={() => put({email, action: ReferralType.SHOOTING_BAD}, loginData)}
                         className="text-white bg-red-500"
                         request={request}>{t('waitlist.negative')}</RequestActionButton>
  </>;
}
