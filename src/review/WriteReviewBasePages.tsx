import {
  ButtonHTMLAttributes, Dispatch, MutableRefObject, ReactNode, SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { PageableContextState, PageableContextStateType } from '../components/Pageable';
import { LoadableRequest } from '../components/Loadable';
import { RequestActionButton } from '../admin/waitlist/ActionButton';
import { StyledButton } from '../components/StyledButton';
import { ReviewRequest } from './review.api';

export type ReviewPages = {
  person: Pick<ReviewRequest, 'name' | 'email'>,
  rating: Pick<ReviewRequest, 'rating'>,
  text: Pick<ReviewRequest, 'review_public' | 'review_private'>,
  check: undefined
};

export type WriteReviewPageProps = { context: PageableContextStateType<ReviewPages>, request: LoadableRequest<unknown>, value: MutableRefObject<ReviewPages> };

type AdditionalBasePageProps = { children: ReactNode, buttons?: ReactNode, canNext: boolean, saveState: () => void };

export function WriteReviewBasePage({
  children,
  buttons,
  request,
  context,
  canNext,
  saveState,
}: WriteReviewPageProps & AdditionalBasePageProps) {
  const [state, setState] = context;
  return (
    <div className="flex flex-col">
      <div className="mx-auto min-h-[30vh]">
        {children}
      </div>
      <div className="grow" />
      {buttons}
      <NavButtons
        {...state}
        {...request}
        setCurrentPage={setState}
        canNext={canNext}
        saveState={saveState}
      />
    </div>
  );
}

function SubmitButton({
  onSubmit,
  data,
  loading,
  error,
  saveState,
}: { canSubmit: boolean, onSubmit: () => void, saveState: () => void } & LoadableRequest<unknown>) {
  const { t } = useTranslation();
  return (
    <RequestActionButton
      onClick={() => {
        saveState();
        onSubmit();
      }}
      data={data}
      loading={loading}
      error={error}
      className="basis-0 grow py-1 px-2 text-white bg-reisishot !rounded-none"
    >
      {t('actions.send')}
    </RequestActionButton>
  );
}

function NavButtons({
  canNext,
  saveState,
  isLast,
  isFirst,
  setCurrentPage,
}: PageableContextState<ReviewPages> & { canNext: boolean, setCurrentPage: Dispatch<SetStateAction<number>>, saveState: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex  mx-auto mt-2 w-3/4">
      <PageButton
        disabled={isFirst}
        onClick={() => {
          saveState();
          setCurrentPage((p) => p - 1);
        }}
        className="basis-0 grow rounded-r-none"
      >
        {t('actions.prev')}
      </PageButton>
      <PageButton
        disabled={isLast || !canNext}
        onClick={() => {
          saveState();
          setCurrentPage((p) => p + 1);
        }}
        className="basis-0 grow rounded-l-none"
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
