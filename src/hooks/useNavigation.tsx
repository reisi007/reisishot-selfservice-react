import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {useCallback} from 'react';

type UrlPart = string | number | null | undefined;
type Url = UrlPart | Array<UrlPart> | null | undefined;
type QueryParams = { [key: string]: string }
type NavigationStep = { replaceHistory: boolean, replaceParams: boolean, newUrl: Url, parameters: { [key: string]: string | null } }


export function useNavigation(): [QueryParams, (param: Partial<NavigationStep>) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const setNavigation = useCallback(({
                                       parameters = {},
                                       newUrl: newUrlParts = null,
                                       replaceHistory = false,
                                       replaceParams = false,
                                     }: Partial<NavigationStep>) => {
    const oldUrl = location.pathname;
    const newUrl = buildUrl(newUrlParts);
    if(newUrl === null) {
      return;
    }
    const changeParamsOnly = oldUrl === newUrl;
    const newParams = computeParams(searchParams, parameters, replaceParams);

    if(changeParamsOnly) {
      setSearchParams(newParams);
    }
    else {
      navigate(newUrl, {replace: replaceHistory});
    }

  }, [location, navigate, searchParams, setSearchParams]);

  return [convertUrlSearchParams2Object(searchParams), setNavigation];
}


const convertUrlSearchParams2Object = (searchParams: URLSearchParams): QueryParams => {
  return Object.fromEntries(searchParams.entries());
};

const computeParams = (searchParams: URLSearchParams, parameters: { [key: string]: string | null }, replaceParams: boolean): QueryParams => {
  const search: QueryParams = replaceParams ? {} : convertUrlSearchParams2Object(searchParams);

  Object.entries(parameters).forEach(([key, value]) => {
    if(value === null) {
      delete search[key];
    }
    else {
      search[key] = value;
    }
  });

  return search;
};

const buildUrl = (url: Url): string | null => {
  if(!url) {
    return null;
  }
  if(Array.isArray(url)) {
    if(url.findIndex(e => e === undefined || e === null) >= 0) {
      return null;
    }
    else {
      return url.join('/');
    }
  }
  if(typeof url === 'number') {
    return url.toString(10);
  }
  return url;
};
