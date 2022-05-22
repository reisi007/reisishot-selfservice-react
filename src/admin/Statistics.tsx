import React from 'react';
import {useAdminLogin} from './useAdminLogin';
import {LoginData} from './admin.api';
import {useTranslation} from 'react-i18next';

export function Statistics() {
  const [loginInfo] = useAdminLogin();
  return <>{loginInfo !== undefined && <DisplayDiagrams {...loginInfo}/>}</>;
}

function DisplayDiagrams(loginData: LoginData) {
  const {t} = useTranslation();
  return <>
    <h1>{t('admin.statistics')}</h1>
    <div>

    </div>
  </>;
}
