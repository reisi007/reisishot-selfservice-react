import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { LoadedReview, useGetAllReviews } from './reviews.api';
import { LoginData } from '../login/LoginData';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';

export function DisplayReviews({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const data = useGetAllReviews(loginData);
  return (
    <>
      <h1 className="mb-2">{t('admin.reviews.titles.all')}</h1>
      <Loadable
        result={data}
        loadingElement={<LoadingIndicator height="10rem" />}
      >
        {(curData) => <DisplayReviewData data={curData} />}
      </Loadable>
    </>
  );
}

function DisplayReviewData({ data }: { data: Array<LoadedReview> }) {
  return <div className="grid md:grid-cols-2">{data.map((d) => <DisplaySingleReview data={d} />)}</div>;
}

function DisplaySingleReview({ data }: { data: LoadedReview }) {
  const {
    name,
    email,
    creation_date: creationDate,
    review_private: privateReview = '',
    review_public: publicReview = '',
    rating,
  } = data;
  const daysAgo = useMemo(() => computeDaysAgo(creationDate), [creationDate]);
  const { t } = useTranslation();
  return (
    <div className="p-2 m-2 rounded-lg border">
      <h2 className="mb-2">
        {name}
        {' '}
        (
        {email}
        )
      </h2>
      <div className="flex justify-center">
        <span className="inline-block py-0.5 px-2.5 mr-2 font-light text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {t('admin.reviews.daysAgo', { days: daysAgo })}
        </span>
      </div>
      {!!rating && <div className="text-2xl text-center">{rating}</div>}
      {!!privateReview && (
        <>
          <h3 className="my-2 font-medium">{t('reviews.titles.private')}</h3>
          <p className="text-center whitespace-pre-line">{privateReview}</p>
        </>
      )}
      {!!publicReview && (
        <>
          <h3 className="my-2 font-medium">{t('reviews.titles.public')}</h3>
          <p className="text-center whitespace-pre-line">{publicReview}</p>
        </>
      )}
    </div>
  );
}

function computeDaysAgo(dateString: string, relativeTo: Dayjs = dayjs()) {
  return -dayjs(dateString)
    .diff(relativeTo, 'days', false);
}
