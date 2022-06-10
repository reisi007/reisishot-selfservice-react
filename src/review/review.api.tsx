import { AxiosPromise } from 'axios';
import { useManualFetch } from '../http';
import { LoadableRequest } from '../components/Loadable';
import { usePost } from '../utils/http.authed';

export type Review = {
  email: string;
  rating?: number;
  name: string;
  review_private?: string;
  review_public?: string;
};

export type UpdatableReview = Review & {
  access_key: string;
};

export function useSubmitReview(): [LoadableRequest<unknown>, (r: Review) => AxiosPromise<unknown>] {
  const [request, rawPost] = useManualFetch<unknown, Review>({
    url: 'api/reviews_post.php',
  });
  const post = usePost(rawPost);

  return [request, post];
}
