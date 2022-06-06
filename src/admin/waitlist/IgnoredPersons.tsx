import { useTranslation } from 'react-i18next';
import { IgnoredPerson } from './waitlist.api';
import { formatDate } from '../../utils/Age';

export function IgnoredPersons({ data }: { data: Array<IgnoredPerson> }) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-3xl">{t('admin.waitlist.titles.ignored')}</h2>
      <ul className="flex flex-wrap my-2 space-x-2 list-none">
        {data.map(({
          firstName,
          lastName,
          email,
          ignoredUnit,
        }) => {
          const key = firstName + lastName + email;
          return (
            <li key={key} className="grow p-2 m-2 text-center text-white bg-red-500 rounded-xl border">
              <h3>
                {firstName}
                {' '}
                {lastName}
              </h3>
              <p>{formatDate(ignoredUnit)}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
