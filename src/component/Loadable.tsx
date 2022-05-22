import React, {ReactElement} from 'react';
import {UseAxiosResult} from 'axios-hooks';
import {AxiosError} from 'axios';

type Props<TResponse, TBody> = {
  result: UseAxiosResult<TResponse, TBody, unknown>,
  loadingElement: ReactElement,
  errorElement?: (error: AxiosError<unknown, unknown>) => ReactElement,
  displayData: (data: TResponse) => React.ReactElement
}

export function Loadable<TResponse>({
                                      result,
                                      loadingElement,
                                      errorElement = (e) => <>{`${e.code} ${e.message}`}</>,
                                      displayData,

                                    }: Props<TResponse, unknown>) {
  const [{data, loading, error}] = result;

  return <>
    {loading && loadingElement}
    {error && errorElement(error)}
    {!loading && data && displayData(data)}
  </>;
}
