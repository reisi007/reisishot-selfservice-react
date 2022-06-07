import { useMemo } from 'react';
import { Person } from '../../types/Person';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';
import { LoadableRequest } from '../../components/Loadable';
import { Referrable } from '../referral.api';
import { usePut } from '../../admin/admin.api';
import { useFetchGet, useFetchPost } from '../../http';

export function useWaitlistLogin() {
  const [request, rawPut] = useFetchPost<unknown, LoginRequest>({
    url: '/api/waitlist-login_post.php',
  });
  const put = usePut(rawPut);
  return [request, put] as const;
}

export function useWaitlistRegister() {
  const [request, rawPut] = useFetchPost<unknown, RegisterRequest>({
    url: '/api/waitlist-login_post.php',
    options: { manual: true },
  });
  const put = usePut(rawPut);
  return [request, put] as const;
}

export function usePublicWaitlistItems(): [LoadableRequest<Array<WaitlistItem>, unknown, unknown>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetchGet<PdoEmulatedPrepared<Array<WaitlistItem>>>({
    url: 'api/waitlist-overview-public_get.php',
  });
  const data: Array<WaitlistItem> | undefined = useMemo(() => (rawData === undefined ? undefined : rawData.map((wi) => {
    const id = parseInt(wi.id, 10);
    const maxWaiting = wi.max_waiting === null ? null : parseInt(wi.max_waiting, 10);
    const registered = wi.registered === '1';
    return {
      ...wi,
      id,
      registered,
      max_waiting: maxWaiting,
    };
  })), [rawData]);

  return [{
    data,
    loading,
    error,
  }];
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
};

export type LoginRequest = Referrable & {
  email: string
};

export type RegisterRequest = Omit<WaitlistPerson, 'points'> & Referrable;

export type WaitlistPerson = Person &
{
  availability: string,
  phone_number: string,
  website?: string,
  points: number,
};
