import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { TabProps } from '../../components/TabGroup';
import { LoginData } from '../../utils/LoginData';
import { SearchableSupportPerson, useAdminWaitlistLinks } from '../waitlist/waitlist.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { CalculatedBirthday, FormattedDate } from '../../utils/Age';
import { StyledCopyLinkButton } from '../../components/StyledCopyLinkButton';
import { FormikResetButton } from '../../form/FormikResetButton';

export function WaitlistLinkTab({
  data: loginData,
}: TabProps<LoginData>) {
  const [request] = useAdminWaitlistLinks(loginData);
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('admin.waitlist.support.tabs.waitlist-links.title')}</h2>
      <Formik
        initialValues={{ search: '' }}
        onSubmit={() => {
          throw new Error('This form should never be submitted');
        }}
      >
        {(formik) => {
          const { search } = formik.values;
          return (
            <div className="px-2 mx-2">
              <FormikResetButton className="my-2" value={search} label={t('admin.contract.filterPerson')} resetOnClick={() => formik.resetForm()} />
              <Loadable {...request} loadingElement={<LoadingIndicator />}>
                {(result) => <DisplayResults result={result} searchString={search.toLowerCase()} />}
              </Loadable>
            </div>
          );
        }}
      </Formik>

    </>
  );
}

function DisplayResults({
  result: rawResult,
  searchString,
}: { result: SearchableSupportPerson[], searchString: string }) {
  const result = useMemo(() => rawResult.filter((e) => e.search.includes(searchString)), [rawResult, searchString]);
  return (
    <div className="grid gap-2 m-2 md:grid-cols-2">
      {result.map(({
        email,
        firstName,
        lastName,
        birthday,
        url,
      }) => (
        <StyledCopyLinkButton
          key={url}
          href={url}
        >
          <p>
            {firstName}
            {' '}
            {lastName}
            <br />
            {email}
          </p>
          <FormattedDate dateString={birthday} />

          {' ('}
          <CalculatedBirthday dateString={birthday} />
          )
        </StyledCopyLinkButton>
      ))}
    </div>
  );
}
