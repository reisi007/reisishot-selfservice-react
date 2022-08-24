import { useCallback } from 'react';
import { useManualFetch } from '../../http';
import { usePostWithAuthentication } from '../../utils/http.authed';
import { LoginData } from '../../utils/LoginData';

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

type SubmitChooseImageData<T> = { folder: string, image: string, data: T };
