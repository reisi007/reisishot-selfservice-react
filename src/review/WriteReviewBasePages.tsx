import { ButtonHTMLAttributes, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { PageableContextState, PageableContextStateType } from '../components/Pageable';
import { LoadableRequest } from '../components/Loadable';
import { RequestActionButton } from '../admin/waitlist/ActionButton';
import { StyledButton } from '../components/StyledButton';
import { Review } from './review.api';

export type ReviewPages = {
  person: Pick<Review, 'name' | 'email'>,
  rating: Pick<Review, 'rating'>,
};

export type PageProps = { context: PageableContextStateType<ReviewPages>, request: LoadableRequest<unknown>, onSubmit: () => void };

type AdditionalBasePageProps = { children: JSX.Element, canNext: boolean, canSubmit: boolean };

export function WriteReviewBasePage({
  children,
  onSubmit,
  request,
  context,
  canNext,
  canSubmit,
}: PageProps & AdditionalBasePageProps) {
  const [state, setState] = context;
  return (
    <div className="flex flex-col">
      <div className="min-h-[30vh]">
        {children}
      </div>
      <div className="grow" />
      <NavButtons {...state} {...request} setCurrentPage={setState} canNext={canNext} canSubmit={canSubmit} onSubmit={onSubmit} />
    </div>
  );
}

function NavButtons({
  canNext,
  canSubmit,
  isLast,
  isFirst,
  setCurrentPage,
  onSubmit,
  data,
  loading,
  error,
}: PageableContextState<ReviewPages> & LoadableRequest<unknown>
& { canSubmit: boolean, canNext: boolean, setCurrentPage: Dispatch<SetStateAction<number>>, onSubmit: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 mx-auto mt-2 w-3/4">
      <PageButton
        disabled={isFirst}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="rounded-r-none"
      >
        {t('actions.prev')}
      </PageButton>
      <RequestActionButton
        disabled={!canSubmit}
        onClick={onSubmit}
        data={data}
        loading={loading}
        error={error}
        className="py-1 px-2 text-white bg-reisishot !rounded-none"
      >
        {t('actions.send')}
      </RequestActionButton>
      <PageButton
        disabled={isLast || !canNext}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="rounded-l-none"
      >
        {t('actions.next')}
      </PageButton>
    </div>
  );
}

function PageButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = classNames('bg-reisishot py-1 px-2 text-white rounded-2xl', className);

  return <StyledButton {...props} className={classes} />;
}
