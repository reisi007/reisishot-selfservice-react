import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useCallback, useRef } from 'react';
import { Formik } from 'formik';
import { number as validateNumber, object as validateObject } from 'yup';
import { useSubmitReview } from './review.api';
import { WaitlistPerson } from '../waitlist/public/waitlist-public.api';
import { Page, Pageable } from '../components/Pageable';
import { ReviewPages, WriteReviewBasePage, WriteReviewPageProps } from './WriteReviewBasePages';
import { Form5StarRating, FormInput } from '../form/FormikFields';
import { requiredString } from '../yupHelper';

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
      rating: 0,
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
  const value = useRef(initialValues);

  const onSubmit = useCallback(() => {
    const {
      person,
      rating,
    } = value.current;

    postReview({
      name: person.name,
      email: person.email,
      rating: rating.rating,
    });
  }, [postReview]);

  return (
    <Pageable order={order} initialPage={initialPage}>
      {(context) => (
        <>
          <Page context={context} name="person">
            {(c) => (
              <NamePage
                value={value}
                request={request}
                onSubmit={onSubmit}
                context={c}
              />
            )}
          </Page>
          <Page context={context} name="rating">
            {(c) => (
              <RatingPage
                value={value}
                request={request}
                onSubmit={onSubmit}
                context={c}
              />
            )}
          </Page>
        </>
      )}
    </Pageable>
  );
}

function NamePage(props: WriteReviewPageProps) {
  const {
    value,
    context,
  } = props;
  const { t } = useTranslation();
  const [{ name }] = context;
  return (
    <Formik<ReviewPages['person']>
      initialValues={value.current.person}
      validationSchema={validateObject({
        name: requiredString(),
        email: requiredString(),
      })}
      onSubmit={() => {
        // Form won't be submitted
      }}
    >
      {({
        values,
        isValid,
        dirty: isDirty,
      }) => (
        <WriteReviewBasePage
          key={name}
          {...props}
          canNext={(isValid && isDirty) || !!(values.email && values.name)}
          canSubmit={false}
          saveState={() => {
            value.current.person = values;
          }}
        >
          <h2 className="mb-2">
            {t('reviews.person.title')}
          </h2>
          <div className="grid gap-2">
            <FormInput label={t('reviews.person.name')} name="name" required />
            <FormInput label={t('reviews.person.email')} name="email" required type="email" />
          </div>
        </WriteReviewBasePage>
      )}
    </Formik>
  );
}

function RatingPage(props: WriteReviewPageProps) {
  const {
    context,
    value,
  } = props;
  const { t } = useTranslation();
  const [{ name }] = context;
  return (
    <Formik<ReviewPages['rating']>
      initialValues={value.current.rating}
      validationSchema={validateObject({
        rating: validateNumber()
          .required(t('form.errors.required'))
          .min(1, t('form.errors.required')),
      })}
      onSubmit={() => {
      }}
    >
      {({
        values,
        isValid,
        dirty: isDirty,
      }) => (
        <WriteReviewBasePage
          key={name}
          {...props}
          canNext={(isValid && isDirty) || (values.rating !== undefined && values.rating > 0)}
          canSubmit={false}
          saveState={() => {
            value.current.rating = values;
          }}
        >
          <h2>
            {t('reviews.rating.what')}
          </h2>
          <Form5StarRating
            required
            starSize="rs-4xl"
            name="rating"
            label={t('reviews.rating.rating')}
          />
        </WriteReviewBasePage>
      )}
    </Formik>
  );
}
