import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { SearchablePerson, useKnownPersons } from './contract.api';
import { useAdminLogin } from '../AdminLoginContextProvider';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Loadable } from '../../components/Loadable';
import { FormattedDate } from '../../utils/Age';
import { FormInput } from '../../form/FormikFields';
import { LoginDataProps } from '../login/LoginData';
import { StyledButton } from '../../components/StyledButton';

type Props = { onPersonSelected: (p: SearchablePerson) => void };
type SearchProps = Props & { search: string };

export function KnownPersonChooser({ onPersonSelected }: Props) {
  const { t } = useTranslation();
  const [loginData] = useAdminLogin();
  return (
    <Formik
      initialValues={{ search: '' }}
      onSubmit={() => {
      }}
    >
      {(formik) => {
        const { search } = formik.values;
        return (
          <div className="px-2 mx-2 rounded-xl border">
            <div className="block mx-auto w-11/12 sm:w-1/2">
              <span className="flex justify-center">
                <FormInput name="search" label={t('admin.contract.filterPerson')} />
                {!!search && (
                  <StyledButton
                    onClick={() => formik.resetForm()}
                    className="relative top-8 right-9 py-1 px-2.5 m-0 bg-gray-300 rounded-full border-0 opacity-30 hover:opacity-50"
                  >
                    {' '}
                    X
                    {' '}
                  </StyledButton>
                )}
              </span>
            </div>
            {loginData !== undefined
             && <KnownPersonDisplayChooser search={search} onPersonSelected={onPersonSelected} loginData={loginData} />}
          </div>
        );
      }}
    </Formik>
  );
}

function KnownPersonDisplayChooser({
  onPersonSelected,
  loginData,
  search,
}: SearchProps & LoginDataProps) {
  const result = useKnownPersons(loginData);
  const displayData = useCallback((data: SearchablePerson[]) => (
    <div className="grid grid-cols-2 gap-4 m-4">
      {
        data
          .filter((p) => !search || p.search.indexOf(search) >= 0)
          .map((person) => (
            <ClickablePerson
              key={person.search}
              person={person}
              onPersonSelected={onPersonSelected}
            />
          ))
      }
    </div>
  ), [onPersonSelected, search]);
  return (
    <Loadable
      result={result}
      loadingElement={<LoadingIndicator height="20rem" />}
      displayData={displayData}
    />
  );
}

function ClickablePerson({
  person,
  onPersonSelected,
}: Props & { person: SearchablePerson }) {
  const onClick = useCallback(() => onPersonSelected(person), [onPersonSelected, person]);
  return (
    <StyledButton onClick={onClick} className="p-2 break-words rounded-xl border">
      <>
        {person.firstName}
        {' '}
        {person.lastName}
        {' '}
        <br />
        <span className="text-sm">{person.email}</span>
        <br />
        <FormattedDate dateString={person.birthday} />
      </>
    </StyledButton>
  );
}
