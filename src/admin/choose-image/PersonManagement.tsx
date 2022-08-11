import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginData } from '../../utils/LoginData';
import {
  ChooserPerson, useAddPersonToChooseImage, useRemovePersonToChooseImage, useWaitlistPersons,
} from './choose-image.api';
import { Person, PersonWithId } from '../../types/Person';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { RequestActionButton } from '../waitlist/ActionButton';
import { CalculatedBirthday } from '../../utils/Age';

export function PersonManagement({
  loginData,
  folder,
  person,
}: { loginData: LoginData, person: Array<ChooserPerson>, folder: string }) {
  const [curPersons, setCurPersons] = useState<Array<ChooserPerson>>(person);
  const curPersonsEmails = useMemo(() => curPersons.map(({ email }) => email), [curPersons]);
  const onAddClick = useCallback((p: PersonWithId) => {
    setCurPersons((old) => [...old, p]);
  }, []);
  const onRemoveClick = useCallback((p: PersonWithId) => {
    setCurPersons((old) => old.filter((op) => op.email !== p.email));
  }, []);
  return (
    <>
      <div className="flex flex-wrap justify-evenly">
        {curPersons.map((p) => <RemovePersonButton key={p.id} {...p} {...loginData} folder={folder} onClick={onRemoveClick} />)}
      </div>
      <AddPerson
        onClick={onAddClick}
        loginData={loginData}
        folder={folder}
        excludedMails={curPersonsEmails}
      />
    </>
  );
}

function AddPerson({
  loginData,
  folder,
  excludedMails,
  onClick,
}: { loginData: LoginData, folder: string, excludedMails: Array<String>, onClick: (p: PersonWithId) => void }) {
  const { t } = useTranslation();
  const [{
    data: rawData,
    loading,
    error,
  }] = useWaitlistPersons(loginData);
  const data = useMemo(() => rawData?.filter(({ email }) => excludedMails.indexOf(email) === -1), [excludedMails, rawData]);
  return (
    <div>
      <h3 className="text-2xl">{t('admin.choose_images.add_person')}</h3>
      <Loadable<Array<PersonWithId>, unknown, unknown> data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
        {(result) => (
          <div className="flex flex-wrap justify-evenly">
            {result.map(({
              id,
              firstName,
              lastName,
              email,
              birthday,
            }) => (
              <AddPersonButton
                {...loginData}
                id={id}
                key={email}
                firstName={firstName}
                lastName={lastName}
                email={email}
                birthday={birthday}
                folder={folder}
                onClick={onClick}
              />
            ))}
          </div>
        )}
      </Loadable>
    </div>
  );
}

function RemovePersonButton({
  id,
  email,
  firstName,
  lastName,
  birthday,
  folder,
  onClick: callback,
  user,
  auth,
}: PersonWithId & LoginData & { folder: string, onClick: (p: PersonWithId) => void }) {
  const [request, post] = useRemovePersonToChooseImage();
  const onClick = useCallback(() => {
    post({
      personId: id,
      folder,
    }, {
      user,
      auth,
    })
      .then(() => {
        callback({
          id,
          email,
          firstName,
          lastName,
          birthday,
        });
      });
  }, [auth, birthday, callback, email, firstName, folder, id, lastName, post, user]);
  return (
    <div className="py-1 px-2 md:w-1/2">
      <RequestActionButton
        {...request}
        className="my-2 mx-4 w-full !font-medium text-red-500"
        onClick={onClick}
        type="button"
      >
        {firstName}
        {' '}
        {lastName}
        {' '}
        -
        {' '}
        {email}
        {' '}
        <CalculatedBirthday dateString={birthday} />
      </RequestActionButton>
    </div>
  );
}

function AddPersonButton({
  id,
  email,
  firstName,
  lastName,
  birthday,
  user,
  auth,
  folder,
  onClick: callback,

}: Person & LoginData & { folder: string, id: number, onClick: (p: PersonWithId) => void }) {
  const [request, post] = useAddPersonToChooseImage();
  const onClick = useCallback(() => {
    post({
      personId: id,
      folder,
    }, {
      user,
      auth,
    })
      .then(() => {
        callback({
          id,
          email,
          firstName,
          lastName,
          birthday,
        });
      });
  }, [auth, birthday, callback, email, firstName, folder, id, lastName, post, user]);
  return (
    <div className="py-1 px-2 md:w-1/2">
      <RequestActionButton
        {...request}
        onClick={onClick}
        className="my-2 mx-4 w-full  !font-medium text-reisishot"
        type="button"
      >
        {' '}
        {firstName}
        {' '}
        {lastName}
        {' '}
        -
        {' '}
        {email}
        {' '}
        <CalculatedBirthday dateString={birthday} />
        {' '}
      </RequestActionButton>
    </div>
  );
}
