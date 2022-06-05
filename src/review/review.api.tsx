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
