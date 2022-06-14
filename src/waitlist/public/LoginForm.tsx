import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { object as validateObject } from 'yup';
import { Referrable } from '../referral.api';
import { LoginRequest, useWaitlistLogin } from './waitlist-public.api';
import { FormCheckbox, FormInput } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';
import { GoToEmailModal } from './GoToEmailModal';
import { requiredString } from '../../yupHelper';

export function LoginForm({ referrer }: Referrable) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }, put] = useWaitlistLogin();
  return (
    <div>
      <h2>
        {t('waitlist.login.title')}
      </h2>
      <Formik<LoginRequest>
        initialValues={{
          referrer,
          email: '',
          reset: false,
        }}
        validationSchema={validateObject({
          email: requiredString()
            .email(t('form.errors.email')),
        })}
        onSubmit={(value, { setSubmitting }) => {
          put(value)
            .then(() => {
              setSubmitting(false);
            });
        }}
      >
        {(formik) => (
          <>
            <FormInput label={t('person.email')} name="email" type="email" required id="loginEmail" />
            <FormCheckbox label={t('waitlist.login.reset')} name="reset" />
            <SubmitButton formik={formik} data={data} loading={loading} error={error} />
          </>
        )}
      </Formik>
      {!!data && <GoToEmailModal />}
    </div>
  );
}
