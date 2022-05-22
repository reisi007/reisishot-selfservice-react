import {useCallback, useMemo} from 'react';


export function useLocalStorage<T>(name: string): [T | undefined, (i: T | undefined) => void] {
  const fromStorage = localStorage.getItem(name);
  const state = useMemo(() => {
    if(!fromStorage) {
      return undefined;
    }
    return JSON.parse(fromStorage) as T;
  }, [fromStorage]);

  const setState = useCallback((i: T | undefined) => {
    if(i === undefined) {
      localStorage.removeItem(name);
    }
    else {
      localStorage.setItem(name, JSON.stringify(i));
    }
  }, [name]);

  return [state, setState];
}
