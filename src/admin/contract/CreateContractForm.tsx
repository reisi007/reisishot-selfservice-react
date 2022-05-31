import React, {useCallback} from 'react';
import {KnownPersonChooser} from './KnownPersonChooser';
import {useTranslation} from 'react-i18next';
import {FormInput, FormSelect} from '../../form/FormikFields';
import {Person} from '../../types/Person';
import {FieldArray, Formik} from 'formik';
import {FormikHelpers} from 'formik/dist/types';
import {SubmitButton} from '../../components/SubmitButton';
import {requiredString, validateDateString} from '../../yupHelper';
import {array as validateArray, object as validateObject} from 'yup';
import dayjs from 'dayjs';

export function CreateContractForm() {
  const {t} = useTranslation();

  const onSubmit: (values: CreateContract, formikHelpers: FormikHelpers<CreateContract>) => void | Promise<any> = useCallback(async (values, {setSubmitting}) => {
    console.log(values);
    setSubmitting(false);
  }, []);

  return <div className="py-2 mx-auto w-full rounded-lg border border-gray-200 md:w-1/2">
    <h3 className="mb-2">{t('admin.contract.storedPersons')}</h3>
    <Formik<CreateContract> onSubmit={onSubmit} initialValues={{
      contractType: '',
      dueDate: '',
      persons: [createPerson()],
      text: '',
    }}
                            validationSchema={validateObject({
                              contractType: requiredString(),
                              dueDate: validateDateString()
                                .required(t('form.errors.required'))
                                .min(new Date(), t('form.errors.date.requireFutureDate')),
                              persons: validateArray().of(
                                validateObject({
                                  firstName: requiredString(),
                                  lastName: requiredString(),
                                  email: requiredString().email(t('form.errors.email')),
                                  birthday: validateDateString()
                                    .required(t('form.errors.required'))
                                    .max(dayjs().add(-1, 'y').toDate(), t('form.errors.date.requirePastDate')),
                                }),
                              ).min(1),
                            })
                            }
    >
      {formik =>
        <div className="px-4">
          <FieldArray name="persons">
            {arrayHelper => <>
              {formik.values.persons.map((_, idx) => <PersonForm key={idx} formFieldPrefix="persons" idx={idx}/>)}
              <KnownPersonChooser onPersonSelected={p => arrayHelper.insert(0, p)}/>
              <div className="flex justify-around m-4 mx-auto w-full md:w-1/3">
                <button onClick={() => {
                  console.count('Add person');
                  arrayHelper.push(createPerson());
                }}
                        className="p-4 w-14 text-center bg-reisishot rounded-xl">+
                </button>
                <button onClick={() => {
                  if(formik.values.persons.length > 1) {
                    console.count('Remove person');
                    arrayHelper.pop();
                  }
                }}
                        disabled={formik.values.persons.length <= 1}
                        className="p-4 w-14 text-center bg-red-500 rounded-xl">-
                </button>
              </div>


            </>
            }
          </FieldArray>
          <div>
            <FormSelect options={[
              {key: 'Test 1', displayValue: 'Display data 1'},
              {key: 'Test 2', displayValue: 'Display data 2'},
            ]}

                        className="w-full" label={t('admin.contract.selectContract')} required
                        name="contractType" disabledOption={t('admin.contract.selectContract')}/>
          </div>
          <div>
            <FormInput className="w-full" label={t('admin.contract.dueDate')}
                       required name="dueDate" type="datetime-local"/>
          </div>
          <div className="mx-4">
            <SubmitButton isValid={formik.isValid} isDirty={formik.dirty}/>
          </div>
        </div>
      }
    </Formik>
  </div>;
}


function PersonForm({formFieldPrefix, idx}: { formFieldPrefix: string, idx: number }) {
  const {t} = useTranslation();
  const baseName = `${formFieldPrefix}.${idx}`;
  return <div className="py-4">
    <h3 className="mb-1">{idx + 1}. Person</h3>
    <div className="flex space-x-2">
      <FormInput className="w-1/2" label={t('person.firstname')} name={`${baseName}.firstName`} required/>
      <FormInput className="w-1/2" label={t('person.lastname')} name={`${baseName}.lastName`} required/>
    </div>
    <div>
      <FormInput className="w-full" label={t('person.email')} name={`${baseName}.email`} required
                 type="email"/>
    </div>
    <div>
      <FormInput className="w-full" data-date-placeholder={t('person.birthday.placeholder.supported')}
                 placeholder={t('person.birthday.placeholder.unsupported')} label={t('person.birthday.title')}
                 name={`${baseName}.birthday`} required type="date"/>
    </div>
  </div>;

}

function createPerson(): Person {
  return {firstName: '', lastName: '', email: '', birthday: ''};
}

export type CreateContract = {
  persons: Array<Person>;
  contractType: string;
  text: string;
  dueDate: string;
}
