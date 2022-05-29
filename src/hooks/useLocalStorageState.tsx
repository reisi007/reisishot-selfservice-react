import {useCallback, useState} from 'react';

// Baseed on https://www.30secondsofcode.org/react/s/use-local-storage
export function useLocalStorage<T>(keyName: string, defaultValue: T | undefined = undefined) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if(value) {
        return JSON.parse(value);
      }
      else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch(err) {
      return defaultValue;
    }
  });

  const setValue = useCallback((newValue: T | undefined) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch(err) {
    }
    setStoredValue(newValue);
  }, [keyName]);

  return [storedValue, setValue];
}
