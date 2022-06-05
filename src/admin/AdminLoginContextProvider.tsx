import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorageState';
import { LoginData } from './login/LoginData';

function usePersistedAdminLogin() {
  return useLocalStorage<LoginData>('adminLogin');
}

type AdminLoginContextType = ReturnType<typeof usePersistedAdminLogin>;
const AdminLoginContext = createContext<AdminLoginContextType>(
  [
    undefined,
    () => {
    },
  ],
);

export function AdminLoginContextProvider({ children }: { children: JSX.Element }) {
  const [state, setState] = usePersistedAdminLogin();

  const contextState: AdminLoginContextType = useMemo(() => [state, setState], [setState, state]);

  return (
    <AdminLoginContext.Provider value={contextState}>
      {children}
    </AdminLoginContext.Provider>
  );
}

export function useAdminLogin() {
  return useContext(AdminLoginContext);
}
