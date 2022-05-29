import React from 'react';
import {AxiosError} from 'axios';
import {ResponseValues} from 'axios-hooks';

type Props<TResponse> = {
  result: [ResponseValues<TResponse, unknown, unknown>, ...unknown[]],
  loadingElement: JSX.Element,
  errorElement?: (error: AxiosError<unknown, unknown>) => JSX.Element,
  displayData: (data: TResponse) => JSX.Element,
  className?: string
}

export function Loadable<TResponse>({
                                      result,
                                      loadingElement,
                                      errorElement = (e) => <>{`${e.code} ${e.message}`}</>,
                                      displayData,
                                      className = '',
                                    }: Props<TResponse>) {
  const [{data, loading, error}] = result;

  return <div className={'flex flex-col ' + className}>
    {loading && loadingElement}
    {error && errorElement(error)}
    {!loading && data && displayData(data)}
  </div>;
}
