import { useMemo } from 'react';
import { LoginData } from '../../utils/LoginData';
import { useFetch, useManualFetch } from '../../http';
import {
  createHeader, usePost, usePostWithAuthentication, usePutWithAuthentication,
} from '../../utils/http.authed';
import { WaitlistItem, WaitlistPerson, WaitlistRequest } from '../public/waitlist-public.api';
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
  const [request, rawPost] = useManualFetch<unknown, DeleteWaitlistRequest>({
    url: 'api/waitlist-entry-remove_post.php',
  });
  const post = usePostWithAuthentication(rawPost);

  return [request, post] as const;
}

export function useWaitlistPerson(loginData: LoginData): [LoadableRequest<WaitlistPerson>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<WaitlistPerson>>({
    url: 'api/waitlist-person_get.php',
    headers: createHeader(loginData),
  });

  const data = useMemo((): WaitlistPerson | undefined => {
    if (rawData === undefined) {
      return undefined;
    }
    return {
      ...rawData,
      points: parseInt(rawData.points, 10),
    };
  }, [rawData]);

  return [{
    data,
    loading,
    error,
  }];
}

export function useAllContracts(loginData: LoginData): [LoadableRequest<Array<UserContract>>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<UserContract>>>({
    url: 'api/waitlist_list_contracts_get.php',
    headers: createHeader(loginData),
  });

  const data = useMemo((): Array<UserContract> | undefined => {
    if (rawData === undefined) return undefined;
    return rawData.map((e) => ({
      ...e,
      can_sign: e.can_sign === '1',
      is_signed: e.is_signed === '1',
    }));
  }, [rawData]);

  return [{
    data,
    loading,
    error,
  }];
}

export type UserContract = {
  access_key: string;
  due_date: string;
  is_signed: boolean;
  can_sign: boolean;
};

export function useUpdateWaitlistPerson(loginData: LoginData) {
  const [request, rawPost] = useManualFetch({
    url: 'api/waitlist-person_post.php',
    headers: createHeader(loginData),
  });

  const post = usePost(rawPost);
  return [request, post] as const;
}
