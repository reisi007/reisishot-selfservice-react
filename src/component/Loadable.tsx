import React, {ReactElement} from 'react';
import {UseAxiosResult} from 'axios-hooks';

type Props<TResponse, TBody> = {
  result: UseAxiosResult<TResponse, TBody, unknown>,
  loadingElement: ReactElement,
  errorElement?: (error: unknown) => ReactElement,
  displayData: (data: TResponse) => React.ReactElement
}

export function Loadable<TResponse>({
                                      result,
                                      loadingElement,
                                      errorElement = (e) => <>{JSON.stringify(e)}</>,
                                      displayData,

                                    }: Props<TResponse, unknown>) {
  const [{data, loading, error}] = result;

  return <>
    {loading && loadingElement}
    {error && errorElement(error)}
    {data && displayData(data)}
  </>;
}
