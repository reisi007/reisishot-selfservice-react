import { lazy } from 'react';

export type ReactFunctionComponent<T> = (a: T | never) => JSX.Element;

export function lazyInternal<T, M>(promise: Promise<M>, selector: (m: M) => ReactFunctionComponent<T>) {
  return lazy(() => promise.then((m) => ({ default: selector(m) })));
}
