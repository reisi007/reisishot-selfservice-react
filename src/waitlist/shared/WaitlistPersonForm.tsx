import { AxiosPromise } from 'axios';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { LoadableRequest } from '../../components/Loadable';
import { RegisterRequest } from '../public/waitlist-public.api';
import { FormInput, FormTextArea } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';

type Props = {
  initialValues: RegisterRequest,
  put: (body: RegisterRequest) => AxiosPromise<unknown>,
  children?: ReactNode
} & LoadableRequest<unknown>;

export function WaitlistPersonForm(
  {
    initialValues,
    children,
    put,
    loading,
    data,
    error,
  }: Props,
) {
  const { t } = useTranslation();
  return (
    <Formik<RegisterRequest>
      initialValues={initialValues}
      onSubmit={(value, { setSubmitting }) => {
        put(value)
          .then(() => {
            setSubmitting(false);
          });
      }}
    >
      {(formik) => (
        <>
          <div className="grid md:grid-cols-2">
            <FormInput label={t('person.firstname')} required name="firstName" />
            <FormInput label={t('person.lastname')} required name="lastName" />
          </div>
          <FormInput label={t('person.email')} name="email" required type="email" id="registerEmail" />
          <FormInput label={t('person.birthday.title')} data-date-placeholder={t('person.birthday.placeholder.supported')} name="birthday" required type="date" />
          <FormInput label={t('person.phone')} name="phone_number" required />
          <FormInput label={t('person.social')} name="website" />
          <FormTextArea label={t('waitlist.availability')} required rows={5} name="availability" />
          <SubmitButton formik={formik} data={data} loading={loading} error={error}>{children}</SubmitButton>
        </>
      )}
    </Formik>
  );
}
