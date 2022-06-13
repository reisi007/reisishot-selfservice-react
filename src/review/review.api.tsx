import { AxiosPromise } from 'axios';
import { useManualFetch } from '../http';
import { LoadableRequest } from '../components/Loadable';
import { usePost } from '../utils/http.authed';
import { RequiredField } from '../types/helper';

export type Review = {
  email: string;
  rating?: number;
  name: string;
  review_private?: string;
  review_public?: string;
};

export type ReviewRequest = RequiredField<Review, 'rating'>;

export function useSubmitReview(): [LoadableRequest<unknown>, (r: ReviewRequest) => AxiosPromise<unknown>] {
  const [request, rawPost] = useManualFetch<unknown, ReviewRequest>({
    url: 'api/reviews_post.php',
  });
  const post = usePost(rawPost);

  return [request, post];
}
