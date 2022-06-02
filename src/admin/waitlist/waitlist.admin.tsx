import {WaitlistPerson, WaitlistRecord} from '../../waitlist/waitlist.api';
import {useFetch} from '../../http';
import {LoginData} from '../login/LoginData';
import {createHeader} from '../admin.api';
import {PdoEmulatedPrepared} from '../../types/PdoEmulatedPrepared';
import {useMemo} from 'react';
import {ResponseValues} from 'axios-hooks';

export function useWaitlistAdminData(loginData: LoginData): [ResponseValues<WaitlistAdminData, unknown, unknown>] {
  const [{data: rawData, loading, error}] = useFetch<PdoEmulatedPrepared<WaitlistAdminData<undefined>>>({
    url: 'api/waitlist-admin_get.php',
    headers: createHeader(loginData),
  });
  const data: WaitlistAdminData | undefined = useMemo(() => {
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

    const leaderboard: Array<LeaderboardEntry<number>> = [];

    rawData.leaderboard.forEach((cur, idx) => {
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

    return {registrations, leaderboard};
  }, [rawData]);

  return [{data, loading, error}];
}


export type WaitlistAdminData<LeaderPos extends number | undefined = number> = {
  registrations: Array<WaitlistItemWithRegistrations>,
  leaderboard: Array<LeaderboardEntry<LeaderPos>>
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
