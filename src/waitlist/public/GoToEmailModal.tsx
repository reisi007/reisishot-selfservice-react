import { useTranslation } from 'react-i18next';
import { useModal } from '../../components/Modal';

export function GoToEmailModal() {
  const { t } = useTranslation();
  const [modal] = useModal(t('waitlist.openEmail'), undefined, true);
  return <>{modal}</>;
}
