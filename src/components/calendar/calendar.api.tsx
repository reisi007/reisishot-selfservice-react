import { useMemo } from 'react';
import { LoginData } from '../../admin/login/LoginData';
import { createHeader } from '../../admin/admin.api';
import { useFetch } from '../../http';

export type ShootingDateEntry = {
  kw: number,
  state: ShootingSlotState,
  text?: string
};

export enum ShootingSlotState {
  FREE = 'FREE',
  BUSY = 'BUSY',
  TAKEN = 'TAKEN',
  BLOCKED = 'BLOCKED',
  NOT_YET_OPENED = 'NOT YET OPENED',
}

export function useCalendarData(loginData: LoginData | undefined = undefined) {
  const url = loginData === undefined ? '/api/shooting_dates_get.php' : '/api/shooting_dates_private_get.php?';
  const headers = useMemo(() => createHeader(loginData), [loginData]);
  return useFetch<Array<ShootingDateEntry>>({
    url,
    headers,
  });
}
