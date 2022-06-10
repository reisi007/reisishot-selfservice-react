import React, { useCallback } from 'react';
import { Form, Formik } from 'formik';
import { object as validateObject } from 'yup';
import { useTranslation } from 'react-i18next';
import { FormikHelpers } from 'formik/dist/types';
import { FormInput } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';
import { LoginFormData, useLoginUser } from './login.api';
import { requiredString } from '../../yupHelper';
import { LoginData } from '../../utils/LoginData';

type Props = { data?: LoginData, setData: (i: LoginData | undefined) => void } & React.HTMLProps<HTMLDivElement>;

export function LoginForm({
  setData,
  ...divProps
}: Props) {
  const [{
    data,
    loading,
    error,
  }, loginUser] = useLoginUser();
  const onSubmit: (values: LoginFormData, formikHelpers: FormikHelpers<LoginFormData>) => void | Promise<any> = useCallback(async (values, { setSubmitting }) => {
    const { data: response } = await loginUser(values);
    const {
      user,
      hash,
    } = response;
    setData({
      user,
      auth: hash,
    });
    setSubmitting(false);
  }, [loginUser, setData]);
  const { t } = useTranslation();

  return (
    <div {...divProps}>

      <Formik<LoginFormData>
        initialValues={{
          user: '',
          pwd: '',
        }}
        validationSchema={validateObject({
          user: requiredString(),
          pwd: requiredString(),
        })}
        onSubmit={onSubmit}
      >
        {
          (formik) => (
            <Form className="flex flex-col items-center p-4 mx-auto w-full md:w-1/2">
              <div className="grid gap-2 md:grid-cols-2">
                <FormInput name="user" required label={t('admin.login.user')} />
                <FormInput
                  name="pwd"
                  required
                  type="password"
                  label={t('admin.login.password')}
                />
              </div>
              <SubmitButton data={data} loading={loading} error={error} formik={formik} />
            </Form>
          )
        }

      </Formik>
    </div>
  );
}
