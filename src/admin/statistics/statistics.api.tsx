import {createHeader} from '../admin.api';
import {useFetch} from '../../http';
import {useMemo} from 'react';
import {LoginData} from '../login/login.api';
import {ResponseValues} from 'axios-hooks';
import {Totals} from '../../charts/helper';
import dayjs from 'dayjs';

export type ShootingStatisticsResponse = {
  [key: string]: {
    [shootingType: string]: number // number of shootings of this type in this year
  }
}

export type StatisticsFetchSettings = { showMinor: boolean; showGroups: boolean };
export type YearDataType = ReturnType<typeof convertYearData>
export type MonthDataType = ReturnType<typeof convertMonthData>

export function useChartDataPerYear(loginData: LoginData, {
  showGroups,
  showMinor,
}: { showMinor: boolean, showGroups: boolean }): [ResponseValues<YearDataType, unknown, unknown>] {
  const [{data: rawData, loading, error}] = useFetch<ShootingStatisticsResponse>({
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

const convertYearData = (data: ShootingStatisticsResponse): { data: ShootingStatisticsResponse, totals: Totals } => {
  const totals = Object.fromEntries(
    Object.entries(data)
          .map(([key, value]) => [key, sum(value)]),
  );
  return {data, totals};
};


const convertMonthData = (rawData: ShootingStatisticsResponse): { data: ShootingStatisticsResponse, totals: Totals } => {
  const data = Object.fromEntries(
    Object.entries(rawData).map(([key, values]) => {
      const month = dayjs().month(parseInt(key, 10) - 1).format('MMMM');
      return [month, values];
    }),
  );

  const totals = Object.fromEntries(
    Object.entries(data)
          .map(([key, value]) => {
            return [key, sum(value)];
          }),
  );

  return {data, totals};
};

export function useChartDataPerMonth(loginData: LoginData, {
  showMinor,
  showGroups,
}: StatisticsFetchSettings): [ResponseValues<MonthDataType, unknown, unknown>] {
  const [{data: rawData, loading, error}] = useFetch<ShootingStatisticsResponse>({
    url: '/api/waitlist-admin-shooting_statistics_month_get.php',
    urlParams: {showGroups: String(showGroups), showMinor: String(showMinor)},
    headers: createHeader(loginData),
  });

  const convertedData: MonthDataType | undefined = useMemo(() => {
    if(!rawData) {
      return undefined;
    }
    return convertMonthData(rawData);
  }, [rawData]);

  return [{data: convertedData, loading, error}];
}

function sum(value: { [p: string]: number }) {
  return Object.values(value).reduce((a, b) => a + b, 0);
}
