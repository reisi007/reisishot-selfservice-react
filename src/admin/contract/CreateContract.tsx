import {useTranslation} from 'react-i18next';
import {CreateContractForm} from './CreateContractForm';

export function CreateContract() {
  const {t} = useTranslation();
  return <div className="container">
    <h1 className="mb-2">{t('admin.contract.title')}</h1>
    <CreateContractForm/>
  </div>;
}
