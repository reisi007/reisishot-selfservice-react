import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { TabGroup } from '../../../components/TabGroup';
import { LoginData } from '../../../utils/LoginData';

export function Selfservice({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  return (
    <TabGroup
      containerClassName="m-2 border border-gray-200"
      headerContainerClassName="py-2 bg-reisishot/80 justify-center items-center"
      tabHeaderClassName="mx-2 py-1 text-white border-white"
      activeTabHeaderClassName="font-medium text-white border-black"
      tabContainerClassName="mb-2 min-h-[30vh]"
      data={loginData}
      tabs={{
        [t('waitlist.titles.selfservice.tabs.profile.title.short')]: EditProfileTab,
        [t('waitlist.titles.selfservice.tabs.contracts.title.short')]: ContractTab,
      }}
    />
  );
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
