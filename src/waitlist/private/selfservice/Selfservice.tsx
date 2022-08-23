import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { LoginData } from '../../../utils/LoginData';
import { useAllContracts, UserContract } from '../waitlist-private.api';
import { useModal } from '../../../components/Modal';
import { StyledButton } from '../../../components/StyledButton';
import { ActionButton } from '../../../admin/waitlist/ActionButton';
import { useDefaultTabGroup } from '../../../components/TabGroup.default';
import { EditProfileTab } from './profile/EditProfileTab';
import { ContractTab } from './contract/ContractTab';
import { ChooseImageTab } from './choose-image/ChooseImageTab';

export function Selfservice({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const [{ data }] = useAllContracts(loginData);
  const tabs = useSelfServiceTabs();
  const [tabGroup, setTabActive] = useDefaultTabGroup({
    loginData,
    tabs,
  });

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
    [t('waitlist.titles.selfservice.tabs.choose_image.title')]: ChooseImageTab,
  }), [t]);
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
          className="motion-safe:my-6 text-white bg-reisishot motion-safe:animate-bounce"
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
