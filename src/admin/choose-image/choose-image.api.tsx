import { ResponseValues } from 'axios-hooks';
import { useMemo } from 'react';
import { LoginData } from '../../utils/LoginData';
import { useFetch, useManualFetch } from '../../http';
import { createHeader, usePostWithAuthentication } from '../../utils/http.authed';
import { PdoEmulatedPrepared } from '../../types/PdoEmulatedPrepared';
import { LoadableRequest } from '../../components/Loadable';
import { PersonWithId } from '../../types/Person';

export type ChooseImageMetadata = {
  filename: string,
  width: number,
  height: number
};

export type ChooserPerson = { id: number, email: string, firstName: string, lastName: string, birthday: string };
export type FolderInformation = { name: string, cnt: number, access: Array<ChooserPerson> };

export function useFolderNames(loginData: LoginData): ResponseValues<Array<FolderInformation>, unknown, unknown> {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<FolderInformation>>>({
    url: 'api/waitlist-admin-choose_overview_get.php',
    headers: createHeader(loginData),
  });
  const data: Array<FolderInformation> | undefined = useMemo(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return rawData.map((e): FolderInformation => ({
      ...e,
      access: e.access.map((p) => ({
        ...p,
        id: parseInt(p.id, 10),
      })),
      cnt: parseInt(e.cnt, 10),
    }));
  }, [rawData]);
  return {
    data,
    loading,
    error,
  };
}

export function useWaitlistPersons(loginData: LoginData): [LoadableRequest<Array<PersonWithId>>] {
  const [{
    data: rawData,
    loading,
    error,
  }] = useFetch<PdoEmulatedPrepared<Array<PersonWithId>>>({
    url: 'api/waitlist-persons_get.php',
    headers: createHeader(loginData),
  });

  const data = useMemo(() => rawData?.map((e) => ({
    ...e,
    id: parseInt(e.id, 10),
  })), [rawData]);

  return [{
    data,
    loading,
    error,
  }];
}

type ManagePictureChooserAccess = { personId: number, folder: string };

export function useAddPersonToChooseImage() {
  const [request, rawPost] = useManualFetch<unknown, ManagePictureChooserAccess>({ url: 'api/waitlist-admin-choose_add_person_post.php' });
  const post = usePostWithAuthentication(rawPost);
  return [request, post] as const;
}

export function useRemovePersonToChooseImage() {
  const [request, rawPost] = useManualFetch<unknown, ManagePictureChooserAccess>({ url: 'api/waitlist-admin-choose_remove_person_post.php' });
  const post = usePostWithAuthentication(rawPost);
  return [request, post] as const;
}
