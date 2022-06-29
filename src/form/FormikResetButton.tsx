import React from 'react';
import classNames from 'classnames';
import { FormInput } from './FormikFields';
import { ResetButton } from '../components/StyledButton';

export function FormikResetButton({
  value,
  resetOnClick,
  label,
  className,
}: { value: string, resetOnClick: () => void, label: string, className?: string }) {
  return (
    <div className={classNames('block mx-auto w-11/12 sm:w-1/2', className)}>
      <span className="flex justify-center">
        <FormInput name="search" label={label} />
        {!!value && <ResetButton onClick={resetOnClick} />}
      </span>
    </div>

  );
}
