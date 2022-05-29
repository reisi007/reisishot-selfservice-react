import React, {useCallback} from 'react';
import {KnownPersonChooser} from './KnownPersonChooser';
import {SearchablePerson} from './contract.api';
import {useTranslation} from 'react-i18next';

export function CreateContractForm() {
  const onPersonSelected = useCallback((_: SearchablePerson) => {

  }, []);
  const {t} = useTranslation();

  return <div className="py-2 mx-auto w-full rounded-lg border border-gray-200 md:w-1/2">
    <h3 className="mb-2">{t('admin.contract.storedPersons')}</h3>
    <KnownPersonChooser onPersonSelected={onPersonSelected}/>
  </div>;
}
