import { useTranslation } from 'react-i18next';
import { LoginData } from '../../admin/login/LoginData';

export function Waitlist({ loginData }: { loginData: LoginData }) {
  const { user } = loginData;
  const { t } = useTranslation();
  return (
    <h1>
      {t('reviews.titles.private')}
    </h1>
  );
}
