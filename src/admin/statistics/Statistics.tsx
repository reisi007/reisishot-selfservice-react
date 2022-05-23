import React from 'react';
import {useAdminLogin} from '../useAdminLogin';
import {useTranslation} from 'react-i18next';
import {useChartDataPerYear, YearDataType} from './statistics.api';
import {Loadable} from '../../component/Loadable';
import {LoadingIndicator} from '../../LoadingIndicator';
import {LoginData} from '../login/login.api';
import {formatJson} from '../../utils/json';

export function Statistics() {
  const [loginInfo] = useAdminLogin();
  return <>{loginInfo !== undefined && <LoadDiagrams {...loginInfo}/>}</>;
}


function DisplayDiagram({data}: { data: YearDataType }) {
  return <pre>{formatJson(data)}</pre>;
}

function LoadDiagrams(loginData: LoginData) {
  const result = useChartDataPerYear(loginData, {showMinor: false, showGroups: false});
  const {t} = useTranslation();
  return <>
    <h1>{t('admin.statistics')}</h1>
    <div>
      <Loadable result={result} loadingElement={<LoadingIndicator height="20rem"/>}
                displayData={data => <DisplayDiagram data={data}/>}/>
    </div>
  </>;
}
