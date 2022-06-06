import { useFetch } from '../http';
import { usePut } from '../admin/admin.api';

export type ReferralInfo = {
  email: string,
  action: ReferralType
};

export enum ReferralType {
  REGISTER = 'waitlist_register',
  SHOOTING_GOOD = 'shooting_good',
  SHOOTING_REFERRED_GOOD = 'shooting_referred_good',
  SHOOTING_BAD = 'shooting_bad',
  SHOOTING_REFERRED_BAD = 'shooting_referred_bad',
}

export type Referrable = {
  referrer?: string
};

export type Perk = {
  id: string,
  display: string,
  value: number
};

export interface ReferralPointEntry {
  points: number,
  display: string,
  timestamp: string
}

export function useAddPoints() {
  const [request, rawPut] = useFetch<unknown, ReferralInfo>({
    url: '/api/referral-points_post.php',
    options: { manual: true },
  });
  const put = usePut(rawPut);
  return [request, put] as const;
}

export function useAddPointsDirect() {
  const [request, rawPut] = useFetch<unknown, ReferralInfo>({
    url: '/api/referral-points-direct_post.php',
    options: { manual: true },
  });
  const put = usePut(rawPut);
  return [request, put] as const;
}
