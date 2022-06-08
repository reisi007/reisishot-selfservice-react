import { LoginData } from '../utils/LoginData';
import { useFetch } from '../http';
import { PdoEmulatedPrepared } from '../types/PdoEmulatedPrepared';
import { LoadableRequest } from '../components/Loadable';
import { createHeader } from '../utils/http.authed';

export function useGetContractData(loginData: LoginData): [LoadableRequest<ContractData>, ...unknown[]] {
  return useFetch<PdoEmulatedPrepared<ContractData>>({
    url: 'api/contract_get.php',
    headers: createHeader(loginData),
  });
}

export interface ContractData {
  access_key: string;
  email: string;
  firstname: string;
  lastname: string;
  birthday: string;
  markdown: string;
  hash_algo: string;
  hash_value: string;
  due_date: string;
}
