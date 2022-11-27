import { useMemo } from 'react';
import { Person } from '../../types/Person';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';
import { LoadableRequest } from '../../components/Loadable';
import { Referrable } from '../referral.api';
import { usePost } from '../../utils/http.authed';
import { useFetch, useManualFetch } from '../../http';

export function useWaitlistLogin() {
  const [{
    loading,
    error,
    response,
  }, rawPut] = useManualFetch<unknown, LoginRequest>({
    url: '/api/waitlist-login_post.php',
  });
  const put = usePost(rawPut);
  return [{
    data: response,
    loading,
    error,
  }, put] as const;
}

export function useWaitlistRegister() {
  const [{
    loading,
    error,
    response,
  }, rawPut] = useManualFetch<unknown, RegisterRequest>({
    url: '/api/waitlist-register_post.php',
    options: { manual: true },
  });
  const put = usePost(rawPut);
  return [{
    data: response,
    loading,
    error,
  }, put] as const;
}

export function usePublicWaitlistItems(): [LoadableRequest<Array<PublicWaitlistItem>>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<PublicWaitlistItem>>>({
    url: 'api/waitlist-overview-public_get.php',
  });
  const data: Array<PublicWaitlistItem> | undefined = useMemo(() => (rawData === undefined ? undefined : rawData.map((wi) => {
    const id = parseInt(wi.id, 10);
    return {
      ...wi,
      id,
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

export type PublicWaitlistItem = Omit<WaitlistItem, 'registered' | 'max_waiting' | 'available_to' | 'available_from'>;

export type LoginRequest = Referrable & {
  email: string
  reset: boolean
};

export type RegisterRequest = Omit<WaitlistPerson, 'points'> & Referrable;

export type WaitlistPerson = Person &
{
  url?: string,
  availability: string,
  phone_number: string,
  website?: string,
  points: number,
};

export type WaitlistRequest =
  {
    item_id: number,
    text: string
  };
