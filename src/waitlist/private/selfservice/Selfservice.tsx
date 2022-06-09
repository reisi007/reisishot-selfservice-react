import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { LoginData } from '../../../utils/LoginData';
import { useAllContracts, UserContract } from '../waitlist-private.api';
import { useModal } from '../../../components/Modal';
import { useTabGroup } from '../../../components/TabGroup';
import { StyledButton } from '../../../components/StyledButton';
import { ActionButton } from '../../../admin/waitlist/ActionButton';

export function Selfservice({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const [{ data }] = useAllContracts(loginData);
  const tabs = useSelfServiceTabs();
  const [tabGroup, setTabActive] = useTabGroup(
    {
      containerClassName: 'm-2 border border-gray-200',
      headerContainerClassName: 'py-2 bg-reisishot/80 justify-center items-center',
      tabHeaderClassName: 'mx-2 py-1 text-white border-white',
      activeTabHeaderClassName: 'font-medium text-white border-black',
      tabContainerClassName: 'mb-2 min-h-[30vh]',
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

function EditProfileTab({ className }: Props) {
  const { t } = useTranslation();
  return (
    <div className={classNames(className)}>
      <h2>{t('waitlist.titles.selfservice.tabs.profile.title.long')}</h2>
    </div>
  );
}

function ContractTab({ className }: Props) {
  const { t } = useTranslation();
  return (
    <div className={classNames(className)}>
      <h2>{t('waitlist.titles.selfservice.tabs.contracts.title.long')}</h2>
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
