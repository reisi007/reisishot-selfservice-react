import {FieldProps, FormikErrors} from 'formik';
import classNames from 'classnames';

type TextFieldProps = { label: string } & FieldProps;


export function TextField({label = 'Label missing', field, form, ...props}: TextFieldProps) {
  const name = field.name;
  const errors = form.touched[name] && form.errors[name];
  const conditionalClassNames = classNames({
    'border-red-500': errors,
  });
  return <span className="inline-flex flex-col">
    <label className="text-gray-700" htmlFor={name}>{label}</label>
    <input {...field} {...props} className={`p-2 border border-gray-200 rounded-lg ${conditionalClassNames}`}/>
    {errors && <DisplayError error={errors}/>}
  </span>;
}


export function DisplayError({error: _error}: { error: string | FormikErrors<unknown> | string[] | FormikErrors<unknown>[] }) {
  let error: string = '';
  if(typeof _error === 'string') {
    error = _error;
  }
  return <>{error && <span className="text-red-500 opacity-80">{error}</span>}</>;


}
