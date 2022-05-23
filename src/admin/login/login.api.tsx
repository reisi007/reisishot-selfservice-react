import {useCallback, useMemo} from 'react';
import {useFetch} from '../../http';
import {createHeader} from '../admin.api';


export type LoginData = { user: string, auth: string }
export type LoginFormData = { user: string, pwd: string }
export type LoginResponse = { user: string, hash: string }

export type ShootingDateEntry = {
  kw: number,
  state: ShootingSlotState,
  text?: string
}

export enum ShootingSlotState {
  FREE = 'FREE',
  BUSY = 'BUSY',
  TAKEN = 'TAKEN',
  BLOCKED = 'BLOCKED',
  NOT_YET_OPENED = 'NOT YET OPENED'
}

export function useCalendarData(loginData?: LoginData) {
  const url = loginData === undefined ? '/api/shooting_dates_get.php' : '/api/shooting_dates_private_get.php?';
  const headers = useMemo(() => createHeader(loginData), [loginData]);
  return useFetch<Array<ShootingDateEntry>>({url, headers});
}

export function useLoginUser() {
  const put = useFetch<LoginResponse>({url: '/api/admin_login_post.php', options: {manual: true}})[1];
  return useCallback(({user, pwd}: LoginFormData) => {
    return put({headers: createHeader({user, auth: pwd})});
  }, [put]);
}
