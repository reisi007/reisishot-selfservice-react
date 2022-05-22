import {Field, FieldProps, FormikErrors} from 'formik';
import classNames from 'classnames';
import {HTMLInputTypeAttribute} from 'react';

type FormFieldProps = { label: string, name: string, className: string, required?: boolean }
type TextFieldProps = { type?: HTMLInputTypeAttribute } & FormFieldProps

export function FormInput({label, name, className, required, type = 'text'}: TextFieldProps) {
  return <Field name={name} type={type} label={label} required={required} className={className}
                component={FormikFormInput}/>;
}

function FormikFormInput({label, field, form, required = false, ...props}: TextFieldProps & FieldProps) {
  const name = field.name;
  const error = form.touched[name] && form.errors[name];
  const conditionalClassNames = classNames({
    'border-red-500': error,
  });
  return <span className="inline-flex flex-col">
    <FormLabel name={name} label={label} required={required}/>
    <input {...field} {...props} required={required}
           className={`p-2 border border-gray-200 rounded-lg ${conditionalClassNames}`}/>
    {error && <FormError error={error}/>}
  </span>;
}

type FormLabelProps = { name: string, label: string, required: boolean }

function FormLabel({name, label, required}: FormLabelProps) {
  return <label className="text-gray-700" htmlFor={name}>{label}{required &&
                                                                 <span className="text-red-500">*</span>}</label>;
}

type FormErrorProps = { error: string | FormikErrors<unknown> | string[] | FormikErrors<unknown>[] };

export function FormError({error: _error}: FormErrorProps) {
  let error: string = '';
  if(typeof _error === 'string') {
    error = _error;
  }
  return <>{error && <span className="ml-2 text-red-500 opacity-80">{error}</span>}</>;
}
