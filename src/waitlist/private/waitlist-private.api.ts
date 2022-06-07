import { useMemo } from 'react';
import { LoginData } from '../../utils/LoginData';
import { useFetch, useManualFetch } from '../../http';
import { createHeader, usePostWithAuthentication, usePutWithAuthentication } from '../../utils/http.authed';
import { WaitlistItem, WaitlistRequest } from '../public/waitlist-public.api';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';
import { LoadableRequest } from '../../components/Loadable';

export function usePrivateWaitlistItems(loginData: LoginData): [LoadableRequest<Array<WaitlistItem>>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<WaitlistItem>>>({
    url: 'api/waitlist-overview_get.php',
    headers: createHeader(loginData),
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

export function useRegisterForWaitlist() {
  const [request, rawPut] = useManualFetch<unknown, WaitlistRequest>({
    url: 'api/waitlist-entry_put.php',
  });
  const put = usePutWithAuthentication(rawPut);

  return [request, put] as const;
}

export type DeleteWaitlistRequest = Omit<WaitlistRequest, 'text'>;

export function useDeleteRegistrationForWaitlist() {
  const [request, rawPut] = useManualFetch<unknown, DeleteWaitlistRequest>({
    url: 'api/waitlist-entry-remove_post.php',
  });
  const put = usePostWithAuthentication(rawPut);

  return [request, put] as const;
}
