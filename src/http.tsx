import {AxiosRequestHeaders} from 'axios';
import {HOST} from './env';
import useAxios from 'axios-hooks';


export function useFetch<Response, Request = unknown, Error = unknown>(relativeUrl: string, headers?: AxiosRequestHeaders) {
  return useAxios<Response, Request, Error>({
    headers: headers,
    baseURL: HOST,
    url: relativeUrl,
  });
}
