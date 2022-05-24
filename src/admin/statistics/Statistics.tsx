import {useAdminLogin} from '../useAdminLogin';
import {useTranslation} from 'react-i18next';
import {useChartDataPerYear, YearDataType} from './statistics.api';
import {Loadable} from '../../component/Loadable';
import {LoadingIndicator} from '../../LoadingIndicator';
import {LoginData} from '../login/login.api';
import {AbsolutePerYear} from './charts/AbsolutePerYear';

export function Statistics() {
  const [loginInfo] = useAdminLogin();
  return <>{loginInfo !== undefined && <LoadDiagrams {...loginInfo}/>}</>;
}


function DisplayDiagram(yearData: YearDataType) {
  const {data, totals} = yearData;
  return <>
    <AbsolutePerYear data={data} totals={totals}/>
  </>;
}

function LoadDiagrams(loginData: LoginData) {
  const result = useChartDataPerYear(loginData, {showMinor: false, showGroups: false});
  const {t} = useTranslation();
  return <>
    <h1>{t('admin.statistics.title')}</h1>
    <div className="w-full">
      <Loadable result={result} loadingElement={<LoadingIndicator height="20rem"/>}
                displayData={data => <DisplayDiagram {...data}/>}/>
    </div>
  </>;
}
