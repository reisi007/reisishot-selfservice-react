import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { useSubmitReview } from './review.api';
import { WaitlistPerson } from '../waitlist/public/waitlist-public.api';
import { Page, Pageable } from '../components/Pageable';
import { PageProps, ReviewPages, WriteReviewBasePage } from './WriteReviewBasePages';

function useInitialReview(): [keyof ReviewPages, ReviewPages] {
  const {
    email = '',
    firstName = '',
    lastName = '',
  } = useLocation().state as (Pick<WaitlistPerson, 'email' | 'firstName' | 'lastName'> | undefined) ?? {};
  const name = `${firstName} ${lastName}`.trim();
  const initialPage = name ? 'rating' : 'person';
  return [initialPage, {
    person: {
      name,
      email,
    },
    rating: {
      rating: undefined,
    },
  }];
}

export function WriteReview() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="mb-2">{t('reviews.titles.write')}</h1>
      <PageableForm />
    </>
  );
}

function PageableForm() {
  const { t } = useTranslation();
  const [initialPage, initialValues] = useInitialReview();
  const order = Object.keys(initialValues) as Array<keyof ReviewPages>;
  const [request, postReview] = useSubmitReview();

  const onSubmit = useCallback(() => {
  }, []);

  return (
    <Pageable order={order} initialPage={initialPage}>
      {(context) => (
        <>
          <Page context={context} name="person">
            {(c) => <NamePage request={request} onSubmit={onSubmit} context={c} />}
          </Page>
          <Page context={context} name="rating">
            {(c) => <RatingPage request={request} onSubmit={onSubmit} context={c} />}
          </Page>
        </>
      )}
    </Pageable>
  );
}

function NamePage(props: PageProps) {
  const { context } = props;
  const [{ name }] = context;
  return (
    <WriteReviewBasePage {...props} canNext={false} canSubmit={false}>
      <h2>
        !!
        {name}
        !!
      </h2>
    </WriteReviewBasePage>
  );
}

function RatingPage(props: PageProps) {
  const { context } = props;
  const [{ name }] = context;
  return (
    <WriteReviewBasePage {...props} canNext={false} canSubmit={false}>
      <h2>
        !!
        {name}
        !!
      </h2>
    </WriteReviewBasePage>
  );
}
