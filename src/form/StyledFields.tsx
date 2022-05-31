import {HTMLProps} from 'react';
import classNames from 'classnames';

export type FormErrorProps = { error: string | string[] | false };

type StyledInputFieldProps = Omit<HTMLProps<HTMLInputElement>, 'className'> & FormErrorProps;

export function StyledInputField(props: StyledInputFieldProps) {
  const {error, name} = props;
  const conditionalClassNames = classNames({
    'border-red-500': !!error,
  });

  return <input {...props} id={name}
                className={`p-2 border accent-reisishot border-gray-200 rounded-lg ${conditionalClassNames}`}/>;
}

type StyledSelectFieldProps = Omit<HTMLProps<HTMLSelectElement>, 'className'> & FormErrorProps & SelectOptionProps;

export function StyledSelectField(rawProps: StyledSelectFieldProps) {
  const {error, name, options, disabledOption, ...props} = rawProps;
  const conditionalClassNames = classNames({
    'border-red-500': !!error,
  });

  return <select {...props} id={name}
                 className={`p-2 border accent-reisishot border-gray-200 rounded-lg ${conditionalClassNames}`}>
    {!!disabledOption && <option value="" disabled>{disabledOption}</option>}
    {options.map(({key, displayValue}) => <option value={key} key={key}>{displayValue}</option>)}
  </select>;
}

export type SelectOptionProps = { options: Array<{ key: string, displayValue: string }>, disabledOption?: string }
