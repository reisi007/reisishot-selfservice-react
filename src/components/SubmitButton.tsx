import {useTranslation} from 'react-i18next';
import {StyledButton} from './StyledButton';
import {ResponseValues} from 'axios-hooks';
import {LoadingIndicator} from '../LoadingIndicator';
import {DefaultErrorElement, Loadable} from './Loadable';
import {useMemo} from 'react';
import {FormikProps} from 'formik/dist/types';

type Props<FormType> = {
  formik: FormikProps<FormType>
  requestInfo?: ResponseValues<unknown, unknown, unknown>,
  allowInitialSubmit?: boolean
};

export function SubmitButton<FormType>({formik, requestInfo, allowInitialSubmit = false}: Props<FormType>) {
  const {isValid, dirty: isDirty, submitForm, isSubmitting} = formik;
  const loading = requestInfo?.loading ?? false;
  const {t} = useTranslation();
  const result: [ResponseValues<unknown, unknown, unknown>] | undefined = useMemo(() => {
    return requestInfo === undefined ? undefined : [requestInfo];
  }, [requestInfo]);
  const isDisabled = isSubmitting || loading || !isValid || (!allowInitialSubmit && !isDirty);
  return <>
    <StyledButton className="mx-auto w-full text-white bg-reisishot"
                  type="submit" onClick={() => submitForm()}
                  disabled={isDisabled}>
      <>
        {t('form.submit')}
        {result !== undefined &&
         <Loadable className="inline-flex mt-2" displayData={() => <></>}
                   loadingElement={<LoadingIndicator height="2rem"/>}
                   errorElement={e => <DefaultErrorElement className="bg-white rounded" error={e}/>}
                   result={result}/>}
      </>
    </StyledButton>
  </>;
}
