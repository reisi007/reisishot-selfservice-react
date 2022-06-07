import { AxiosRequestHeaders } from 'axios';
import useAxios, { Options } from 'axios-hooks';
import { useMemo } from 'react';
import { HOST } from './env';

type Params = { url: string, headers?: AxiosRequestHeaders, urlParams?: { [key: string]: string }, options?: Options };

function useFetch<Response, Request = unknown, Error = unknown>({
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

export const useFetchGet = useFetch;

export function useFetchPost<Response, Request = unknown, Error = unknown>(oldPrams: Params) {
  const params = {
    ...oldPrams,
    options: { manual: true, ...oldPrams.options },
  };
  return useFetch<Response, Request, Error>(params);
}
