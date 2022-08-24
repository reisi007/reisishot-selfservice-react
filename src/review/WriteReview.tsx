import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useCallback, useRef } from 'react';
import { Formik } from 'formik';
import { number as validateNumber, object as validateObject, string as validateString } from 'yup';
import dayjs from 'dayjs';
import { useSubmitReview } from './review.api';
import { WaitlistPerson } from '../waitlist/public/waitlist-public.api';
import { Page, Pageable } from '../components/Pageable';
import { ReviewPages, WriteReviewBasePage, WriteReviewPageProps } from './WriteReviewBasePages';
import { Form5StarRating, FormInput, FormTextArea } from '../form/FormikFields';
import { requiredString } from '../yupHelper';
import { Review } from './Review';
import { TEMPLATE_STRING_AS_DATE } from '../utils/Age';
import { RequestActionButton } from '../admin/waitlist/ActionButton';
import { LoadableRequest } from '../components/Loadable';
import { useModal } from '../components/Modal';

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
    text: {
      review_public: '',
      review_private: '',
    },
    check: undefined,
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
      text,
    } = value.current;

    postReview({
      name: person.name,
      email: person.email,
      rating: rating.rating,
      review_private: text.review_private,
      review_public: text.review_public,
    });
  }, [postReview]);

  return (
    <Pageable order={order} initialPage={initialPage}>
      {(context) => (
        <>
          <Page context={context} name="person">
            {(c) => (
              <NamePage
                request={request}
                value={value}
                context={c}
              />
            )}
          </Page>
          <Page context={context} name="rating">
            {(c) => (
              <RatingPage
                request={request}
                value={value}
                context={c}
              />
            )}
          </Page>
          <Page context={context} name="text">
            {(c) => (
              <PublicPage
                request={request}
                value={value}
                context={c}
              />
            )}
          </Page>
          <Page context={context} name="check">
            {(c) => (
              <ReviewReview
                onSubmit={onSubmit}
                request={request}
                value={value}
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
        email: requiredString()
          .email(),
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
          canNext={(isValid && isDirty) || (values.email !== undefined && values.email.length > 0 && !isDirty)}
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

function PublicPage(props: WriteReviewPageProps) {
  const {
    context,
    value,
  } = props;
  const { t } = useTranslation();
  const [{ name }] = context;
  return (
    <Formik<ReviewPages['text']>
      initialValues={value.current.text}
      validationSchema={validateObject({
        review_public: requiredString()
          .min(1, t('form.errors.required')),
        review_private: validateString(),
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
          canNext={(isValid && isDirty)}
          saveState={() => {
            value.current.text = values;
          }}
        >
          <h2>
            {t('reviews.titles.text')}
          </h2>
          <p>
            {t('reviews.text.public.before')}
          </p>
          <ul>
            {(['1', '2', '3'] as const).map((e) => (
              <li key={e}>
                {t(`reviews.text.public.${e}`)}
              </li>
            ))}
          </ul>
          <p>
            {t('reviews.text.public.after')}
          </p>
          <FormTextArea
            required
            name="review_public"
            rows={5}
            label={t('reviews.text.public.textarea')}
          />
          <FormTextArea
            required
            name="review_private"
            label={t('reviews.text.private.textarea')}
          />
        </WriteReviewBasePage>
      )}
    </Formik>
  );
}

function ReviewReview(props: WriteReviewPageProps & { onSubmit: () => void }) {
  const { t } = useTranslation();
  const {
    value,
    request,
    onSubmit,
  } = props;
  const {
    rating,
    text,
    person,
  } = value.current;
  const buttons = <SubmitReview {...request} onSubmit={onSubmit} />;
  return (
    <WriteReviewBasePage
      {...props}
      canNext={false}
      saveState={() => {
      }}
      buttons={buttons}
    >
      <h2>
        {t('reviews.titles.check')}
      </h2>

      <Review
        className="my-4"
        {...rating}
        {...text}
        {...person}
        creation_date={dayjs()
          .format(TEMPLATE_STRING_AS_DATE)}
      />
    </WriteReviewBasePage>
  );
}

function SubmitReview({
  onSubmit,
  ...request
}: LoadableRequest<unknown> & { onSubmit: () => void }) {
  const { t } = useTranslation();
  const content = useCallback(() => <p>{t('reviews.success.text')}</p>, [t]);
  const [modal] = useModal(t('reviews.success.title'), content, true);
  return (
    <>
      {request.data === undefined
        ? <RequestActionButton className="text-white bg-reisishot" {...request} onClick={onSubmit}>{t('actions.submit')}</RequestActionButton>
        : modal}
    </>
  );
}
