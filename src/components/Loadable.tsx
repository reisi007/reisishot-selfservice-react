import React, {ReactNode} from 'react';
import {AxiosError} from 'axios';
import {ResponseValues} from 'axios-hooks';

type Props<TResponse, TRequest, TError> = {
  result: [ResponseValues<TResponse, TRequest, TError>, ...unknown[]],
  loadingElement: ReactNode,
  errorElement?: (error: AxiosError<TError, TRequest>) => ReactNode,
  displayData: (data: TResponse) => ReactNode,
  className?: string
}

export function DefaultErrorElement({error, className = ''}: {
  error: AxiosError<unknown, unknown>
  className?: string
}) {
  return <span
    className={`text-red-500 opacity-80 ${className}`}>{`${error.code} ${error.message}`}</span>;
}

export function Loadable<TResponse, TRequest, TError>({
                                                        result,
                                                        loadingElement,
                                                        errorElement = (e) => <DefaultErrorElement error={e}/>,
                                                        displayData,
                                                        className = '',
                                                      }: Props<TResponse, TRequest, TError>) {
  const [{data, loading, error}] = result;

  return <div className={'flex flex-col ' + className}>
    {loading && loadingElement}
    {error && errorElement(error)}
    {!loading && data && displayData(data)}
  </div>;
}
