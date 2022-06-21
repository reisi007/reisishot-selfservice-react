import { useTranslation } from 'react-i18next';
import { useWaitlistAdminData } from '../waitlist/waitlist.api';
import { formatDateTime } from '../../utils/Age';
import { LoginData } from '../../utils/LoginData';
import { computeContractLink } from '../../utils/baseUrl';
import { TabProps } from '../../components/TabGroup';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { StyledCopyLinkButton } from '../../components/StyledCopyLinkButton';

export function PendingSignatureTab({ data: loginData }: TabProps<LoginData>) {
  const [request] = useWaitlistAdminData(loginData);
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('admin.waitlist.support.tabs.pendingSignatures.title')}</h2>
      <Loadable {...request} loadingElement={<LoadingIndicator />}>
        {(response) => (
          <>
            {response.pendingContracts.length > 0 && (
            <div className="grid gap-2 m-2 md:grid-cols-2">
              {response.pendingContracts.map(({
                due_date: dueDate,
                email,
                access_key: accessKey,
              }) => {
                const label = t('contracts.display.title', {
                  dateTime: formatDateTime(dueDate),
                  name: email,
                });
                const key = email + accessKey + dueDate;
                const url = computeContractLink({
                  user: email,
                  auth: accessKey,
                });
                return (
                  <StyledCopyLinkButton key={key} href={url}>
                    <p>
                      {label}
                    </p>
                  </StyledCopyLinkButton>
                );
              })}
            </div>
            )}
            {response.pendingContracts.length === 0 && t('admin.waitlist.support.tabs.pendingSignatures.done')}
          </>
        )}
      </Loadable>
    </>

  );
}
