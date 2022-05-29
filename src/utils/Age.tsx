import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';

export const TEMPLATE_STRING_AS_DATE = 'YYYY-MM-DD';
export const TEMPLATE_DATE = 'DD.MM.YYYY';
export const TEMPLATE_DATETIME = TEMPLATE_DATE + ' HH:mm';

type DateFormattingProps = { dateString: string };

export function FormattedDateTime({dateString}: DateFormattingProps) {
  return <>{dayjs(dateString).format(TEMPLATE_DATETIME)}</>;
}

export function FormattedDate({dateString}: DateFormattingProps) {
  return <>{formatDate(dateString)}</>;
}

export function formatDate(dateString: string) {
  return dayjs(dateString).format(TEMPLATE_DATE);
}


export function CalculatedBirthday({dateString: birthday, relativeTo}: DateFormattingProps & { relativeTo?: string }) {
  const {t} = useTranslation();
  const age = dayjs(relativeTo).diff(dayjs(birthday), 'year', true);
  return <>{`${(Math.floor(age * 100) / 100).toFixed(2)} ${t('utils.years')}`} </>;
}
