import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginData } from '../../../utils/LoginData';
import {
  useAllContracts, UserContract, useUpdateWaitlistPerson, useWaitlistPerson,
} from '../waitlist-private.api';
import { useModal } from '../../../components/Modal';
import { useTabGroup } from '../../../components/TabGroup';
import { StyledButton } from '../../../components/StyledButton';
import { ActionButton } from '../../../admin/waitlist/ActionButton';
import { Loadable } from '../../../components/Loadable';
import { LoadingIndicator } from '../../../LoadingIndicator';
import { FormattedDateTime } from '../../../utils/Age';
import { Badge } from '../../../components/Badge';
import { WaitlistPersonForm } from '../../shared/WaitlistPersonForm';

export function Selfservice({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const [{ data }] = useAllContracts(loginData);
  const tabs = useSelfServiceTabs();
  const [tabGroup, setTabActive] = useTabGroup(
    {
      containerClassName: 'border border-t-0 border-gray-200 rounded-lg',
      headerContainerClassName: 'py-2 bg-reisishot/80 justify-center items-center rounded-t-lg',
      tabHeaderClassName: 'mx-2 py-1 text-white border-white',
      activeTabHeaderClassName: 'font-medium text-white border-black underline underline-offset-4',
      tabContainerClassName: 'mb-2 p-2 min-h-[30vh]',
      data: loginData,
      tabs,
    },
  );

  const [selfserviceModal, openSelfservice] = useModal(t('waitlist.titles.selfservice.title'), () => tabGroup);
  return (
    <>
      <div className="flex flex-wrap justify-evenly items-center py-2 mx-auto md:w-1/2">
        <StyledButton onClick={() => openSelfservice(true)}>{t('waitlist.titles.selfservice.openButton')}</StyledButton>
        {data !== undefined && <ContractActionButton contracts={data} setVisibleTab={setTabActive} setVisible={openSelfservice} />}
      </div>
      {selfserviceModal}
    </>
  );
}

function useSelfServiceTabs() {
  const { t } = useTranslation();
  return useMemo(() => ({
    [t('waitlist.titles.selfservice.tabs.profile.title.short')]: EditProfileTab,
    [t('waitlist.titles.selfservice.tabs.contracts.title.short')]: ContractTab,
  }), [t]);
}

type Props = { className?: string, data: LoginData };

function EditProfileTab({
  className,
  data: loginData,
}: Props) {
  const { t } = useTranslation();
  const [{
    data: personData,
    loading: personLoading,
    error: personError,
  }] = useWaitlistPerson(loginData);
  const [{
    data: updateData,
    loading: updateLoading,
    error: updateError,
  }, put] = useUpdateWaitlistPerson(loginData);
  return (
    <div className={classNames(className)}>
      <h2>{t('waitlist.titles.selfservice.tabs.profile.title.long')}</h2>
      <Loadable className="relative" data={personData} loading={personLoading} error={personError} loadingElement={<LoadingIndicator height="10rem" />}>
        {(request) => (
          <WaitlistPersonForm initialValues={request} put={put} data={updateData} loading={updateLoading} error={updateError}>
            <>
              {t('actions.save')}
            </>
          </WaitlistPersonForm>
        )}
      </Loadable>
    </div>
  );
}

function ContractTab({
  className,
  data: loginData,
}: Props) {
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
      <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator height="10rem" />}>
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

function ContractActionButton({
  contracts,
  setVisible,
  setVisibleTab,
}: { setVisible: Dispatch<SetStateAction<boolean>>, setVisibleTab: Dispatch<SetStateAction<string>>, contracts: Array<UserContract> }) {
  const hasPendingContracts = useMemo(() => contracts.findIndex(({
    can_sign: canSign,
    is_signed: isSigned,
  }) => canSign && !isSigned) >= 0, [contracts]);
  const { t } = useTranslation();
  return (
    <>
      {hasPendingContracts && (
        <ActionButton
          className="text-white bg-reisishot motion-safe:animate-bounce"
          onClick={() => {
            setVisibleTab(t('waitlist.titles.selfservice.tabs.contracts.title.short'));
            setVisible(true);
          }}
        >
          {t('waitlist.titles.selfservice.contractAttention')}
        </ActionButton>
      )}
    </>
  );
}
