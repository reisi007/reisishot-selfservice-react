import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useModal } from '../../components/Modal';

export function GoToEmailModal() {
  const { t } = useTranslation();
  const content = useCallback(() => <p>{t('waitlist.openEmail')}</p>, [t]);
  const [modal] = useModal(content, true);
  return modal;
}
