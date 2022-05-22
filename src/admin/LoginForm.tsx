import {LoginData} from './admin.api';
import React, {useCallback} from 'react';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {FormikHelpers} from 'formik/dist/types';
import {TextField} from '../form/Fields';
import {Button} from '../component/Button';

type Props = { data?: LoginData, setData: (i: LoginData | undefined) => void } & React.HTMLProps<HTMLDivElement>
type LoginFormData = { user: string, pwd: string }

export function LoginForm({data, setData, ...divProps}: Props) {
  const onSubmit: (values: LoginFormData, formikHelpers: FormikHelpers<LoginFormData>) => void | Promise<any> = useCallback((values, {setSubmitting}) => {
    setSubmitting(false);
    console.log(values);
  }, []);
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
            <Field name="user" className="w-full md:w-1/2" label={t('admin.user')} component={TextField}/>
            <Field name="pwd" className="w-full md:w-1/2" type="password" label={t('admin.password')}
                   component={TextField}/>
          </div>
          <Button className=" mx-auto w-full text-white bg-reisishot" text={t('form.submit')}
                  disabled={!formik.isValid || !formik.dirty}
                  type="submit"></Button>
        </Form>
    }

    </Formik>
  </div>;
}
