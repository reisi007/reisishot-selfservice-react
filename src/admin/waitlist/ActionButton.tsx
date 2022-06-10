import { ButtonHTMLAttributes } from 'react';
import { ResponseValues } from 'axios-hooks';
import classNames from 'classnames';
import { StyledButton } from '../../components/StyledButton';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & ResponseValues<unknown, unknown, unknown>;

export function ActionButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className } = props;
  const classes = classNames(
    className,
    'p-2.5 font-bold rounded-2xl',
  );
  return <StyledButton {...props} className={classes} />;
}

export function RequestActionButton(rawProps: Props) {
  const {
    data,
    loading,
    error,
    children,
    disabled = false,
    ...props
  } = rawProps;
  return (
    <ActionButton {...props} disabled={loading || disabled}>
      {children}
      <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator height="2rem" />} />
    </ActionButton>
  );
}
