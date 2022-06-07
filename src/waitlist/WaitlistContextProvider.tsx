import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorageState';
import { LoginData } from '../utils/LoginData';

function usePersistedWaitlistLogin() {
  return useLocalStorage<LoginData>('waitlist');
}

type WaitlistLoginContextType = ReturnType<typeof usePersistedWaitlistLogin>;
const WaitlistLoginContext = createContext<WaitlistLoginContextType>(
  [
    undefined,
    () => {
    },
  ],
);

export function WaitlistLoginContextProvider({ children }: { children: JSX.Element }) {
  const [state, setState] = usePersistedWaitlistLogin();

  const contextState: WaitlistLoginContextType = useMemo(() => [state, setState], [setState, state]);

  return (
    <WaitlistLoginContext.Provider value={contextState}>
      {children}
    </WaitlistLoginContext.Provider>
  );
}

export function useWaitlistLogin() {
  return useContext(WaitlistLoginContext);
}
