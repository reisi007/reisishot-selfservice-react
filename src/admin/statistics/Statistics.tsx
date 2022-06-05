import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import {
  MonthDataType, ShootingStatisticsResponse, useChartDataPerMonth, useChartDataPerYear, YearDataType,
} from './statistics.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { AbsolutePerYear } from './charts/AbsolutePerYear';
import { CHART_SETTINGS, ChartVisibilities, Totals } from '../../charts/helper';
import { RelativePerYear } from './charts/RelativePerYear';
import { AbsolutePerMonth } from './charts/AbsolutePerMonth';
import { TotalPie } from './charts/TotalPie';
import { RealityCheck } from './charts/RealityCheck';
import { StyledInputField } from '../../form/StyledFields';
import { FormLabel } from '../../form/FormikFields';
import { useNavigation } from '../../hooks/useNavigation';
import { Savable } from '../../charts/Savable';
import { LoginDataProps } from '../login/LoginData';
import { StatisticChartProps } from './StatisticChartProps';

export function Statistics({ loginData }: LoginDataProps) {
  const [visibilities, setVisibilitiesInternal] = useState(Object.fromEntries(Object.keys(CHART_SETTINGS)
    .map((k) => ([k, true]))));
  const setVisibilities = useCallback((callback: (data: ChartVisibilities) => void) => {
    setVisibilitiesInternal((v) => {
      const nv = { ...v };
      callback(nv);
      return nv;
    });
  }, [setVisibilitiesInternal]);
  const {
    only18,
    showGroups,
  } = useStatisticPanelData();
  const params = useMemo(() => ({
    showMinors: !only18,
    showGroups,
  }), [only18, showGroups]);
  const yearResult = useChartDataPerYear(loginData, params);
  const monthResult = useChartDataPerMonth(loginData, params);
  const { t } = useTranslation();
  const displayDiagramPerYear = useCallback((data: { data: ShootingStatisticsResponse, totals: Totals }) => (
    <DisplayDiagramPerYear
      {...data}
      visibilities={visibilities}
      setVisibilities={setVisibilities}
    />
  ), [setVisibilities, visibilities]);
  const displayDiagramPerMonth = useCallback((data: { data: ShootingStatisticsResponse, totals: Totals }) => (
    <DisplayDiagramsPerMonth
      {...data}
      visibilities={visibilities}
      setVisibilities={setVisibilities}
    />
  ), [setVisibilities, visibilities]);
  return (
    <>
      <h1>{t('admin.statistics.title')}</h1>
      <StatisticDataPanel />
      <div className="w-full">
        <Loadable
          result={yearResult}
          loadingElement={<LoadingIndicator height="20rem" />}
          displayData={displayDiagramPerYear}
        />
        <Loadable
          result={monthResult}
          loadingElement={<LoadingIndicator height="20rem" />}
          displayData={displayDiagramPerMonth}
        />
      </div>
    </>
  );
}

function DisplayDiagramPerYear(yearData: YearDataType & StatisticChartProps) {
  return (
    <>
      {[RealityCheck, AbsolutePerYear, RelativePerYear, TotalPie].map((Chart) => (
        <div className="my-8">
          <Savable>
            <Chart {...yearData} />
          </Savable>
        </div>
      ))}
    </>
  );
}

function DisplayDiagramsPerMonth(monthData: MonthDataType & StatisticChartProps) {
  return (
    <>
      {[AbsolutePerMonth].map((Chart) => (
        <div className="my-8">
          <Savable>
            <Chart {...monthData} />
          </Savable>
        </div>
      ))}
    </>
  );
}

function useStatisticPanelData() {
  const [{
    showMinors: showMinorString = 'true',
    showGroups: showGroupsString = 'true',
  }] = useNavigation();
  const only18 = !(showMinorString === 'true');
  const showGroups = showGroupsString === 'true';
  return {
    only18,
    showGroups,
  };
}

function StatisticDataPanel() {
  const { t } = useTranslation();
  const {
    only18,
    showGroups,
  } = useStatisticPanelData();
  const [, navigation] = useNavigation();

  return (
    <div className="flex justify-around items-baseline m-4 mx-auto w-full md:w-1/2">
      <FormLabel name="18+" label={t('admin.statistics.settings.18+')} required={false}>
        <>
          <StyledInputField
            checked={only18}
            onChange={(e) => navigation({ parameters: { showMinors: (!e.currentTarget.checked).toString() } })}
            name="18+"
            error=""
            type="checkbox"
          />
          &nbsp;
        </>
      </FormLabel>

      <FormLabel name="groups" label={t('admin.statistics.settings.groups')} required={false}>
        <>
          <StyledInputField
            checked={showGroups}
            onChange={(e) => navigation({ parameters: { showGroups: e.currentTarget.checked.toString() } })}
            name="groups"
            error=""
            type="checkbox"
          />
          &nbsp;
        </>
      </FormLabel>
    </div>
  );
}
