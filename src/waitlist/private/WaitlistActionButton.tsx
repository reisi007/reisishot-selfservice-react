import {
  Dispatch, SetStateAction, useCallback, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FormikHelpers } from 'formik/dist/types';
import { Formik } from 'formik';
import { DeleteWaitlistRequest, useDeleteRegistrationForWaitlist, useRegisterForWaitlist } from './waitlist-private.api';
import { LoginData } from '../../utils/LoginData';
import { WaitlistItem, WaitlistRequest } from '../public/waitlist-public.api';
import { FormTextArea } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';

type PublicProps = { item: WaitlistItem, loginData: LoginData };

export function WaitlistActionButton({
  item,
  loginData,
}: PublicProps) {
  const { registered: initialRegistered } = item;
  const [isRegistered, setRegistered] = useState(initialRegistered);

  return isRegistered ? <DeleteRegistration item={item} loginData={loginData} setRegistered={setRegistered} />
    : <Register item={item} loginData={loginData} setRegistered={setRegistered} />;
}

type Props = PublicProps & { setRegistered: Dispatch<SetStateAction<boolean>> };

function Register({
  item,
  loginData,
  setRegistered,
}: Props) {
  const [{
    data,
    loading,
    error,
  }, post] = useRegisterForWaitlist();
  const { t } = useTranslation();
  const { id: itemId } = item;
  const onSubmit = useCallback((submittedValue: WaitlistRequest, { setSubmitting }: FormikHelpers<WaitlistRequest>) => {
    post(submittedValue, loginData)
      .then(() => {
        setSubmitting(false);
        setRegistered(true);
      });
  }, [loginData, post, setRegistered]);
  return (
    <Formik<WaitlistRequest>
      initialValues={{
        item_id: itemId,
        text: '',
      }}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <>
          <FormTextArea rows={5} placeholder={t('waitlist.shooting.additionalInfo')} name="text" />
          <SubmitButton
            className="font-semibold"
            allowInitialSubmit
            formik={formik}
            data={data}
            loading={loading}
            error={error}
          >
            {t('waitlist.registerNow')}
          </SubmitButton>
        </>
      )}
    </Formik>
  );
}

function DeleteRegistration({
  item,
  loginData,
  setRegistered,
}: Props) {
  const [{
    data,
    loading,
    error,
  }, post] = useDeleteRegistrationForWaitlist();
  const { t } = useTranslation();
  const { id: itemId } = item;
  const onSubmit = useCallback((submittedValue: DeleteWaitlistRequest, { setSubmitting }: FormikHelpers<DeleteWaitlistRequest>) => {
    post(submittedValue, loginData)
      .then(() => {
        setSubmitting(false);
        setRegistered(false);
      });
  }, [loginData, post, setRegistered]);
  return (
    <Formik<DeleteWaitlistRequest> initialValues={{ item_id: itemId }} onSubmit={onSubmit}>
      {(formik) => (
        <SubmitButton
          className="font-semibold bg-red-500"
          allowInitialSubmit
          formik={formik}
          data={data}
          loading={loading}
          error={error}
        >
          {t('waitlist.unregisterNow')}
        </SubmitButton>
      )}
    </Formik>
  );
}
