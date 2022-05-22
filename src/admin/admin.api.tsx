import {useMemo} from 'react';
import {AxiosRequestHeaders} from 'axios';
import {useFetch} from '../http';

export type LoginData = { user: string, auth: string }

export function useCalendarData() {
  return useFetch<Array<ShootingDateEntry>>('/api/shooting_dates_get.php');
}

function createHeader({user, auth}: LoginData, moreHeaders?: AxiosRequestHeaders): AxiosRequestHeaders {
  return {Email: user, Accesskey: auth, ...moreHeaders};
}

export function useAdminCalendarData(loginData: LoginData, moreHeaders?: AxiosRequestHeaders) {
  const headers = useMemo(() => createHeader(loginData, moreHeaders), [loginData, moreHeaders]);
  return useFetch<Array<ShootingDateEntry>>(`/api/shooting_dates_private_get.php?`, headers);
}

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
