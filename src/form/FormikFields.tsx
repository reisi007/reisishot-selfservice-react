import { Field, FieldProps, getIn } from 'formik';
import { HTMLInputTypeAttribute, HTMLProps, ReactElement } from 'react';
import { FormikProps } from 'formik/dist/types';
import classNames from 'classnames';
import {
  FormErrorProps, SelectOptionProps, StyledInputField, StyledSelectField, StyledTextArea,
} from './StyledFields';
import { FiveStarRating, FiveStarRatingProps } from './FiveStarRating';

type FormFieldProps = { label?: string, name: string, className?: string, required?: boolean };
type TextFieldProps =
  { type?: HTMLInputTypeAttribute }
  & FormFieldProps
  & Partial<HTMLProps<HTMLInputElement>>;
type SelectFieldProps =
  & SelectOptionProps
  & FormFieldProps
  & Partial<HTMLProps<HTMLSelectElement>>;
type TextAreaProps = FormFieldProps & Partial<HTMLProps<HTMLTextAreaElement>>;

type CheckfieldProps = Omit<TextFieldProps, 'type'>;

type FiveStarRatingFormProps = FormFieldProps & Omit<FiveStarRatingProps, 'value' | 'onChange'>;

export function FormInput({
  label,
  name,
  required,
  type = 'text',
  ...props
}: TextFieldProps) {
  return (
    <Field
      {...props}
      name={name}
      type={type}
      label={label}
      required={required}
      component={FormikFormInput}
    />
  );
}

export function FormCheckbox({
  label,
  name,
  required,
  ...props
}: CheckfieldProps) {
  return (
    <Field
      {...props}
      name={name}
      label={label}
      required={required}
      component={FormikCheckbox}
    />
  );
}

export function Form5StarRating({
  label,
  name,
  required,
  ...props
}: FiveStarRatingFormProps) {
  return (
    <Field
      {...props}
      name={name}
      label={label}
      required={required}
      component={FormFiveStarRating}
    />
  );
}

function FormFiveStarRating({
  label,
  field,
  form,
  required = false,
  ...restProps
}: FiveStarRatingFormProps & FieldProps) {
  const {
    name,
    value = 0,
    onChange,
  } = field;
  const error = getError(form, name);
  const {
    className,
    ...props
  } = restProps;

  const classes = classNames(className, 'flex flex-col');
  return (
    <span className={classes}>
      {label !== undefined && <FormLabel name={name} label={label} required={required} />}
      <FiveStarRating
        className="flex flex-wrap justify-center py-2"
        {...field}
        {...props}
        onChange={(v) => form.setFieldValue(name, v, true)}
        value={parseInt(value, 10)}
      />
      <FormError error={error} />
    </span>
  );
}

export function FormTextArea({
  label,
  name,
  required,
  ...props
}: TextAreaProps) {
  return (
    <Field
      {...props}
      name={name}
      label={label}
      required={required}
      component={FormikTextArea}
    />
  );
}

function getError(form: FormikProps<unknown>, name: string): false | string | Array<string> {
  return getIn(form.touched, name) && getIn(form.errors, name);
}

function FormikFormInput({
  label,
  field,
  form,
  required = false,
  ...restProps
}: TextFieldProps & FieldProps) {
  const { name } = field;
  const error = getError(form, name);
  const {
    className,
    ...props
  } = restProps;

  const classes = classNames(className, 'flex flex-col');
  return (
    <span className={classes}>
      {label !== undefined && <FormLabel name={name} label={label} required={required} />}
      <StyledInputField {...field} {...props} error={error} required={required} />
      <FormError error={error} />
    </span>
  );
}

function FormikCheckbox({
  label,
  field: rawField,
  form,
  required = false,
  ...restProps
}: CheckfieldProps & FieldProps<boolean>) {
  const {
    name,
    value,
    ...field
  } = rawField;
  const error = getError(form, name);
  const {
    className = '',
    ...props
  } = restProps;
  const classes = classNames('inline-block', className);
  return (
    <span className={classes}>
      <StyledInputField
        {...field}
        {...props}
        error={error}
        type="checkbox"
        name={name}
        checked={value}
        required={required}
      />
      {label !== undefined && <FormLabel name={name} label={label} required={required} />}
      <FormError error={error} />
    </span>
  );
}

function FormikTextArea({
  label,
  field,
  form,
  required = false,
  ...restProps
}: TextAreaProps & FieldProps) {
  const { name } = field;
  const error = getError(form, name);
  const {
    className,
    ...props
  } = restProps;

  const classes = classNames(className, 'flex flex-col');
  return (
    <span className={classes}>
      {label !== undefined && <FormLabel name={name} label={label} required={required} />}
      <StyledTextArea {...field} {...props} error={error} required={required} />
      <FormError error={error} />
    </span>
  );
}

export function FormSelect({
  label,
  name,
  required,
  type = 'text',
  ...props
}: SelectFieldProps) {
  return (
    <Field
      {...props}
      name={name}
      type={type}
      label={label}
      required={required}
      component={FormikSelectInput}
    />
  );
}

function FormikSelectInput({
  label,
  field,
  form,
  required = false,
  ...restProps
}: SelectFieldProps & FieldProps) {
  const { name } = field;
  const error = getError(form, name);
  const {
    className,
    ...props
  } = restProps;

  const classes = classNames(className, 'flex flex-col');
  return (
    <span className={classes}>
      {label !== undefined && <FormLabel name={name} label={label} required={required} />}
      <StyledSelectField {...field} {...props} error={error} required={required} />
      <FormError error={error} />
    </span>
  );
}

type FormLabelProps = { name: string, label: string, required: boolean, children?: ReactElement };

export function FormLabel({
  name,
  label,
  required,
  children,
}: FormLabelProps) {
  return (
    <label className="text-gray-600" htmlFor={name}>
      {children}
      {' '}
      {label}
      {' '}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export function FormError({ error }: FormErrorProps) {
  return (
    <>
      {error && (
        <span
          className="ml-2 text-red-500 opacity-80"
        >
          {typeof error === 'string' ? error : error.join(', ')}
        </span>
      )}
    </>
  );
}
