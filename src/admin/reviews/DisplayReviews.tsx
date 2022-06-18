import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart } from 'recharts';
import classNames from 'classnames';
import { LoadedReview, useGetAllReviews } from './reviews.api';
import { LoginData } from '../../utils/LoginData';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ResponsiveContainer } from '../../components/ResponsiveContainer';
import { useFontSize } from '../../charts/textWidth';
import { StyledButton } from '../../components/StyledButton';
import { useModal } from '../../components/Modal';
import { StyledTextArea } from '../../form/StyledFields';
import { Review } from '../../review/Review';

export function DisplayReviews({ loginData }: { loginData: LoginData }) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }] = useGetAllReviews(loginData);
  return (
    <>
      <h1 className="mb-2">{t('admin.reviews.titles.all')}</h1>
      <Loadable
        data={data}
        loading={loading}
        error={error}
        loadingElement={<LoadingIndicator />}
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
      height={size / 2 + 5}
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
        <Cell fill={fill} stroke={fill} z="2" />
        <Cell fill="white" stroke={fill} strokeDasharray="4" z="1" />

      </Pie>
      <text
        x={size / 2}
        y={size / 2 - fontSize}
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
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((d) => <DisplaySingleReview {...d} key={`${d.creation_date} ${d.name}`} />)}
    </div>
  );
}

function DisplaySingleReview(data: LoadedReview) {
  const { t } = useTranslation();
  const [copyModal, openCopyModal] = useModal(t('admin.reviews.copy.title'), () => <CopyReview data={data} />);
  return (
    <Review {...data}>
      <StyledButton
        onClick={() => openCopyModal(true)}
        className="mt-2"
      >
        {t('admin.reviews.copy.action')}
      </StyledButton>
      {copyModal}
    </Review>
  );
}

export function CopyReview({ data }: { data: LoadedReview }) {
  const reviewContent = useMemo(() => {
    const lines = new Array<string>();
    lines.push(
      '---',
      'video: ???',
      'image: ???',
      'type: boudoir | beauty | business | sport | pärchen | live',
      `name: ${data.name}`,
      `date: ${data.creation_date.split(' ')[0]}`,
    );
    if (data.rating) {
      lines.push(`rating: ${data.rating}`);
    }
    lines.push('---');
    if (data.review_public) {
      lines.push(data.review_public);
    }

    return lines.join('\r\n');
  }, [data]);
  return (
    <StyledTextArea
      onClick={(e) => {
        e.currentTarget.select();
        navigator.clipboard?.writeText(reviewContent);
      }}
      className="w-full h-60 font-mono text-sm"
      readOnly
      error={false}
      value={reviewContent}
    />
  );
}
