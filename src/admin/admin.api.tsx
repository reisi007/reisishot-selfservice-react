import {AxiosRequestHeaders} from 'axios';
import {LoginData} from './login/LoginData';


export function createHeader(loginData?: LoginData, moreHeaders?: AxiosRequestHeaders): AxiosRequestHeaders {
  if(loginData !== undefined) {
    return {Email: loginData.user, Accesskey: loginData.auth, ...moreHeaders};
  }
  else {
    return moreHeaders ?? {};
  }
}
