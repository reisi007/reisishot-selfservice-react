import {WaitlistPerson, WaitlistRecord} from '../../waitlist/waitlist.api';
import {useFetch} from '../../http';
import {LoginData} from '../login/LoginData';
import {createHeader, usePut} from '../admin.api';
import {PdoEmulatedPrepared} from '../../types/PdoEmulatedPrepared';
import {useMemo, useState} from 'react';
import {ResponseValues} from 'axios-hooks';

export function useWaitlistAdminData(loginData: LoginData): [ResponseValues<WaitlistAdminData, unknown, unknown>] {
  const [{data: rawData, loading, error}] = useFetch<PdoEmulatedPrepared<WaitlistAdminData<undefined>>>({
    url: 'api/waitlist-admin_get.php',
    headers: createHeader(loginData),
  });

  const data = useMemo((): WaitlistAdminData | undefined => {
    if(rawData === undefined) {
      return undefined;
    }
    const registrations: Array<WaitlistItemWithRegistrations> = rawData.registrations.map(r => {
      const maxWaiting = typeof r.max_waiting === 'string' ? parseInt(r.max_waiting) : null;
      const id = parseInt(r.id);
      const registered = r.registered === '1';
      const registrations: Array<AdminWaitlistRecord> = r.registrations.map(e => {
        const item_id = parseInt(e.item_id);
        const person_id = parseInt(e.person_id);
        const points = parseInt(e.points);
        const date_assigned = e.date_assigned === '1';
        const ignored = e.ignored === '1';
        return {...e, item_id, person_id, points, ignored, date_assigned};
      });
      return {...r, id, max_waiting: maxWaiting, registered, registrations};
    });

    const leaderboard: Array<LeaderboardEntry> = calculateLeaderboardPosition(rawData.leaderboard);

    return {...rawData, registrations, leaderboard};
  }, [rawData]);

  return [{data, loading, error}];
}

type DateAssignedBody = { itemId: number, personId: number, value: boolean };

export function useSetDateAssigned() {
  const [request, rawPut] = useFetch<unknown, DateAssignedBody>({
    url: 'api/waitlist-admin-entry-date-assigned_post.php',
    options: {manual: true},
  });
  const put = usePut(rawPut);
  return [request, put] as const;
}

export function useDeleteWaitlistItem() {
  const [request, rawPut] = useFetch<unknown, { item: number, person: number }>({
    url: 'api/waitlist-admin-delete_post.php',
    options: {manual: true},
  });
  const put = usePut(rawPut);
  return [request, put] as const;
}

type FindLoaderboardByYearBody = { year: number };

export function useFindLeaderboardByYear(): readonly [ResponseValues<Array<LeaderboardEntry>, FindLoaderboardByYearBody, unknown>, (body: FindLoaderboardByYearBody, loginData: LoginData) => Promise<Array<LeaderboardEntry>>] {
  const [{
    loading,
    error,
  }, rawPut] = useFetch<PdoEmulatedPrepared<Array<LeaderboardEntry<undefined>>>, FindLoaderboardByYearBody>({
    url: 'api/waitlist-admin-leaderboard_by_year_post.php',
    options: {manual: true},
  });
  const [data, setData] = useState<Array<LeaderboardEntry> | undefined>(undefined);
  const preparedPut = usePut(rawPut);
  const mappedPut = useMemo(() => {
    return (body: FindLoaderboardByYearBody, loginData: LoginData) => {
      return preparedPut(body, loginData)
        .then(e => {
          const data = calculateLeaderboardPosition(e.data);
          setData(data);
          return data;
        });
    };

  }, [preparedPut]);
  return [{data, loading, error}, mappedPut] as const;
}

function calculateLeaderboardPosition(rawData: PdoEmulatedPrepared<Array<LeaderboardEntry<undefined>>>): Array<LeaderboardEntry> {
  const leaderboard: Array<LeaderboardEntry> = [];
  rawData.forEach((cur, idx) => {
    const rawPoints = cur.points;
    const prev = idx > 0 ? leaderboard[idx - 1] : undefined;
    const points = parseInt(rawPoints);
    let position = idx + 1;
    if(prev !== undefined && prev.points === points) {
      if(prev.position) {
        position = prev.position;
      }
    }
    leaderboard.push({...cur, points, position});
  });
  return leaderboard;
}

export function usePostNewShootingStatistic() {
  const [request, rawPut] = useFetch<unknown, { itemId: number, isMinor: boolean, isGroup: boolean }>({
    url: 'api/waitlist-admin-shooting_statistics_post.php',
    options: {manual: true},
  });

  const put = usePut(rawPut);

  return [request, put] as const;
}

export type WaitlistAdminData<LeaderPos extends number | undefined = number> = {
  registrations: Array<WaitlistItemWithRegistrations>,
  leaderboard: Array<LeaderboardEntry<LeaderPos>>
  pendingContracts: Array<PendingSignaturInformation>
}

export type LeaderboardEntry<Pos extends number | undefined = number> = {
  position: Pos,
  referrer: string,
  points: number
}

export type WaitlistItemWithRegistrations = WaitlistItem & {
  registrations: Array<AdminWaitlistRecord>;
}

export type AdminWaitlistRecord = WaitlistRecord & WaitlistPerson & {
  points: number,
  person_id: number,
  date_assigned: boolean,
  ignored: boolean
}

export type WaitlistItem = {
  id: number,
  short: string,
  image_id: string,
  title: string,
  description: string,
  available_from: string,
  available_to: string,
  max_waiting: number | null,
  registered: boolean
}

export type PendingSignaturInformation = {
  email: string,
  access_key: string,
  due_date: string
}
