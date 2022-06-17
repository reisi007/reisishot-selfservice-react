import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginData } from '../../../utils/LoginData';
import { useDefaultTabGroup } from '../../../components/TabGroup.default';
import { TabProps, UseProps } from '../../../components/TabGroup';
import { useAdminWaitlistLinks } from '../waitlist.api';
import { Loadable } from '../../../components/Loadable';
import { LoadingIndicator } from '../../../LoadingIndicator';
import { useModal } from '../../../components/Modal';
import { StyledButton, StyledLinkButton } from '../../../components/StyledButton';
import { FormattedDate } from '../../../utils/Age';

export function WaitlistSupport({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const tabs: UseProps<LoginData>['tabs'] = useMemo(() => ({
    [t('admin.waitlist.support.tabs.waitlist-links.title')]: WaitlistLinkSupport,
  }), [t]);

  const [tabGroup] = useDefaultTabGroup({
    loginData,
    tabs,
  });
  const [modal, showModal] = useModal(t('admin.waitlist.support.tabs.title'), () => tabGroup);

  return (
    <>
      <div className="flex justify-center items-center">
        <StyledButton
          onClick={() => showModal(true)}
        >
          {t('admin.waitlist.support.open')}
        </StyledButton>
      </div>
      {modal}
    </>
  );
}

function WaitlistLinkSupport({
  data: loginData,
}: TabProps<LoginData>) {
  const [request] = useAdminWaitlistLinks(loginData);
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('admin.waitlist.support.tabs.waitlist-links.title')}</h2>
      <Loadable {...request} loadingElement={<LoadingIndicator height="10rem" />}>
        {(result) => (
          <div className="grid gap-2 m-2 md:grid-cols-2">
            {result.map(({
              email,
              firstName,
              lastName,
              birthday,
              url,
            }) => (
              <StyledLinkButton
                key={url}
                href={url}
                onClick={(event) => {
                  navigator.clipboard.writeText(url);
                  event.preventDefault();
                }}
              >
                <>
                  {firstName}
                  {' '}
                  {lastName}
                  <br />
                  {email}
                </>
                <FormattedDate dateString={birthday} />
              </StyledLinkButton>
            ))}
          </div>
        )}
      </Loadable>
    </>
  );
}
