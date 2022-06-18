import { useTranslation } from 'react-i18next';
import { TabProps } from '../../components/TabGroup';
import { LoginData } from '../../utils/LoginData';
import { useAdminWaitlistLinks } from '../waitlist/waitlist.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { CalculatedBirthday, FormattedDate } from '../../utils/Age';
import { StyledCopyLinkButton } from '../../components/StyledCopyLinkButton';

export function WaitlistLinkTab({
  data: loginData,
}: TabProps<LoginData>) {
  const [request] = useAdminWaitlistLinks(loginData);
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('admin.waitlist.support.tabs.waitlist-links.title')}</h2>
      <Loadable {...request} loadingElement={<LoadingIndicator />}>
        {(result) => (
          <div className="grid gap-2 m-2 md:grid-cols-2">
            {result.map(({
              email,
              firstName,
              lastName,
              birthday,
              url,
            }) => (
              <StyledCopyLinkButton
                key={url}
                href={url}
              >
                <p>
                  {firstName}
                  {' '}
                  {lastName}
                  <br />
                  {email}
                </p>
                <FormattedDate dateString={birthday} />

                {' ('}
                <CalculatedBirthday dateString={birthday} />
                )
              </StyledCopyLinkButton>
            ))}
          </div>
        )}
      </Loadable>
    </>
  );
}
