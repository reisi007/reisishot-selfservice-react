import React, {useCallback} from 'react';
import {SearchablePerson, useKnownPersons} from './contract.api';
import {useAdminLogin} from '../AdminLoginContextProvider';
import {LoginData} from '../login/login.api';
import {LoadingIndicator} from '../../LoadingIndicator';
import {Loadable} from '../../components/Loadable';
import {FormattedDate} from '../../utils/Age';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {FormInput} from '../../form/FormikFields';

type Props = { onPersonSelected: (p: SearchablePerson) => void }
type SearchProps = Props & { search: string }

export function KnownPersonChooser({onPersonSelected}: Props) {
  const {t} = useTranslation();
  const [loginData] = useAdminLogin();
  return <Formik initialValues={{search: ''}} onSubmit={() => {
  }}>
    {formik => {
      const search = formik.values.search;
      return <div className="px-2 mx-2 rounded-xl border">
        <div className="block mx-auto w-11/12 sm:w-1/2">
          <span className="flex justify-center">
            <FormInput name="search" label={t('admin.contract.filterPerson')}/>
            <>
              {!!search && <button onClick={() => formik.resetForm()}
                                   className="relative top-8 right-9 py-1 px-2.5 m-0 bg-gray-300 rounded-full border-0 opacity-30 hover:opacity-50"> X
              </button>
              }
            </>
          </span>
        </div>
        {loginData !== undefined &&
         <KnownPersonDisplayChooser search={search} onPersonSelected={onPersonSelected} loginData={loginData}/>
        }
      </div>;
    }
    }
  </Formik>;
}

function KnownPersonDisplayChooser({onPersonSelected, loginData, search}: SearchProps & { loginData: LoginData }) {
  const result = useKnownPersons(loginData);
  return <Loadable result={result} loadingElement={<LoadingIndicator height="20rem"/>} displayData={
    data => <div className="grid grid-cols-2 gap-4 m-4">{
      data
        .filter(p => !search || p.search.indexOf(search) >= 0)
        .map(person => <ClickablePerson key={person.search} person={person}
                                        onPersonSelected={onPersonSelected}/>)}</div>
  }/>;
}

function ClickablePerson({person, onPersonSelected}: Props & { person: SearchablePerson }) {
  const onClick = useCallback(() => onPersonSelected(person), [onPersonSelected, person]);
  return <button onClick={onClick} className="p-2 break-words rounded-xl border">
    {person.firstName} {person.lastName} <br/>
    <span className="text-sm">{person.email}</span><br/>
    <FormattedDate dateString={person.birthday}/>
  </button>;
}
