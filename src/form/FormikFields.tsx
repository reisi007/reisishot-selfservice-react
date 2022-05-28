import {Field, FieldProps} from 'formik';
import {HTMLInputTypeAttribute, ReactElement} from 'react';
import {FormErrorProps, StyledInputField} from './StyledFields';

type FormFieldProps = { label: string, name: string, className: string, required?: boolean }
type TextFieldProps = { type?: HTMLInputTypeAttribute } & FormFieldProps

export function FormInput({label, name, className, required, type = 'text'}: TextFieldProps) {
  return <Field name={name} type={type} label={label} required={required} className={className}
                component={FormikFormInput}/>;
}

function FormikFormInput({label, field, form, required = false, ...props}: TextFieldProps & FieldProps) {
  const name = field.name;
  const error = form.touched[name] && form.errors[name];

  return <span className="inline-flex flex-col">
    <FormLabel name={name} label={label} required={required}/>
    <StyledInputField {...field} {...props} error={error} required={required}/>
    {error && <FormError error={error}/>}
  </span>;
}

type FormLabelProps = { name: string, label: string, required: boolean, children?: ReactElement | undefined }

export function FormLabel({name, label, required, children}: FormLabelProps) {
  return <label className="text-gray-700" htmlFor={name}>
    {children} {label} {required && <span className="text-red-500">*</span>}
  </label>;
}

export function FormError({error: _error}: FormErrorProps) {
  let error: string = '';
  if(typeof _error === 'string') {
    error = _error;
  }
  return <>{error && <span className="ml-2 text-red-500 opacity-80">{error}</span>}</>;
}
