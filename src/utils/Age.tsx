import dayjs from 'dayjs';
import i18next from 'i18next';

export const TEMPLATE_STRING_AS_DATE = 'YYYY-MM-DD';
export const TEMPLATE_DATE = 'DD.MM.YYYY';
export const TEMPLATE_DATETIME = `${TEMPLATE_DATE} HH:mm`;

type DateFormattingProps = { dateString: string };

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
}: DateFormattingProps & { relativeTo?: string }) {
  const age = dayjs(relativeTo)
    .diff(dayjs(birthday), 'year', true);
  return `${(Math.floor(age * 100) / 100).toFixed(2)} ${i18next.t('utils.years')}`;
}

export function CalculatedBirthday(props: DateFormattingProps & { relativeTo?: string }) {
  return (
    <>
      {calculateAge(props)}
      {' '}
    </>
  );
}
