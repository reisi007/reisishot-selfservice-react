import {useAdminLogin} from '../useAdminLogin';
import {useTranslation} from 'react-i18next';
import {useChartDataPerYear, YearDataType} from './statistics.api';
import {Loadable} from '../../components/Loadable';
import {LoadingIndicator} from '../../LoadingIndicator';
import {LoginData} from '../login/login.api';
import {AbsolutePerYear} from './charts/AbsolutePerYear';
import {useCallback, useState} from 'react';
import {CHART_SETTINGS, ChartVisibilities} from '../../charts/helper';
import {SetChartVisibilityType} from '../../charts/CustomLegend';
import {RelativePerYear} from './charts/RelativePerYear';

export function Statistics() {
  const [loginInfo] = useAdminLogin();
  return <>{loginInfo !== undefined && <LoadDiagrams {...loginInfo}/>}</>;
}

export type StatisticChartProps = { visibilities: ChartVisibilities, setVisibilities: SetChartVisibilityType }

function DisplayDiagram(yearData: YearDataType) {
  const {data, totals} = yearData;
  const [visibilities, setVisibilitiesInternal] = useState(Object.fromEntries(Object.keys(CHART_SETTINGS).map((k) => ([k, true]))));
  const setVisibilities = useCallback((callback: (data: ChartVisibilities) => void) => {
    setVisibilitiesInternal(v => {
      const nv = {...v};
      callback(nv);
      return nv;
    });
  }, [setVisibilitiesInternal]);
  return <>
    {[AbsolutePerYear, RelativePerYear].map((Chart, i) =>
      <Chart
        key={i}
        data={data}
        totals={totals}
        visibilities={visibilities}
        setVisibilities={setVisibilities}
      />)
    }
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
