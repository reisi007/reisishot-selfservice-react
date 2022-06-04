import {Field, FieldProps, getIn} from 'formik';
import {HTMLInputTypeAttribute, HTMLProps, ReactElement} from 'react';
import {FormErrorProps, SelectOptionProps, StyledInputField, StyledSelectField} from './StyledFields';
import {FormikProps} from 'formik/dist/types';

type FormFieldProps = { label: string, name: string, className?: string, required?: boolean }
type TextFieldProps = { type?: HTMLInputTypeAttribute } & FormFieldProps & Partial<HTMLProps<HTMLInputElement>>
type SelectFieldProps =
  & SelectOptionProps
  & FormFieldProps
  & Partial<HTMLProps<HTMLSelectElement>>;

type CheckfieldProps = Omit<TextFieldProps, 'type'>;

export function FormInput({label, name, required, type = 'text', ...props}: TextFieldProps) {
  return <Field {...props} name={name} type={type} label={label} required={required}
                component={FormikFormInput}/>;
}


export function FormCheckbox({label, name, required, ...props}: CheckfieldProps) {
  return <Field {...props} name={name} label={label} required={required}
                component={FormikCheckbox}/>;
}

function getError(form: FormikProps<unknown>, name: string): false | string | Array<string> {
  return getIn(form.touched, name) && getIn(form.errors, name);
}

function FormikFormInput({label, field, form, required = false, ...restProps}: TextFieldProps & FieldProps) {
  const name = field.name;
  const error = getError(form, name);
  const {className = '', ...props} = restProps;

  return <span className={`flex flex-col ${className}`}>
    <FormLabel name={name} label={label} required={required}/>
    <StyledInputField {...field} {...props} error={error} required={required}/>
     <FormError error={error}/>
  </span>;
}

function FormikCheckbox({label, field, form, required = false, ...restProps}: CheckfieldProps & FieldProps) {
  const name = field.name;
  const error = getError(form, name);
  const {className = '', ...props} = restProps;

  return <span className={'inline-block ' + className}>
    <StyledInputField {...field} {...props} error={error} type="checkbox" required={required}/>
     <FormLabel name={name} label={label} required={required}/>
     <FormError error={error}/>
  </span>;
}

export function FormSelect({label, name, required, type = 'text', ...props}: SelectFieldProps) {
  return <Field {...props} name={name} type={type} label={label} required={required}
                component={FormikSelectInput}/>;
}

function FormikSelectInput({label, field, form, required = false, ...restProps}: SelectFieldProps & FieldProps) {
  const name = field.name;
  const error = getError(form, name);
  const {className = '', ...props} = restProps;

  return <span className={`flex flex-col ${className}`}>
    <FormLabel name={name} label={label} required={required}/>
    <StyledSelectField {...field} {...props} error={error} required={required}/>
    <FormError error={error}/>
  </span>;
}

type FormLabelProps = { name: string, label: string, required: boolean, children?: ReactElement | undefined }

export function FormLabel({name, label, required, children}: FormLabelProps) {
  return <label className="text-gray-700" htmlFor={name}>
    {children} {label} {required && <span className="text-red-500">*</span>}
  </label>;
}

export function FormError({error}: FormErrorProps) {
  return <>{error && <span
      className="ml-2 text-red-500 opacity-80">{typeof error === 'string' ? error : error.join(', ')}</span>}</>;
}


