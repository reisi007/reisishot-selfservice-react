import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { Cell, Pie, PieChart } from 'recharts';
import classNames from 'classnames';
import { LoadedReview, useGetAllReviews } from './reviews.api';
import { LoginData } from '../login/LoginData';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ResponsiveContainer } from '../../components/ResponsiveContainer';
import { useFontSize } from '../../charts/textWidth';
import { FiveStarRating } from '../../form/FiveStarRating';

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
        {(curData) => (
          <>
            <DisplayChart data={curData} />
            <DisplayReviewData data={curData} />
          </>
        )}
      </Loadable>
    </>
  );
}

function DisplayChart({ data }: { data: Array<LoadedReview> }) {
  const [avg, cnt] = useMemo(() => {
    const filteredData = data.map((e) => e.rating)
      .filter((e) => e !== undefined && !Number.isNaN(e));
    const count = filteredData.length;
    const sum = filteredData
      .reduce((a, b) => (a ?? 0) + (b ?? 0)) ?? 0;
    const average = Math.round(sum / count);
    return [average, count] as const;
  }, [data]);
  const label = `${avg} / 100 (${cnt ?? 0})`;

  return (
    <>
      <ResponsiveContainer className="mx-auto w-full md:w-1/2">
        {(width) => <PieChartChart width={width} label={label} avg={avg} />}
      </ResponsiveContainer>
      <span className="text-xl font-medium text-center" />
    </>
  );
}

type PieChartChartProps = { width: number, label: string, avg: number };

function PieChartChart({
  width,
  label,
  avg,
}: PieChartChartProps) {
  const size = Math.min(500, width);
  const fontSize = useFontSize(label, { maxWidth: size / 2 });
  const fill = classNames({
    red: avg >= 0 && avg < 20,
    orange: avg >= 40 && avg < 60,
    yellow: avg >= 60 && avg < 80,
    green: avg >= 80,
  });
  return (
    <PieChart
      className="mb-4"
      width={size}
      height={size / 2}
    >
      <Pie
        cy={size / 2}
        startAngle={180}
        endAngle={0}
        outerRadius={0.5 * size}
        innerRadius={0.3 * size}
        dataKey="value"
        isAnimationActive={false}
        data={[{
          value: avg,
        }, {
          value: 100 - avg,
        }]}
      >
        <Cell fill={fill} />
        <Cell fill="white" />
      </Pie>
      <text
        x={size / 2}
        y={(size / 2) - fontSize}
        style={{ fontSize: `${fontSize}px` }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </PieChart>
  );
}

function DisplayReviewData({ data }: { data: Array<LoadedReview> }) {
  return <div className="grid md:grid-cols-2">{data.map((d) => <DisplaySingleReview key={`${d.creation_date} ${d.name}`} data={d} />)}</div>;
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
      {!!rating && <FiveStarRating className="mt-2 -mb-2 text-center" starClassName="rs-lg" percentage={rating} />}
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
