import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { Formik } from 'formik';
import { object as validateObject, string as validateString } from 'yup';
import { FormikHelpers } from 'formik/dist/types';
import { LoginData } from '../../utils/LoginData';
import { FormTextArea } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';
import { useSubmitComment, useSubmitRating } from './choose-images.api';
import { DefaultErrorElement } from '../../components/Loadable';
import { FiveStarRating } from '../../form/FiveStarRating';

export function ChooseImageForm({
  initialValues,
  ...props
}: { loginData: LoginData, folder: string, image: string, initialValues: { stars?: number, comment?: string } }) {
  const {
    stars: initialStars = 0,
    comment: initialComment = '',
  } = initialValues;
  return (
    <>
      <Stars {...props} initialValue={initialStars} />
      <Comment {...props} initialValue={initialComment} />
    </>
  );
}

type FormValueOnly<T> = { value: T };

type Props<T> = { loginData: LoginData, folder: string, image: string, initialValue: T };

function Stars({
  loginData,
  folder,
  image,
  initialValue,
}: Props<number>) {
  const [lastValidValue, setLastValidValue] = useState(initialValue);
  const [{ error: submitRatingError }, submitRating] = useSubmitRating(loginData, folder, image);
  const { t } = useTranslation();
  const errorText = t('admin.choose_images.errors.submit_rating');

  const onChange = useCallback((points: number) => {
    const stars = points / 20.0;
    submitRating(stars)
      .then(() => {
        setLastValidValue(stars);
      });
  }, [submitRating]);

  return (
    <div className="flex flex-wrap justify-center w-full">
      <FiveStarRating className="flex flex-wrap justify-center" starSize="rs-3xl" value={20 * lastValidValue} onChange={onChange} />
      {submitRatingError && <DefaultErrorElement error={errorText} />}
    </div>
  );
}

function Comment({
  loginData,
  folder,
  image,
  initialValue: value,
}: Props<string>) {
  const [submitCommentRequest, submitComment] = useSubmitComment(loginData, folder, image);
  const { t } = useTranslation();
  const onSubmit = useCallback(({ value: comment }: FormValueOnly<string>, { setSubmitting }: FormikHelpers<FormValueOnly<string>>) => {
    submitComment(comment)
      .then(() => setSubmitting(false));
  }, [submitComment]);

  return (
    <Formik<FormValueOnly<string>>
      initialValues={{ value }}
      onSubmit={onSubmit}
      validationSchema={validateObject({
        value: validateString()
          .min(3, t('form.errors.string.min', { min: 3 })),
      })}
    >
      {(formik) => (
        <>
          <h3>{t('waitlist.titles.selfservice.tabs.choose_image.comment.title')}</h3>
          <FormTextArea className="my-2" name="value" cols={5} />
          <SubmitButton {...submitCommentRequest} formik={formik}>{t('waitlist.titles.selfservice.tabs.choose_image.comment.submit')}</SubmitButton>
        </>
      )}
    </Formik>
  );
}
