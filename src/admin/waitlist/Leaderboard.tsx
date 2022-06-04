import {LeaderboardEntry, useFindLeaderboardByYear} from './waitlist.api';
import {LoginData} from '../login/LoginData';
import {List} from './List';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import dayjs from 'dayjs';
import {FormInput} from '../../form/FormikFields';
import {FormikProps} from 'formik/dist/types';
import {useEffect, useMemo} from 'react';
import {useDebounce} from 'use-debounce';
import {LoadingIndicator} from '../../LoadingIndicator';
import {Loadable} from '../../components/Loadable';

export function Leaderboard({data, loginData}: { data: Array<LeaderboardEntry>, loginData: LoginData }) {
  const {t} = useTranslation();
  return <>
    <h2 className="text-3xl">{t('admin.waitlist.titles.leaderboard.main')}</h2>
    <PerYear loginData={loginData}/>
    <div className="my-4 border-b-2"/>
    <Total data={data}/>
  </>;
}

function Total({data}: { data: Array<LeaderboardEntry> }) {
  const {t} = useTranslation();
  return <>
    <h3 className="py-2 text-2xl">{t('admin.waitlist.titles.leaderboard.total')}</h3>
    <List items={data}/>
  </>;
}


function PerYear({loginData}: { loginData: LoginData }) {
  const curYear = useMemo(() => {
    return dayjs().year();
  }, []);
  return <>
    <Formik<{ year: number }> initialValues={{year: curYear}} onSubmit={() => {
    }}>
      {formik => <PerYearForm loginData={loginData} formik={formik}/>}
    </Formik>
  </>;
}

function PerYearForm({formik, loginData}: { formik: FormikProps<{ year: number }>, loginData: LoginData }) {
  const {values} = formik;
  const {year: yearInternal} = values;
  const [request, fetchData] = useFindLeaderboardByYear();
  const [year] = useDebounce(yearInternal, 300);
  const {t} = useTranslation();
  useEffect(() => {
    fetchData({year}, loginData);
  }, [fetchData, loginData, year]);

  return <>
    <h3 className="py-2 text-2xl">{t('admin.waitlist.titles.leaderboard.year', values)}</h3>
    <FormInput label={t('admin.waitlist.selectYear')} name="year"/>
    <Loadable result={[request]} loadingElement={<LoadingIndicator height="10rem"/>}
              displayData={(data) => <List items={data}/>}/>
  </>;
}
