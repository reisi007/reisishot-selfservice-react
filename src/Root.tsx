import {useTranslation} from 'react-i18next';
import {Button} from './components/Button';
import {Link} from 'react-router-dom';
import {useNavigation} from './hooks/useNavigation';
import {useEffect} from 'react';
import {useAdminLogin} from './admin/AdminLoginContextProvider';

function useSpecialRedirects() {
  const navigate = useNavigation()[1];
  const [isAdminLoggedIn] = useAdminLogin();
  useEffect(() => {
    if(isAdminLoggedIn) {
      navigate({newUrl: '/dashboard'});
    }
  }, [isAdminLoggedIn, navigate]);
}

export default function Root() {
  const {t} = useTranslation();
  useSpecialRedirects();
  const items: Array<{ title: string, url: string }> = [
    {title: t('root.waitlist'), url: '/waitlist'},
    {title: t('root.review'), url: '/review'},
    {title: t('root.admin'), url: '/dashboard/login'},
  ];

  return <div className="flex flex-col h-full">
    <h1>{t('title')}</h1>
    <div className="flex flex-col grow justify-center m-2 mx-auto w-full sm:w-1/2">
      {
        items.map(({url, title}) =>
          <Link key={url} to={url}>
            <Button
              className="p-4 my-4 w-full text-xl font-light text-black hover:text-white hover:bg-reisishot border-reisishot">
              <>{title}</>
            </Button>
          </Link>)
      }
    </div>
  </div>;
};
