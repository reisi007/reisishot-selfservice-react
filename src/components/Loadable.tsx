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

export function DefaultErrorElement({error, className = ''}: {
  error: AxiosError<unknown, unknown>
  className?: string
}) {
  return <span
    className={`text-red-500 opacity-80 ${className}`}>{`${error.code} ${error.message}`}</span>;
}

export function Loadable<TResponse>({
                                      result,
                                      loadingElement,
                                      errorElement = (e) => <DefaultErrorElement error={e}/>,
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
