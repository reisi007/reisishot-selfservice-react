import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  ButtonHTMLAttributes, Dispatch, ReactNode, SetStateAction, useMemo, useRef, useState,
} from 'react';
import { StyledButton } from './StyledButton';
import { formatJson } from '../utils/json';
import { LoadableRequest } from './Loadable';
import { RequestActionButton } from '../admin/waitlist/ActionButton';

export type Pages<T extends object> = {
  [key in keyof T]: (data: T[key], idx: number) => ReactNode
};

export type IsNextEnabled<T extends object> = {
  [key in keyof T]: (data: T[key], idx: number) => boolean
};
type Props<T extends object> = {
  initialValues: T,
  order: Array<keyof T>,
  currentPage: keyof T,
  setCurrentPage: Dispatch<SetStateAction<keyof T>>
  pages: Pages<T>,
  onSubmit: (value: T) => void
  canSubmit: (value: T) => boolean
  isNextEnabled: IsNextEnabled<T>
} & LoadableRequest<unknown>;

type UseProps<T extends object> = Omit<Props<T>, 'currentPage' | 'setCurrentPage'> & { initialPage?: keyof T };

export function usePageableGroup<T extends object>(props: UseProps<T>): [JSX.Element, Dispatch<SetStateAction<keyof T>>] {
  const {
    order,
    initialPage,
  } = props;
  const [currentPage, setCurrentPage] = useState(initialPage ?? order[0]);
  const group = <PageableSubmittableGroup {...props} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
  return [group, setCurrentPage];
}

export function PageableSubmittableGroup<T extends object>({
  initialValues,
  data: requestData,
  loading,
  error,
  currentPage,
  setCurrentPage,
  pages,
  order,
  canSubmit,
  onSubmit,
  isNextEnabled,
}: Props<T>) {
  const data = useRef(initialValues);
  const { t } = useTranslation();
  const pageIndex = useMemo(() => order.indexOf(currentPage), [currentPage, order]);
  const page = useMemo(() => pages[currentPage](data.current[currentPage], pageIndex), [currentPage, data, pageIndex, pages]);
  return (
    <>
      <pre>{formatJson(data.current)}</pre>
      <div>
        {page}
      </div>
      <div>
        <div className="grid grid-cols-3 mx-auto w-3/4">
          <PageButton
            disabled={pageIndex === 0}
            onClick={() => setCurrentPage(order[pageIndex - 1])}
            className="rounded-r-none"
          >
            {t('actions.prev')}
          </PageButton>
          <RequestActionButton
            disabled={!canSubmit(data.current)}
            onClick={() => onSubmit(data.current)}
            data={requestData}
            loading={loading}
            error={error}
            className="py-1 px-2 text-white bg-reisishot !rounded-none"
          >
            {t('actions.send')}
          </RequestActionButton>
          <PageButton
            disabled={pageIndex === order.length - 1 || !isNextEnabled[currentPage](data.current[currentPage], pageIndex)}
            onClick={() => setCurrentPage(order[pageIndex + 1])}
            className="rounded-l-none"
          >
            {t('actions.next')}
          </PageButton>
        </div>
      </div>
    </>
  );
}

function PageButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = classNames('bg-reisishot py-1 px-2 text-white rounded-2xl', className);

  return <StyledButton {...props} className={classes} />;
}
