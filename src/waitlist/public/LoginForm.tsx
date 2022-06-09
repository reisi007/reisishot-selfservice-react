import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { Referrable } from '../referral.api';
import { LoginRequest, useWaitlistLogin } from './waitlist-public.api';
import { FormInput } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';
import { GoToEmailModal } from './GoToEmailModal';

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
        {t('waitlist.titles.login')}
      </h2>
      <Formik<LoginRequest>
        initialValues={{
          referrer,
          email: '',
        }}
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
            <SubmitButton formik={formik} data={data} loading={loading} error={error} />
          </>
        )}
      </Formik>
      {!!data && <GoToEmailModal />}
    </div>
  );
}
