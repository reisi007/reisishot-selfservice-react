import { useMemo } from 'react';
import { ResponseValues } from 'axios-hooks';
import { Person } from '../../types/Person';
import { createHeader, usePutWithAuthentication } from '../admin.api';
import { formatDate } from '../../utils/Age';
import { LoginData } from '../login/LoginData';
import { useFetchGet, useFetchPost } from '../../http';

export type SearchablePerson = Person & { search: string };

export function useKnownPersons(loginData: LoginData): [ResponseValues<SearchablePerson[], unknown, unknown>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetchGet<Array<Person>>({
    url: 'api/contract-people_get.php',
    headers: createHeader(loginData),
  });

  const data: Array<SearchablePerson> | undefined = useMemo(() => rawData?.map((p) => ({
    ...p,
    search: `${p.firstName?.toLowerCase()} ${p.lastName.toLowerCase()} ${p.email.toLowerCase()} ${formatDate(p.birthday)}`,
  })), [rawData]);

  return [{
    data,
    loading,
    error,
  }];
}

export function useContractFilenames(): [ResponseValues<Array<{ key: string, displayName: string }>, unknown, unknown>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetchGet<Array<string>>({
    url: 'api/contract-templates_get.php',
  });

  const data = useMemo(() => {
    if (rawData === undefined) {
      return undefined;
    }
    return rawData.map((s) => ({
      key: s,
      displayName: capitalizeFirstLetter(s.substring(0, s.indexOf('.'))),
    }));
  }, [rawData]);

  return [{
    data,
    loading,
    error,
  }];
}

function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function useCreateContract() {
  const [request, rawPut] = useFetchPost<unknown, CreateContract>({
    url: '/api/contract_put.php',
    options: { manual: true },
  });
  const put = usePutWithAuthentication(rawPut);
  return [request, put] as const;
}

export type CreateContract = {
  persons: Array<Person>;
  contractType: string;
  text: string;
  dueDate: string;
  baseUrl: string;
};
