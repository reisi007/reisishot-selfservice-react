import {i18n} from 'i18next';

const mocked_i18n: Partial<i18n> = {
  t: (str: string) => str,

};

export default mocked_i18n;

