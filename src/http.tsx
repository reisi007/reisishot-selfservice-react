import {AxiosRequestHeaders} from 'axios';
import {HOST} from './env';
import useAxios, {Options} from 'axios-hooks';
import {useMemo} from 'react';

type Params = { url: string, headers?: AxiosRequestHeaders, urlParams?: { [key: string]: string }, options?: Options }

export function useFetch<Response, Request = unknown, Error = unknown>({
                                                                         url,
                                                                         headers,
                                                                         urlParams = {},
                                                                         options,
                                                                       }: Params) {
  const finalUrl = useMemo(() => {
    const params = new URLSearchParams(urlParams)?.toString();
    if(params) {
      return `${url}?${params}`;
    }
    else {
      return url;
    }
  }, [url, urlParams]);
  return useAxios<Response, Request, Error>({
    headers: headers,
    baseURL: HOST,
    url: finalUrl,
  }, options);
}
