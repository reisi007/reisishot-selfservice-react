import { useCallback } from 'react';
import { createHeader } from '../../utils/http.authed';
import { useManualFetch } from '../../http';

export type LoginFormData = { user: string, pwd: string };
export type LoginResponse = { user: string, hash: string };

export function useLoginUser() {
  const [{
    error,
    loading,
  }, rawPut] = useManualFetch<LoginResponse>({
    url: '/api/admin_login_post.php',
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
