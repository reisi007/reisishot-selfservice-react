import {createHeader} from '../admin.api';
import {useFetch} from '../../http';
import {useMemo} from 'react';
import {LoginData} from '../login/login.api';
import {ResponseValues} from 'axios-hooks';


export type ShootingStatisticsResponsePerYear = {
  [year: string]: {
    [shootingType: string]: number // number of shootings of this type in this year
  }
}

export function useChartDataPerYear(loginData: LoginData, {
  showGroups,
  showMinor,
}: { showMinor: boolean, showGroups: boolean }): [ResponseValues<YearDataType, unknown, unknown>] {
  const [{data: rawData, loading, error}] = useFetch<ShootingStatisticsResponsePerYear>({
    url: '/api/waitlist-admin-shooting_statistics_get.php',
    urlParams: {showGroups: String(showGroups), showMinor: String(showMinor)},
    headers: createHeader(loginData),
  });

  const convertedData: YearDataType | undefined = useMemo(() => {
    if(!rawData) {
      return undefined;
    }
    return convertYearData(rawData);
  }, [rawData]);

  return [{data: convertedData, loading, error}];
}

export type YearDataType = ReturnType<typeof convertYearData>

const convertYearData = (data: ShootingStatisticsResponsePerYear) => {
  const totals = Object.fromEntries(
    Object.entries(data)
          .map(([key, value]) => [key, Object.values(value).reduce((a, b) => a + b, 0)]),
  );
  return [data, totals];
};
