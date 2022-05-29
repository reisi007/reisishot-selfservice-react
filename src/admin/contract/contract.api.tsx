import {useFetch} from '../../http';
import {LoginData} from '../login/login.api';
import {Person} from '../../types/Person';
import {createHeader} from '../admin.api';
import {useMemo} from 'react';
import {formatDate} from '../../utils/Age';
import {ResponseValues} from 'axios-hooks';

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
