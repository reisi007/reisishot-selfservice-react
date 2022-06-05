import { useTranslation } from 'react-i18next';
import { ResponseValues } from 'axios-hooks';
import { useCallback, useMemo } from 'react';
import { FormikProps } from 'formik/dist/types';
import { AxiosError } from 'axios';
import { StyledButton } from './StyledButton';
import { LoadingIndicator } from '../LoadingIndicator';
import { DefaultErrorElement, Loadable } from './Loadable';

type Props<FormType> = {
  formik: FormikProps<FormType>
  requestInfo?: ResponseValues<unknown, unknown, unknown>,
  allowInitialSubmit?: boolean
};

export function SubmitButton<FormType>({
  formik,
  requestInfo,
  allowInitialSubmit = false,
}: Props<FormType>) {
  const {
    isValid,
    dirty: isDirty,
    submitForm,
    isSubmitting,
  } = formik;
  const loading = requestInfo?.loading ?? false;
  const { t } = useTranslation();
  const result: [ResponseValues<unknown, unknown, unknown>] | undefined = useMemo(() => (requestInfo === undefined ? undefined : [requestInfo]), [requestInfo]);
  const isDisabled = isSubmitting || loading || !isValid || (!allowInitialSubmit && !isDirty);
  const errorElement = useCallback((e: AxiosError<unknown, unknown>) => <DefaultErrorElement className="bg-white rounded" error={e} />, []);
  return (
    <StyledButton
      className="mx-auto w-full text-white bg-reisishot"
      type="submit"
      onClick={submitForm}
      disabled={isDisabled}
    >
      <>
        {t('form.submit')}
        {result !== undefined
         && (
           <Loadable
             className="inline-flex mt-2"
             loadingElement={<LoadingIndicator height="2rem" />}
             errorElement={errorElement}
             result={result}
           />
         )}
      </>
    </StyledButton>
  );
}
