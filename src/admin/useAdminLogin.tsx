import {useLocalStorage} from '../hooks/useLocalStorageState';
import {LoginData} from './login/login.api';

export function useAdminLogin() {
  return useLocalStorage<LoginData>('adminLogin');
}
