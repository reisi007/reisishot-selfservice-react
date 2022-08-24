import { useCallback, useMemo } from 'react';
import { useFetch, useManualFetch } from '../../http';
import { createHeader, usePostWithAuthentication } from '../../utils/http.authed';
import { LoginData } from '../../utils/LoginData';
import { LoadableRequest } from '../../components/Loadable';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';

export function useSubmitRating(loginData: LoginData, folder: string, image: string) {
  const [request, rawPost] = useManualFetch<unknown, SubmitChooseImageData<number>>({
    url: 'api/waitlist-choose_stars_post.php',
  });
  const postWithAuth = usePostWithAuthentication<SubmitChooseImageData<number>, unknown>(rawPost);

  const post = useCallback((stars: number) => postWithAuth({
    image,
    folder,
    data: stars,
  }, loginData), [folder, image, loginData, postWithAuth]);

  return [request, post] as const;
}

export function useSubmitComment(loginData: LoginData, folder: string, image: string) {
  const [request, rawPost] = useManualFetch<unknown, SubmitChooseImageData<string>>({
    url: 'api/waitlist-choose_comment_post.php',
  });
  const postWithAuth = usePostWithAuthentication<SubmitChooseImageData<string>, unknown>(rawPost);

  const post = useCallback((comment: string) => postWithAuth({
    image,
    folder,
    data: comment,
  }, loginData), [folder, image, loginData, postWithAuth]);

  return [request, post] as const;
}

export function useStoredReviewData(loginData: LoginData, folder: string): LoadableRequest<StoredReviewData> {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<StoredReviewDataResponse>>({
    url: `api/waitlist-choose_load_stored_data_get.php?folder=${folder}`,
    headers: createHeader(loginData),
  });

  const data = useMemo(() => {
    if (rawData === undefined) {
      return undefined;
    }
    return {
      comments: Object.fromEntries(rawData.comments.map(({
        filename,
        comment,
      }) => ([filename.toLowerCase(), comment]))),
      ratings: Object.fromEntries(rawData.ratings.map((e) => ({
        ...e,
        rating: parseFloat(e.rating),
      }))
        .map(({
          filename,
          rating,
        }) => ([filename.toLowerCase(), rating]))),
    };
  }, [rawData]);
  return {
    data,
    loading,
    error,
  };
}

type SubmitChooseImageData<T> = { folder: string, image: string, data: T };

type StoredReviewDataResponse = {
  ratings: Array<{ filename: string, rating: number }>,
  comments: Array<{ filename: string, comment: string }>
};

export type StoredReviewData = {
  ratings: { [filename: string]: number },
  comments: { [filename: string]: string }
};
