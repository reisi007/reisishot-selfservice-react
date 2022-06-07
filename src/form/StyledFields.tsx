import { HTMLProps } from 'react';
import classNames from 'classnames';

export type FormErrorProps = { error: string | string[] | false };

type StyledInputFieldProps = HTMLProps<HTMLInputElement> & FormErrorProps;

export function StyledInputField(rawProps: StyledInputFieldProps) {
  const {
    error,
    name,
    className = '',
    ...props
  } = rawProps;
  const conditionalClassNames = classNames({
    'border-red-500': !!error,
  });

  return (
    <input
      {...props}
      id={name}
      className={`p-2 border accent-reisishot border-gray-200 rounded-lg ${conditionalClassNames} ${className}`}
    />
  );
}

type StyledTextAreaProps = HTMLProps<HTMLTextAreaElement> & FormErrorProps;

export function StyledTextArea(rawProps: StyledTextAreaProps) {
  const {
    error,
    name,
    className = '',
    ...props
  } = rawProps;
  const conditionalClassNames = classNames({
    'border-red-500': !!error,
  });

  return (
    <textarea
      {...props}
      id={name}
      className={`p-2 border accent-reisishot border-gray-200 rounded-lg ${conditionalClassNames} ${className}`}
    />
  );
}

type StyledSelectFieldProps = Omit<HTMLProps<HTMLSelectElement>, 'className'> & FormErrorProps & SelectOptionProps;

export function StyledSelectField(rawProps: StyledSelectFieldProps) {
  const {
    error,
    name,
    options,
    disabledOption,
    ...props
  } = rawProps;
  const conditionalClassNames = classNames({
    'border-red-500': !!error,
  });

  return (
    <select
      {...props}
      id={name}
      className={`p-2 border accent-reisishot border-gray-200 rounded-lg ${conditionalClassNames}`}
    >
      {!!disabledOption && <option value="" disabled>{disabledOption}</option>}
      {options.map(({
        key,
        displayName,
      }) => <option value={key} key={key}>{displayName}</option>)}
    </select>
  );
}

export type SelectOptionProps = { options: Array<{ key: string, displayName: string }>, disabledOption?: string };
