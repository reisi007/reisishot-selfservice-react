import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginData } from '../../utils/LoginData';
import { useDefaultTabGroup } from '../../components/TabGroup.default';
import { UseProps } from '../../components/TabGroup';
import { WaitlistLinkTab } from './WaitlistLinkTab';
import { PendingSignatureTab } from './PendingSignatureTab';

export function WaitlistSupport({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const tabs: UseProps<LoginData>['tabs'] = useMemo(() => ({
    [t('admin.waitlist.support.tabs.pendingSignatures.title')]: PendingSignatureTab,
    [t('admin.waitlist.support.tabs.waitlist-links.title')]: WaitlistLinkTab,
  }), [t]);

  const [tabGroup] = useDefaultTabGroup({
    loginData,
    tabs,
  });

  return (
    <>
      <h1 className="mb-2">{t('admin.waitlist.support.tabs.title')}</h1>
      {tabGroup}
    </>
  );
}
