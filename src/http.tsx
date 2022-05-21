import {useFetch} from 'use-http';
import {useEffect} from 'react';

type useFetchParams = Parameters<typeof useFetch>;

export function useGet<T>(url: string, options: useFetchParams[1], moreDeps: Array<unknown>) {
  const fetch = useFetch<T>('/api/shooting_dates_get.php', options, [url, ...moreDeps]);
  useEffect(() => {
    fetch.get();
  }, [fetch]);
  return fetch;
}
