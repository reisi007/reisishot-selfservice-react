import { useTranslation } from 'react-i18next';
import { Referrable } from '../referral.api';

export function RegisterForm({ referrer }: Referrable) {
  const { t } = useTranslation();
  return (
    <h2>
      {t('waitlist.titles.register')}
      {referrer}
    </h2>
  );
}
