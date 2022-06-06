import React, { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { ResponseValues } from 'axios-hooks';

export type LoadableRequest<TResponse, TRequest, TError> = Pick<ResponseValues<TResponse, TRequest, TError>, 'data' | 'loading' | 'error'>;

type Props<TResponse, TRequest, TError> = {
  request: [LoadableRequest<TResponse, TRequest, TError>, ...unknown[]],
  loadingElement: ReactNode,
  errorElement?: (error: AxiosError<TError, TRequest>) => ReactNode,
  children?: (data: TResponse) => ReactNode,
  className?: string
};

export function DefaultErrorElement({
  error,
  className = '',
}: {
  error: AxiosError<unknown, unknown>
  className?: string
}) {
  return (
    <span
      className={`text-red-500 opacity-80 ${className}`}
    >
      {`${error.code} ${error.message}`}
    </span>
  );
}

export function Loadable<TResponse, TRequest, TError>({
  request,
  loadingElement,
  errorElement = (e) => <DefaultErrorElement error={e} />,
  children,
  className = '',
}: Props<TResponse, TRequest, TError>) {
  const [{
    data,
    loading,
    error,
  }] = request;

  return (
    <div className={`flex flex-col ${className}`}>
      {loading && loadingElement}
      {error && errorElement(error)}
      {!loading && data && children !== undefined && children(data)}
    </div>
  );
}
