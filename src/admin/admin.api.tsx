import {useGet} from '../http';

type LoginData = { user: string, auth: string }

export function useCalendarData() {
  return useGet<Array<ShootingDateEntry>>('/api/shooting_dates_get.php', {}, []);
}

function createHeader({user, auth}: LoginData, moreHeaders?: HeadersInit): HeadersInit {
  return {Email: user, Accesskey: auth, ...moreHeaders};
}

export function useAdminCalendarData(loginData: LoginData) {
  return useGet<Array<ShootingDateEntry>>(`/api/shooting_dates_private_get.php?`, {
    headers: createHeader(loginData),
  }, [loginData]);
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
