import { useMemo, useState } from 'react';
import { RefetchOptions, ResponseValues } from 'axios-hooks';
import { AxiosPromise } from 'axios';
import { LoginData } from '../../utils/LoginData';
import { createHeader, usePostWithAuthentication } from '../../utils/http.authed';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';
import { Person } from '../../types/Person';
import { WaitlistItem, WaitlistPerson, WaitlistRequest } from '../../waitlist/public/waitlist-public.api';
import { useFetch, useManualFetch } from '../../http';

export function useWaitlistAdminData(loginData: LoginData): [ResponseValues<WaitlistAdminData, unknown, unknown>, () => AxiosPromise<unknown>] {
  const [{
    data: rawData,
    loading,
    error,
  }, refetch] = useFetch<PdoEmulatedPrepared<WaitlistAdminData<undefined>>>({
    url: 'api/waitlist-admin_get.php',
    headers: createHeader(loginData),
  });

  const data = useMemo((): WaitlistAdminData | undefined => {
    if (rawData === undefined) {
      return undefined;
    }
    const registrations: Array<WaitlistItemWithRegistrations> = rawData.registrations.map((r) => {
      const maxWaiting = typeof r.max_waiting === 'string' ? parseInt(r.max_waiting, 10) : null;
      const id = parseInt(r.id, 10);
      const registered = r.registered === '1';
      const mappedRegistrations: Array<AdminWaitlistRecord> = r.registrations.map((e) => {
        const itemId = parseInt(e.item_id, 10);
        const personId = parseInt(e.person_id, 10);
        const points = parseInt(e.points, 10);
        const dateAssigned = e.date_assigned === '1';
        const ignored = e.ignored === '1';
        return {
          ...e,
          item_id: itemId,
          person_id: personId,
          points,
          ignored,
          date_assigned: dateAssigned,
        };
      });
      return {
        ...r,
        id,
        max_waiting: maxWaiting,
        registered,
        registrations: mappedRegistrations,
      };
    });

    const leaderboard: Array<LeaderboardEntry> = calculateLeaderboardPosition(rawData.leaderboard);

    return {
      ...rawData,
      registrations,
      leaderboard,
    };
  }, [rawData]);

  return [{
    data,
    loading,
    error,
  }, refetch];
}

type DateAssignedBody = { itemId: number, personId: number, value: boolean };

export function useSetDateAssigned() {
  const [request, rawPost] = useManualFetch<unknown, DateAssignedBody>({ url: 'api/waitlist-admin-entry-date-assigned_post.php' });
  const post = usePostWithAuthentication(rawPost);
  return [request, post] as const;
}

export function useDeleteWaitlistItem() {
  const [request, rawPut] = useManualFetch<unknown, { item: number, person: number }>({ url: 'api/waitlist-admin-delete_post.php' });
  const put = usePostWithAuthentication(rawPut);
  return [request, put] as const;
}

type FindLoaderboardByYearBody = { year: number };

type FindLeaderboardPerYear = readonly [
  ResponseValues<Array<LeaderboardEntry>,
  FindLoaderboardByYearBody, unknown>,
  (body: FindLoaderboardByYearBody, loginData: LoginData) => Promise<Array<LeaderboardEntry>>,
];

export function useFindLeaderboardByYear(): FindLeaderboardPerYear {
  const [{
    loading,
    error,
  }, rawPost] = useManualFetch<PdoEmulatedPrepared<Array<LeaderboardEntry<undefined>>>, FindLoaderboardByYearBody>({ url: 'api/waitlist-admin-leaderboard_by_year_post.php' });
  const [data, setData] = useState<Array<LeaderboardEntry> | undefined>(undefined);
  const options: RefetchOptions = useMemo(() => ({ useCache: true }), []);
  const preparedPost = usePostWithAuthentication(rawPost, undefined, options);

  const mappedPost = useMemo(() => (body: FindLoaderboardByYearBody, loginData: LoginData) => preparedPost(body, loginData)
    .then((e) => {
      const curData = calculateLeaderboardPosition(e.data);
      setData(curData);
      return curData;
    }), [preparedPost]);
  return [{
    data,
    loading,
    error,
  }, mappedPost] as const;
}

function calculateLeaderboardPosition(rawData: PdoEmulatedPrepared<Array<LeaderboardEntry<undefined>>>): Array<LeaderboardEntry> {
  const leaderboard: Array<LeaderboardEntry> = [];
  rawData.forEach((cur, idx) => {
    const rawPoints = cur.points;
    const prev = idx > 0 ? leaderboard[idx - 1] : undefined;
    const points = parseInt(rawPoints, 10);
    let position = idx + 1;
    if (prev !== undefined && prev.points === points) {
      if (prev.position) {
        position = prev.position;
      }
    }
    leaderboard.push({
      ...cur,
      points,
      position,
    });
  });
  return leaderboard;
}

export function usePostNewShootingStatistic() {
  const [request, rawPost] = useManualFetch<unknown, { itemId: number, isMinor: boolean, isGroup: boolean }>({
    url: 'api/waitlist-admin-shooting_statistics_post.php',
  });

  const post = usePostWithAuthentication(rawPost);
  return [request, post] as const;
}

export type WaitlistAdminData<LeaderPos extends number | undefined = number> = {
  registrations: Array<WaitlistItemWithRegistrations>,
  leaderboard: Array<LeaderboardEntry<LeaderPos>>
  pendingContracts: Array<PendingSignaturInformation>,
  blocked: Array<IgnoredPerson>
};

export type LeaderboardEntry<Pos extends number | undefined = number> = {
  position: Pos,
  referrer: string,
  points: number
};

export type WaitlistItemWithRegistrations = WaitlistItem & {
  registrations: Array<AdminWaitlistRecord>;
};

export type AdminWaitlistRecord = WaitlistRequest & WaitlistPerson & {
  points: number,
  person_id: number,
  date_assigned: boolean,
  ignored: boolean
};

export type PendingSignaturInformation = {
  email: string,
  access_key: string,
  due_date: string
};

export type IgnoredPerson = Person & { ignoredUnit: string };
