import dayjs, { Dayjs } from 'dayjs';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export const TEMPLATE_STRING_AS_DATE = 'YYYY-MM-DD';
export const TEMPLATE_DATE = 'DD.MM.YYYY';
export const TEMPLATE_DATETIME = `${TEMPLATE_DATE} HH:mm`;

type DateFormattingProps = { dateString: string };
type RelativeToDateFormattingProps = DateFormattingProps & { relativeTo?: string };

export function formatDateTime(dateString: string) {
  return dayjs(dateString)
    .format(TEMPLATE_DATETIME);
}

export function FormattedDateTime({ dateString }: DateFormattingProps) {
  return (
    <>
      {formatDateTime(dateString)}
    </>
  );
}

export function DaysAgo({
  dateString,
  relativeTo,
}: RelativeToDateFormattingProps) {
  const { t } = useTranslation();
  const dayJsRelativeTo = dayjs(relativeTo);
  const daysAgo = computeDaysAgo(dateString, dayJsRelativeTo);
  return (
    <>
      {' '}
      {t('admin.reviews.daysAgo', { days: daysAgo })}
    </>
  );
}

export function computeDaysAgo(dateString: string, relativeTo: Dayjs = dayjs()) {
  return -dayjs(dateString)
    .diff(relativeTo, 'days', false);
}

export function formatDate(dateString: string) {
  return dayjs(dateString)
    .format(TEMPLATE_DATE);
}

export function FormattedDate({ dateString }: DateFormattingProps) {
  return <>{formatDate(dateString)}</>;
}

export function calculateAge({
  dateString: birthday,
  relativeTo,
}: RelativeToDateFormattingProps) {
  const age = dayjs(relativeTo)
    .diff(dayjs(birthday), 'year', true);
  return `${(Math.floor(age * 100) / 100).toFixed(2)} ${i18next.t('utils.years')}`;
}

export function CalculatedBirthday(props: RelativeToDateFormattingProps) {
  return (
    <>
      {calculateAge(props)}
    </>
  );
}
