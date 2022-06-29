import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { SearchablePerson, useKnownPersons } from './contract.api';
import { useAdminLogin } from '../AdminLoginContextProvider';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Loadable } from '../../components/Loadable';
import { FormattedDate } from '../../utils/Age';
import { LoginDataProps } from '../../utils/LoginData';
import { StyledButton } from '../../components/StyledButton';
import { FormikResetButton } from '../../form/FormikResetButton';

type Props = { onPersonSelected: (p: SearchablePerson) => void };
type SearchProps = Props & { search: string };

export function KnownPersonChooser({ onPersonSelected }: Props) {
  const { t } = useTranslation();
  const [loginData] = useAdminLogin();
  return (
    <Formik
      initialValues={{ search: '' }}
      onSubmit={() => {
        throw new Error('This form should never be submitted');
      }}
    >
      {(formik) => {
        const { search } = formik.values;
        return (
          <div className="px-2 mx-2 rounded-xl border">
            <FormikResetButton value={search} label={t('admin.contract.filterPerson')} resetOnClick={() => formik.resetForm()} />
            {loginData !== undefined
             && <KnownPersonDisplayChooser search={search.toLowerCase()} onPersonSelected={onPersonSelected} loginData={loginData} />}
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
  const [{
    data,
    loading,
    error,
  }] = useKnownPersons(loginData);
  return (
    <Loadable
      data={data}
      loading={loading}
      error={error}
      loadingElement={<LoadingIndicator height="20rem" />}
    >
      {(response) => (
        <div className="grid grid-cols-2 gap-4 m-4">
          {
            response
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
      )}
    </Loadable>
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
