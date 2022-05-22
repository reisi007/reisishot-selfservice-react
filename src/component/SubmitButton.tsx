import {useTranslation} from 'react-i18next';
import {Button} from './Button';
import React from 'react';

type Props = { isValid: boolean, isDirty: boolean };

export function SubmitButton({isValid, isDirty}: Props) {
  const {t} = useTranslation();
  return <Button className="mx-auto w-full text-white bg-reisishot" text={t('form.submit')}
                 disabled={!isValid || !isDirty}
                 type="submit"></Button>;
}
