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

  return <ul className="flex justify-evenly p-2 mb-2 list-none text-white bg-reisishot rounded-xl">
    {
      allRoutes.map(({title, url}) => {
        return <li key={url}><NavLink className="px-2 text-white no-underline rounded-lg border-2"
                                      to={`/dashboard/${url}`}>{title}</NavLink>
        </li>;
      })
    }
  </ul>;
}


