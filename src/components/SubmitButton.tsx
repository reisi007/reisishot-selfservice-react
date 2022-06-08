import { useTranslation } from 'react-i18next';
import { ResponseValues } from 'axios-hooks';
import { ReactNode } from 'react';
import { FormikProps } from 'formik/dist/types';
import { AxiosError } from 'axios';
import { StyledButton } from './StyledButton';
import { LoadingIndicator } from '../LoadingIndicator';
import { DefaultErrorElement, Loadable } from './Loadable';

type Props<FormType> = {
  formik: FormikProps<FormType>
  request?: ResponseValues<unknown, unknown, unknown>,
  allowInitialSubmit?: boolean,
  className?: string,
  children?: ReactNode
};

export function SubmitButton<FormType>({
  formik,
  request,
  children,
  className = '',
  allowInitialSubmit = false,
}: Props<FormType>) {
  const {
    isValid,
    dirty: isDirty,
    submitForm,
    isSubmitting,
  } = formik;
  const { t } = useTranslation();
  const {
    data = undefined,
    loading = false,
    error = null,
  } = request ?? {};
  const isDisabled = isSubmitting || loading || !isValid || (!allowInitialSubmit && !isDirty);

  return (
    <StyledButton
      className={`mx-auto w-full text-white bg-reisishot ${className}`}
      type="submit"
      onClick={submitForm}
      disabled={isDisabled}
    >
      <>
        {children ?? t('form.submit')}
        <Loadable
          className="inline-flex mt-2"
          loadingElement={<LoadingIndicator height="2rem" />}
          errorElement={ButtonErrorElement}
          data={data}
          loading={loading}
          error={error}
        />
      </>
    </StyledButton>
  );
}

function ButtonErrorElement(e: AxiosError<unknown, unknown>) {
  return <DefaultErrorElement className="bg-white rounded" error={e} />;
}
