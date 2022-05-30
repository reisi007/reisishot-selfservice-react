import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {NavLink} from 'react-router-dom';
import {useAdminLogin} from './AdminLoginContextProvider';

export function AdminMenu() {
  const [loginData] = useAdminLogin();
  const {t} = useTranslation();
  const isUserLoggedIn = !!loginData;
  const allRoutes = useMemo(() => {
    const allRoutes = [
      {'title': t('admin.login.title'), url: ''},
      {'title': t('admin.statistics.title'), url: 'statistics'},
      {'title': t('admin.contract.title'), url: 'contracts'},
    ];
    return isUserLoggedIn ? allRoutes : [allRoutes[0]];
  }, [isUserLoggedIn, t]);

  return <ul className="flex flex-wrap justify-evenly p-2 mb-2 list-none text-white bg-reisishot rounded-xl">
    {
      allRoutes.map(({title, url}) => {
        return <li key={url} className="basis-0 grow p-2 m-2 text-center rounded-lg border-2">
          <NavLink className="inline-block w-full text-white no-underline whitespace-nowrap"
                   to={`/dashboard/${url}`}>{title}</NavLink>
        </li>;
      })
    }
  </ul>;
}


