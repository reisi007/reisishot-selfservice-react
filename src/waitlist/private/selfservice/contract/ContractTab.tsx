import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAllContracts } from '../../waitlist-private.api';
import { Loadable } from '../../../../components/Loadable';
import { LoadingIndicator } from '../../../../LoadingIndicator';
import { StyledButton } from '../../../../components/StyledButton';
import { FormattedDateTime } from '../../../../utils/Age';
import { Badge } from '../../../../components/Badge';
import { TabProps } from '../TabProps';

export function ContractTab({
  className,
  data: loginData,
}: TabProps) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }] = useAllContracts(loginData);
  const { user: email } = loginData;
  const navigate = useNavigate();
  return (
    <div className={classNames(className)}>
      <h2>{t('waitlist.titles.selfservice.tabs.contracts.title.long')}</h2>
      <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
        {(response) => (
          <div className="grid gap-2 m-2 md:grid-cols-2">
            {response.map(({
              access_key: accessKey,
              is_signed: isSigned,
              can_sign: canSign,
              due_date: dueDate,
            }) => (
              <StyledButton key={accessKey} onClick={() => navigate(`/contracts/${email}/${accessKey}`)}>
                <h3><FormattedDateTime dateString={dueDate} /></h3>
                <div className="flex justify-evenly items-center my-2">
                  {isSigned && <Badge background="bg-reisishot" text="text-white">{t('waitlist.titles.selfservice.tabs.contracts.signed')}</Badge>}
                  {!isSigned && canSign && <Badge background="bg-amber-300" text="text-gray-800">{t('waitlist.titles.selfservice.tabs.contracts.canSign')}</Badge>}
                  {!isSigned && !canSign && <Badge background="bg-red-500" text="text-white">{t('waitlist.titles.selfservice.tabs.contracts.tooLate')}</Badge>}
                </div>
              </StyledButton>

            ))}
          </div>
        )}
      </Loadable>

    </div>
  );
}
