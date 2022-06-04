import {AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders} from 'axios';
import {LoginData} from './login/LoginData';
import {RefetchOptions} from 'axios-hooks';
import {useCallback} from 'react';


export function createHeader(loginData?: LoginData, moreHeaders?: AxiosRequestHeaders): AxiosRequestHeaders {
  if(loginData !== undefined) {
    return {Email: loginData.user, Accesskey: loginData.auth, ...moreHeaders};
  }
  else {
    return moreHeaders ?? {};
  }
}

export function usePut<Request, Response>(rawPut: (config?: AxiosRequestConfig<Request>, options?: RefetchOptions) => AxiosPromise<Response>) {
  return useCallback((body: Request, {user, auth}: LoginData) => {
    return rawPut({
      headers: createHeader({user, auth}),
      method: 'put',
      data: body,
    });
  }, [rawPut]);
}
