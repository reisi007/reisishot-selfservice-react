import { useMemo } from 'react';
import { ResponseValues } from 'axios-hooks';
import { UpdatableReview } from '../../review/review.api';
import { LoginData } from '../../utils/LoginData';
import { createHeader } from '../../utils/http.authed';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';
import { useFetch } from '../../http';

export type LoadedReview = UpdatableReview & {
  creation_date: string;
};

export function useGetAllReviews(loginData: LoginData): [ResponseValues<Array<LoadedReview>, unknown, unknown>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<LoadedReview>>>({
    url: 'api/reviews-admin_get.php',
    headers: createHeader(loginData),
  });
  const data = useMemo((): Array<LoadedReview> | undefined => {
    if (rawData === undefined) {
      return undefined;
    }
    return rawData.map((r) => {
      const { rating } = r;
      const numberRating = rating === undefined ? undefined : parseInt(rating, 10);
      return ({
        ...r,
        rating: numberRating,
      });
    });
  }, [rawData]);

  return [{
    data,
    error,
    loading,
  }];
}
