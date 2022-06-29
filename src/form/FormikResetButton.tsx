import React from 'react';
import { FormInput } from './FormikFields';
import { ResetButton } from '../components/StyledButton';

export function FormikResetButton({
  value,
  resetOnClick,
  label,
}: { value: string, resetOnClick: () => void, label: string }) {
  return (
    <div className="block mx-auto w-11/12 sm:w-1/2">
      <span className="flex justify-center">
        <FormInput name="search" label={label} />
        {!!value && <ResetButton onClick={resetOnClick} />}
      </span>
    </div>

  );
}
