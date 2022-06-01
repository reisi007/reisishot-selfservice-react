import {useTranslation} from 'react-i18next';
import {Button} from './Button';
import {ResponseValues} from 'axios-hooks';
import {LoadingIndicator} from '../LoadingIndicator';
import {DefaultErrorElement, Loadable} from './Loadable';
import {useMemo} from 'react';
import {FormikProps} from 'formik/dist/types';

type Props<FormType> = {
  formik: FormikProps<FormType>
  requestInfo?: ResponseValues<unknown, unknown, unknown>
};

export function SubmitButton<FormType>({formik, requestInfo}: Props<FormType>) {
  const {isValid, dirty: isDirty, submitForm} = formik;
  const loading = requestInfo?.loading ?? false;
  const {t} = useTranslation();
  const result: [ResponseValues<unknown, unknown, unknown>] | undefined = useMemo(() => {
    return requestInfo === undefined ? undefined : [requestInfo];
  }, [requestInfo]);
  const isDisabled = !isValid || !isDirty || loading;
  return <>
    <Button className="mx-auto w-full text-white bg-reisishot"
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
    </Button>
  </>;
}
