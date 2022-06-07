import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { Referrable } from '../referral.api';
import { RegisterRequest, useWaitlistRegister } from './waitlist-public.api';
import { FormInput, FormTextArea } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';
import { GoToEmailModal } from './GoToEmailModal';

export function RegisterForm({ referrer }: Referrable) {
  const { t } = useTranslation();
  const [request, put] = useWaitlistRegister();
  return (
    <div>
      <h2>
        {t('waitlist.titles.register')}
      </h2>
      <Formik<RegisterRequest>
        initialValues={{
          referrer,
          firstName: '',
          lastName: '',
          birthday: '',
          email: '',
          availability: '',
          phone_number: '',
          website: '',
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
            <div className="flex flex-wrap">
              <FormInput className=" w-full md:w-1/2" label={t('person.firstname')} required name="firstName" />
              <FormInput className=" w-full md:w-1/2" label={t('person.lastname')} required name="lastName" />
            </div>
            <FormInput label={t('person.email')} name="email" required type="email" id="registerEmail" />
            <FormInput label={t('person.birthday.title')} data-date-placeholder={t('person.birthday.placeholder.supported')} name="birthday" required type="date" />
            <FormInput label={t('person.phone')} name="phone_number" required />
            <FormInput label={t('person.social')} name="website" />
            <FormTextArea label={t('waitlist.availability')} required rows={5} name="availability" />
            <SubmitButton formik={formik} request={request} />
          </>
        )}
      </Formik>
      {!!request.data && <GoToEmailModal />}
    </div>
  );
}
