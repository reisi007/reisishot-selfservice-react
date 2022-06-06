import { useTranslation } from 'react-i18next';
import { Referrable } from '../referral.api';

export function LoginForm({ referrer }: Referrable) {
  const { t } = useTranslation();
  return (
    <h2>
      {t('waitlist.titles.login')}
      {referrer}
    </h2>
  );
}
