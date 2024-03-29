import { RawAxiosRequestHeaders } from 'axios';
import useAxios, { Options } from 'axios-hooks';
import { useMemo } from 'react';
import { HOST } from './env';

type Params = { url: string, headers?: RawAxiosRequestHeaders, urlParams?: { [key: string]: string }, options?: Options };

export function useFetch<Response, Request = unknown, Error = unknown>({
  url,
  headers,
  urlParams = {},
  options,
}: Params) {
  const finalUrl = useMemo(() => {
    const params = new URLSearchParams(urlParams)?.toString();
    if (params) {
      return `${url}?${params}`;
    }

    return url;
  }, [url, urlParams]);
  return useAxios<Response, Request, Error>({
    headers,
    baseURL: HOST,
    url: finalUrl,
  }, options);
}

export function useManualFetch<Response, Request = unknown, Error = unknown>(params: Params) {
  const finalParams = {
    ...params,
    options: { manual: true, ...params.options },
  };
  return useFetch<Response, Request, Error>(finalParams);
}
