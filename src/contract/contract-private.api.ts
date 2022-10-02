import { useMemo } from 'react';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { RefetchOptions } from 'axios-hooks';
import { LoginData } from '../utils/LoginData';
import { useFetch, useManualFetch } from '../http';
import { PdoEmulatedPrepared } from '../types/PdoEmulatedPrepared';
import { LoadableRequest } from '../components/Loadable';
import { createHeader, usePut } from '../utils/http.authed';

export function useGetContractData(loginData: LoginData): [LoadableRequest<ContractData>, ...unknown[]] {
  return useFetch<PdoEmulatedPrepared<ContractData>>({
    url: 'api/contract_get.php',
    headers: createHeader(loginData),
  });
}

export function useGetLogEntries(loginData: LoginData): [LoadableRequest<Array<LogEntry>>, (config?: AxiosRequestConfig<unknown>, options?: RefetchOptions) => AxiosPromise<unknown>] {
  const [{
    data: rawData,
    loading,
    error,
  }, get] = useFetch<PdoEmulatedPrepared<Array<LogEntry>>>({
    url: 'api/contract-log_get.php',
    headers: createHeader(loginData),
  });

  const data = useMemo(() => {
    if (rawData === undefined) return undefined;
    return rawData.map((e): LogEntry => ({
      ...e,
      log_type: e.log_type as LogType,
    }));
  }, [rawData]);

  return [{
    data,
    loading,
    error,
  }, get];
}

type PutLogEntryBody = { action: LogType, baseUrl: string };

export function usePutLogEntry(loginData: LoginData): [LoadableRequest<unknown>, (body: PutLogEntryBody) => AxiosPromise<unknown>] {
  const [request, rawPut] = useManualFetch<unknown, PutLogEntryBody>({
    url: 'api/contract-log_put.php',
    headers: createHeader(loginData),
  });
  const put = usePut(rawPut);
  return [request, put];
}

export type ContractData = {
  access_key: string,
  email: string,
  firstname: string,
  lastname: string,
  birthday: string,
  markdown: string,
  dsgvo_markdown?: string,
  hash_algo: string,
  hash_value: string,
  due_date: string
};

export type LogEntry = {
  email: string,
  timestamp: string,
  log_type: LogType,
  hash_value: string
};

export type LogType = 'OPEN' | 'SIGN';
