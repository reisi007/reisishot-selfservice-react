import { useTranslation } from 'react-i18next';
import { PendingSignaturInformation } from './waitlist.api';
import { formatDate } from '../../utils/Age';
import { LoginData } from '../login/LoginData';

type Props = { data: Array<PendingSignaturInformation>, loginData: LoginData };

export function PendingContractsOverview({ data }: Props) {
  const { t } = useTranslation();
  return (
    <>
      {data.length > 0 && (
        <>
          <h2>{t('admin.waitlist.pendingSignatures.title')}</h2>
          <ul>
            {data.map((item) => (
              <>
                {t('admin.waitlist.pendingSignatures.text', { dueDate: formatDate(item.due_date) })}
              </>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
