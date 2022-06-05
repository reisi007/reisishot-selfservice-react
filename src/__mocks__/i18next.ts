import { i18n } from 'i18next';

const MOCKED_I18N: Partial<i18n> = {
  t: (str: string) => str,

};

export default MOCKED_I18N;
