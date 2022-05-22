import {useLocalStorage} from '../hooks/useLocalStorageState';
import {LoginData} from './admin.api';

export function useAdminLogin() {
  return useLocalStorage<LoginData>('adminLogin');
}
