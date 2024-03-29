import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldArray, Formik } from 'formik';
import { FormikHelpers, FormikProps } from 'formik/dist/types';
import { array as validateArray, object as validateObject } from 'yup';
import dayjs from 'dayjs';
import { ResponseValues } from 'axios-hooks';
import { useLocation } from 'react-router-dom';
import { KnownPersonChooser } from './KnownPersonChooser';
import { FormInput, FormSelect, FormTextArea } from '../../form/FormikFields';
import { Person } from '../../types/Person';
import { SubmitButton } from '../../components/SubmitButton';
import { requiredString, validateDateString } from '../../yupHelper';
import { CreateContract, useContractFilenames, useCreateContract } from './contract.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { LoginDataProps } from '../../utils/LoginData';
import Markdown from '../../utils/markdown/Markdown';
import { Card } from '../../components/Card';
import { formatJson } from '../../utils/json';
import { StyledButton } from '../../components/StyledButton';

export function CreateContractForm({ loginData }: LoginDataProps) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }, submitContract] = useCreateContract();

  const onSubmit: (values: CreateContract, formikHelpers: FormikHelpers<CreateContract>) => void | Promise<any> = useCallback(async (values, {
    setSubmitting,
    resetForm,
  }) => {
    if (!loginData) {
      setSubmitting(false);
      return;
    }

    submitContract(values, loginData)
      .then(resetForm)
      .then(() => setSubmitting(false));
  }, [loginData, submitContract]);

  const locationPerson = useLocation().state as (Person | undefined);

  return (
    <div className="py-2 mx-auto w-full rounded-lg border border-gray-200 md:w-1/2">
      <h3 className="mb-2">{t('admin.contract.storedPersons')}</h3>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          contractType: '',
          dueDate: '',
          persons: [locationPerson ?? createPerson()],
          text: '',
          baseUrl: `${window.location.protocol}//${window.location.host}`,
        }}
        validationSchema={validateObject({
          contractType: requiredString(),
          text: requiredString(),
          dueDate: validateDateString()
            .required(t('form.errors.required'))
            .min(new Date(), t('form.errors.date.requireFutureDate')),
          persons: validateArray()
            .of(
              validateObject({
                firstName: requiredString(),
                lastName: requiredString(),
                email: requiredString()
                  .email(t('form.errors.email')),
                birthday: validateDateString()
                  .required(t('form.errors.required'))
                  .max(dayjs()
                    .add(-1, 'y')
                    .toDate(), t('form.errors.date.requirePastDate')),
              }),
            )
            .min(2),
        })}
      >
        {(props) => (
          <>
            <CreateContractFormContent {...props} data={data} loading={loading} error={error} />
            {!!props.errors && <pre>{formatJson(props.errors)}</pre>}
          </>
        )}
      </Formik>
    </div>
  );
}

type CreateContractFormikProps =
  FormikProps<CreateContract>
  & ResponseValues<unknown, unknown, unknown>;

function CreateContractFormContent(formik: CreateContractFormikProps) {
  const {
    data,
    loading,
    error,
    values,
    setFieldValue,
  } = formik;

  const {
    persons,
    text,
  } = values;
  const { t } = useTranslation();
  const [{
    data: contractData,
    loading: contractLoading,
    error: contractError,
  }] = useContractFilenames();

  const [eur, setEur] = useState(25);

  return (
    <div className="px-4">
      <FieldArray name="persons">
        {(arrayHelper) => (
          <>
            {persons.map((_, idx) => (
              <PersonForm
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                formFieldPrefix="persons"
                idx={idx}
              />
            ))}
            <KnownPersonChooser onPersonSelected={(p) => arrayHelper.insert(0, p)} />
            <div className="flex justify-around m-4 mx-auto w-full md:w-1/3">
              <StyledButton
                onClick={() => {
                  arrayHelper.push(createPerson());
                }}
                className="p-4 w-14 text-center bg-reisishot rounded-xl"
              >
                +
              </StyledButton>
              <StyledButton
                onClick={() => {
                  if (values.persons.length > 1) {
                    arrayHelper.pop();
                  }
                }}
                disabled={values.persons.length <= 1}
                className="p-4 w-14 text-center bg-red-500 rounded-xl"
              >
                -
              </StyledButton>
            </div>
          </>
        )}
      </FieldArray>

      <Loadable
        data={contractData}
        loading={contractLoading}
        error={contractError}
        loadingElement={<LoadingIndicator height="2rem" />}
      >
        {(response) => (
          <FormSelect
            options={response}
            className="w-full"
            label={t('admin.contract.selectContract')}
            required
            name="contractType"
            disabledOption={t('admin.contract.selectContract')}
          />
        )}
      </Loadable>

      <FormInput
        className="w-full"
        label={t('admin.contract.dueDate')}
        required
        name="dueDate"
        type="datetime-local"
      />

      <div className="flex my-2">
        <FormInput step="0.01" value={eur} onChange={(e) => setEur(Number(e.currentTarget.value))} name="eur" label="Mindestwert" type="number" />
        <StyledButton onClick={() => {
          setFieldValue('text', `## Kosten\nAls Entgelt wird "Pay what you want" mit einem Mindestbeitrag von ${eur.toLocaleString('de')}€ vereinbart.\n${values.text}`);
        }}
        >
          Einfügen
        </StyledButton>
      </div>

      <FormTextArea name="text" required label={t('admin.contract.additionalText')} />
      {!!text && (
        <Card className="my-4">
          <Markdown className="text-center" content={text} />
        </Card>
      )}
      <div className="mx-4">
        <SubmitButton data={data} loading={loading} error={error} formik={formik} />
      </div>
    </div>
  );
}

function PersonForm({
  formFieldPrefix,
  idx,
}: { formFieldPrefix: string, idx: number }) {
  const { t } = useTranslation();
  const baseName = `${formFieldPrefix}.${idx}`;
  return (
    <div className="py-4">
      <h3 className="mb-1">
        {idx + 1}
        . Person
      </h3>
      <div className="flex space-x-2">
        <FormInput
          className="w-1/2"
          label={t('person.firstname')}
          name={`${baseName}.firstName`}
          required
        />
        <FormInput
          className="w-1/2"
          label={t('person.lastname')}
          name={`${baseName}.lastName`}
          required
        />
      </div>
      <div>
        <FormInput
          className="w-full"
          label={t('person.email')}
          name={`${baseName}.email`}
          required
          type="email"
        />
      </div>
      <div>
        <FormInput
          className="w-full"
          data-date-placeholder={t('person.birthday.placeholder.supported')}
          placeholder={t('person.birthday.placeholder.unsupported')}
          label={t('person.birthday.title')}
          name={`${baseName}.birthday`}
          required
          type="date"
        />
      </div>
    </div>
  );
}

function createPerson(): Person {
  return {
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
  };
}
