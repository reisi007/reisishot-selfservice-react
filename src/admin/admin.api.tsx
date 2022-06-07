import { AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { RefetchOptions } from 'axios-hooks';
import { useCallback } from 'react';
import { LoginData } from './login/LoginData';

export function createHeader(loginData?: LoginData, moreHeaders?: AxiosRequestHeaders): AxiosRequestHeaders {
  if (loginData !== undefined) {
    return {
      Email: loginData.user,
      Accesskey: loginData.auth,
      ...moreHeaders,
    };
  }

  return moreHeaders ?? {};
}

export function usePutWithAuthentication<Request, Response>(
  rawPut: (config?: AxiosRequestConfig<Request>, options?: RefetchOptions) => AxiosPromise<Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useCallback((body: Request, {
    user,
    auth,
  }: LoginData) => rawPut({
    headers: createHeader({
      user,
      auth,
    }),
    method: 'put',
    data: body,
    ...config,
  }, options), [config, options, rawPut]);
}

export function usePut<Request, Response>(
  rawPut: (config?: AxiosRequestConfig<Request>, options?: RefetchOptions) => AxiosPromise<Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useCallback((body: Request) => rawPut({
    method: 'put',
    data: body,
    ...config,
  }, options), [config, options, rawPut]);
}
