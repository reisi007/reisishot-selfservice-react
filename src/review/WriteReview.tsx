import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { IsNextEnabled, Pages, usePageableGroup } from '../components/PageableSubmittableGroup';
import { Review } from './review.api';

type ReviewPages = {
  person: Pick<Review, 'name' | 'email'>,
  rating: Pick<Review, 'rating'>,
};

function useInitialReview(): [keyof ReviewPages, ReviewPages] {
  return ['person', {
    person: {
      name: '',
      email: '',
    },
    rating: {
      rating: undefined,
    },
  }];
}

export function WriteReview() {
  const { t } = useTranslation();
  const [initialPage, initialValues] = useInitialReview();
  const order = Object.keys(initialValues) as Array<keyof ReviewPages>;
  const pages: Pages<ReviewPages> = useMemo(() => ({
    person: (_, idx) => (idx.toString()),
    rating: (_, idx) => idx.toString(),
  }), []);

  const canSubmit = useCallback(({
    person,
    rating,
  }: ReviewPages) => {
    const {
      name,
      email,
    } = person;
    const { rating: starRating } = rating;
    return !!(name && email) && rating !== undefined;
  }, []);

  const onSubmit = useCallback((data: ReviewPages) => {
    console.error(data);
    // TODO Send request to backend
  }, []);

  const isNextEnabled: IsNextEnabled<ReviewPages> = useMemo(() => ({
    person: ({
      name,
      email,
    }) => !!(name && email),
    rating: ({ rating }) => (rating !== undefined),
  }), []);

  const [pageable, setCurrentPage] = usePageableGroup({
    initialValues,
    initialPage,
    order,
    pages,
    data: undefined,
    loading: false,
    error: null,
    onSubmit,
    canSubmit,
    isNextEnabled,
  });
  return (
    <>
      <h1>{t('reviews.titles.write')}</h1>
      {pageable}
    </>
  );
}
