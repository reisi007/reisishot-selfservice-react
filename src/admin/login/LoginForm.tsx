import React, {useCallback} from 'react';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {FormikHelpers} from 'formik/dist/types';
import {FormInput} from '../../form/FormikFields';
import {SubmitButton} from '../../components/SubmitButton';
import {LoginData, LoginFormData, useLoginUser} from './login.api';

type Props = { data?: LoginData, setData: (i: LoginData | undefined) => void } & React.HTMLProps<HTMLDivElement>

export function LoginForm({data, setData, ...divProps}: Props) {
  const loginUser = useLoginUser();
  const onSubmit: (values: LoginFormData, formikHelpers: FormikHelpers<LoginFormData>) => void | Promise<any> = useCallback(async (values, {setSubmitting}) => {
    setSubmitting(false);
    const result = await loginUser(values);
    const {user, hash} = result.data;
    setData({user, auth: hash});
  }, [loginUser, setData]);
  const {t} = useTranslation();

  return <div {...divProps}>

    <Formik<LoginFormData>
      initialValues={{user: '', pwd: ''}}
      validationSchema={Yup.object({
        user: Yup.string()
                 .required(t('form.errors.required')),
        pwd: Yup.string()
                .required(t('form.errors.required')),
      })}
      onSubmit={onSubmit}
    >{
      formik =>
        <Form className="flex flex-col items-center p-4 mx-auto  w-full md:w-1/2">
          <div className="flex flex-wrap justify-center items-stretch space-x-2">
            <FormInput name="user" required className="w-full md:w-1/2" label={t('admin.login.user')}/>
            <FormInput name="pwd" required className="w-full md:w-1/2" type="password"
                       label={t('admin.login.password')}/>
          </div>
          <SubmitButton isValid={formik.isValid} isDirty={formik.dirty}/>
        </Form>
    }

    </Formik>
  </div>;
}
