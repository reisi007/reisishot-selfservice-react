import React, {ReactElement} from 'react';
import {AxiosError} from 'axios';
import {ResponseValues} from 'axios-hooks';

type Props<TResponse> = {
  result: [ResponseValues<TResponse, unknown, unknown>, ...unknown[]],
  loadingElement: ReactElement,
  errorElement?: (error: AxiosError<unknown, unknown>) => ReactElement,
  displayData: (data: TResponse) => React.ReactElement
}

export function Loadable<TResponse>({
                                      result,
                                      loadingElement,
                                      errorElement = (e) => <>{`${e.code} ${e.message}`}</>,
                                      displayData,

                                    }: Props<TResponse>) {
  const [{data, loading, error}] = result;

  return <>
    {loading && loadingElement}
    {error && errorElement(error)}
    {!loading && data && displayData(data)}
  </>;
}
