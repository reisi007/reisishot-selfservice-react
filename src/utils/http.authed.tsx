import {
  AxiosPromise, AxiosRequestConfig, Method, RawAxiosRequestHeaders,
} from 'axios';
import { RefetchFunction, RefetchOptions } from 'axios-hooks';
import { useCallback } from 'react';
import { LoginData } from './LoginData';

export function createHeader(loginData?: LoginData): RawAxiosRequestHeaders {
  if (loginData !== undefined) {
    return {
      Email: loginData.user,
      Accesskey: loginData.auth,
    };
  }

  return {};
}

export function usePostWithAuthentication<Request, Response>(
  raw: RefetchFunction<Request, Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useMethodWithAuthentication('post', raw, config, options);
}

export function usePutWithAuthentication<Request, Response>(
  raw: RefetchFunction<Request, Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useMethodWithAuthentication('put', raw, config, options);
}

function useMethodWithAuthentication<Request, Response>(
  method: Method,
  raw: (config?: AxiosRequestConfig<Request>, options?: RefetchOptions) => AxiosPromise<Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useCallback((body: Request, {
    user,
    auth,
  }: LoginData) => raw({
    headers: createHeader({
      user,
      auth,
    }),
    method,
    data: body,
    ...config,
  }, options), [method, config, options, raw]);
}

export function usePut<Request, Response>(
  raw: RefetchFunction<Request, Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useMethod('put', raw, config, options);
}

export function usePost<Request, Response>(
  raw: RefetchFunction<Request, Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useMethod('post', raw, config, options);
}

function useMethod<Request, Response>(
  method: Method,
  raw: (config?: AxiosRequestConfig<Request>, options?: RefetchOptions) => AxiosPromise<Response>,
  config?: AxiosRequestConfig<Request>,
  options?: RefetchOptions,
) {
  return useCallback((body: Request) => raw({
    method,
    data: body,
    ...config,
  }, options), [method, config, options, raw]);
}
