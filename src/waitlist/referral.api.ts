import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { createHeader, usePostWithAuthentication } from '../utils/http.authed';
import { useFetch, useManualFetch } from '../http';
import { PdoEmulatedPrepared } from '../types/PdoEmulatedPrepared';
import { LoginData } from '../utils/LoginData';
import { LoadableRequest } from '../components/Loadable';

export type ReferralInfo = {
  email: string,
  action: ReferralType
};

export type ReferralType =
  | 'shooting_good'
  | 'shooting_bad'
  | BackendOnly
  | Perks;

type BackendOnly = 'manual_thx_100' | 'shooting_referred_good' | 'shooting_referred_bad' | 'waitlist_register'
| 'waitlist_register_self';

export type Perks = 'perk_more-people' | 'perk_no-public' | 'perk_pics_25+' | 'perk_shooting_2h+';

export function useTranslateReferralType() {
  const { t } = useTranslation();
  return useCallback((type: ReferralType) => t(`referable.types.${type}`), [t]);
}

export type Referrable = {
  referrer?: string
};

export type Perk = {
  key: Perks,
  value: number
};

export interface ReferralPointEntry {
  points: number,
  key: ReferralType,
  timestamp: string
}

export function useAddPoints() { // FIXME this should be used as well
  const [request, rawPost] = useManualFetch<unknown, ReferralInfo>({
    url: '/api/referral-points_post.php',
  });
  const post = usePostWithAuthentication(rawPost);
  return [request, post] as const;
}

export function useAddPointsDirect() {
  const [request, rawPost] = useManualFetch<unknown, ReferralInfo>({
    url: '/api/referral-points-direct_post.php',
  });
  const post = usePostWithAuthentication(rawPost);
  return [request, post] as const;
}

export function useGetPointHistory(loginData: LoginData): [LoadableRequest<Array<ReferralPointEntry>>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<ReferralPointEntry>>>({
    url: 'api/referral-points-history_get.php',
    headers: createHeader(loginData),
  });
  const data = useMemo((): Array<ReferralPointEntry> | undefined => {
    if (rawData === undefined) return undefined;
    return rawData.map((e) => ({
      ...e,
      points: parseInt(e.points, 10),
      key: e.key as ReferralType,
    }));
  }, [rawData]);

  return [{
    data,
    loading,
    error,
  }];
}
