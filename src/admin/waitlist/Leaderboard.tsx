import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import { FormikProps } from 'formik/dist/types';
import { useEffect, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { number as validateNumber, object as validateObject } from 'yup';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Loadable } from '../../components/Loadable';
import { FormInput } from '../../form/FormikFields';
import { List } from './List';
import { LoginData } from '../login/LoginData';
import { LeaderboardEntry, useFindLeaderboardByYear } from './waitlist.api';

export function Leaderboard({
  data,
  loginData,
}: { data: Array<LeaderboardEntry>, loginData: LoginData }) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-3xl">{t('admin.waitlist.titles.leaderboard.main')}</h2>
      <PerYear loginData={loginData} />
      <div className="my-4 border-b-2" />
      <Total data={data} />
    </>
  );
}

function Total({ data }: { data: Array<LeaderboardEntry> }) {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="py-2 text-2xl">{t('admin.waitlist.titles.leaderboard.total')}</h3>
      <List items={data} />
    </>
  );
}

function PerYear({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const minYear = 2018;
  const maxYear = useMemo(() => dayjs()
    .year(), []);
  const notInRange = t('form.errors.number.notInRange', {
    min: minYear,
    max: maxYear,
  });

  return (
    <Formik<{ year: number }>
      initialValues={{ year: maxYear }}
      validationSchema={validateObject({
        year: validateNumber()
          .min(minYear, notInRange)
          .max(maxYear, notInRange),
      })}
      onSubmit={() => {
      }}
    >
      {(formik) => <PerYearForm minYear={minYear} maxYear={maxYear} loginData={loginData} formik={formik} />}
    </Formik>
  );
}

type PerYearProps = { formik: FormikProps<{ year: number }>, loginData: LoginData, maxYear: number, minYear: number };

function PerYearForm({
  formik,
  loginData,
  maxYear,
  minYear,
}: PerYearProps) {
  const { values } = formik;
  const { year: yearInternal } = values;
  const [request, fetchData] = useFindLeaderboardByYear();
  const [year] = useDebounce(yearInternal, 300);
  const { t } = useTranslation();
  useEffect(() => {
    fetchData({ year }, loginData);
  }, [fetchData, loginData, year]);

  return (
    <>
      <h3 className="py-2 text-2xl">{t('admin.waitlist.titles.leaderboard.year', values)}</h3>
      <FormInput
        className="mx-auto w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
        label={t('admin.waitlist.selectYear')}
        type="number"
        name="year"
        max={maxYear}
        min={minYear}
      />
      <Loadable
        result={[request]}
        loadingElement={<LoadingIndicator height="10rem" />}
      >
        {(data) => <List className="mt-4 mb-2" items={data} />}
      </Loadable>
    </>
  );
}
