import {HTMLProps} from 'react';
import classNames from 'classnames';
import {FormikErrors} from 'formik';

export type FormErrorProps = { error: string | FormikErrors<unknown> | string[] | FormikErrors<unknown>[] | false | undefined };

export function StyledInputField(props: Omit<HTMLProps<HTMLInputElement>, 'className'> & FormErrorProps) {
  const {error} = props;
  const conditionalClassNames = classNames({
    'border-red-500': error,
  });

  return <input {...props}
                className={`p-2 border accent-reisishot border-gray-200 rounded-lg ${conditionalClassNames}`}/>;
}
