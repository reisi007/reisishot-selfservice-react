import { useCallback } from 'react';
import { useFetch } from '../../http';
import { createHeader } from '../admin.api';

export type LoginFormData = { user: string, pwd: string };
export type LoginResponse = { user: string, hash: string };

export function useLoginUser() {
  const [{
    error,
    loading,
  }, rawPut] = useFetch<LoginResponse>({
    url: '/api/admin_login_post.php',
    options: { manual: true },
  });
  const put = useCallback(({
    user,
    pwd,
  }: LoginFormData) => rawPut({
    headers: createHeader({
      user,
      auth: pwd,
    }),
    method: 'put',
  }), [rawPut]);
  return [{
    error,
    loading,
    data: undefined,
  }, put] as const;
}
