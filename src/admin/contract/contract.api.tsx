import {useFetch} from '../../http';
import {Person} from '../../types/Person';
import {createHeader, usePut} from '../admin.api';
import {useMemo} from 'react';
import {formatDate} from '../../utils/Age';
import {ResponseValues} from 'axios-hooks';
import {CreateContract} from './CreateContractForm';
import {LoginData} from '../login/LoginData';

export type SearchablePerson = Person & { search: string };

export function useKnownPersons(loginData: LoginData): [ResponseValues<SearchablePerson[], unknown, unknown>] {
  const [{data: rawData, loading, error}] = useFetch<Array<Person>>({
    url: 'api/contract-people_get.php',
    headers: createHeader(loginData),
  });

  const data: Array<SearchablePerson> | undefined = useMemo(() => {
    return rawData?.map(p => {
      return ({
        ...p,
        search: p.firstName?.toLowerCase() + ' ' + p.lastName.toLowerCase() + ' ' + p.email.toLowerCase() + ' ' + formatDate(p.birthday),
      });
    });
  }, [rawData]);

  return [{data, loading, error}];
}

export function useContractFilenames(): [ResponseValues<Array<{ key: string, displayName: string }>, unknown, unknown>] {
  const [{data: rawData, loading, error}] = useFetch<Array<string>>({
    url: 'api/contract-templates_get.php',
  });

  const data = useMemo(() => {
    if(rawData === undefined) {
      return undefined;
    }
    return rawData.map(s => {
      return {key: s, displayName: capitalizeFirstLetter(s.substring(0, s.indexOf('.')))};
    });

  }, [rawData]);

  return [{data, loading, error}];
}

function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function useCreateContract() {
  const [{error, loading}, rawPut] = useFetch<unknown, CreateContract>({
    url: '/api/contract_put.php',
    options: {manual: true},
  });
  const put = usePut(rawPut);
  return [{error, loading, data: undefined}, put] as const;
}
