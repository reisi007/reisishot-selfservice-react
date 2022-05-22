import {AxiosRequestHeaders} from 'axios';
import {HOST} from './env';
import useAxios, {Options} from 'axios-hooks';


export function useFetch<Response, Request = unknown, Error = unknown>(relativeUrl: string, headers?: AxiosRequestHeaders, options?: Options) {
  return useAxios<Response, Request, Error>({
    headers: headers,
    baseURL: HOST,
    url: relativeUrl,
  }, options);
}
