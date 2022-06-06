import { useMemo } from 'react';
import { Person } from '../../types/Person';
import { useFetch } from '../../http';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';
import { LoadableRequest } from '../../components/Loadable';
import { Referrable } from '../referral.api';

export function useWaitlistLogin() {

}

export function useWaitglistRegister() {

}

export function usePublicWaitlistItems(): [LoadableRequest<Array<WaitlistItem>, unknown, unknown>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<WaitlistItem>>>({
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

type RegisterRequest = WaitlistPerson;

export type WaitlistPerson = Person & Referrable &
{
  availability: string,
  phone_number: string,
  website?: string,
  points: number,
};
