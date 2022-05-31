import {date as validateDate, string as validateString} from 'yup';
import dayjs from 'dayjs';
import i18n from 'i18next';

export function validateDateString() {
  return validateDate()
    .transform(e => dayjs(e).toDate());
}

export function requiredString() {
  const requiredMessage = i18n.t('form.errors.required');
  return validateString()
    .required(requiredMessage)
    .min(1, requiredMessage);
}
