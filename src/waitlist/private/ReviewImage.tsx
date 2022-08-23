import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginData } from '../../utils/LoginData';

export function ReviewImage({ loginData }: { loginData: LoginData }) {
  const { folder } = useParams<'folder'>();
  const { t } = useTranslation();
  console.log(loginData);
  return (
    <h1>{t('waitlist.titles.selfservice.tabs.choose_image.title')}</h1>
  );
}
