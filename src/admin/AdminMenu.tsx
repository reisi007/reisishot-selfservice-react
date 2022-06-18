import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminLogin } from './AdminLoginContextProvider';
import { useWaitlistAdminData } from './waitlist/waitlist.api';
import { LoginData } from '../utils/LoginData';

export function AdminMenu() {
  const [loginData] = useAdminLogin();
  if (loginData !== undefined) {
    return <PrivateMenu {...loginData} />;
  }
  return <PublicMenu />;
}

function PublicMenu() {
  const publicMenu = usePublicMenuItems();
  return <RenderMenu routes={publicMenu} />;
}

function PrivateMenu(loginData: LoginData) {
  const publicMenu = usePublicMenuItems();
  const { t } = useTranslation();

  const [{ data }] = useWaitlistAdminData(loginData);
  const isShowSupportPing = !!data?.pendingContracts?.length;
  const routes: Array<AdminMenuEntry> = useMemo(() => [
    ...publicMenu,
    {
      title: t('admin.waitlist.titles.main'),
      url: 'waitlist',
    },
    {
      title: t('admin.reviews.titles.main'),
      url: 'reviews',
    },
    {
      title: t('admin.statistics.title'),
      url: 'statistics',
    },
    {
      title: t('admin.contract.title'),
      url: 'contracts',
    }, {
      title: t('admin.waitlist.support.title'),
      url: 'support',
      showPing: isShowSupportPing,
    },
  ], [publicMenu, isShowSupportPing, t]);

  return <RenderMenu routes={routes} />;
}

function RenderMenu({ routes }: { routes: Array<AdminMenuEntry> }) {
  return (
    <ul className="flex flex-wrap justify-evenly p-2 mb-2 list-none text-white bg-reisishot rounded-xl">
      {
        routes.map(({
          title,
          url,
          showPing,
        }) => (
          <li key={url} className="relative basis-0 grow p-2 m-2 text-center rounded-lg border-2">
            <NavLink
              className="inline-block w-full text-white no-underline whitespace-nowrap"
              to={`/dashboard/${url}`}
            >
              {title}
            </NavLink>
            {showPing === true && (
            <span className="inline-flex absolute -top-1.5 -right-1.5 justify-center items-center w-3 h-3">
              <span className="absolute w-full h-full bg-white rounded-full opacity-75 motion-safe:animate-ping" />
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>
            )}
          </li>
        ))
      }
    </ul>
  );
}

function usePublicMenuItems() {
  const { t } = useTranslation();
  return useMemo(() => [{
    title: t('admin.login.title'),
    url: '',
  }], [t]);
}

type AdminMenuEntry = { title: string, url: string, showPing?: boolean };
