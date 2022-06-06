import { ButtonHTMLAttributes } from 'react';
import { ResponseValues } from 'axios-hooks';
import { StyledButton } from '../../components/StyledButton';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  request: ResponseValues<unknown, unknown, unknown>
};

export function ActionButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className } = props;
  return <StyledButton {...props} className={`p-2.5 font-bold rounded-2xl ${className}`} />;
}

export function RequestActionButton(rawProps: Props) {
  const {
    request,
    children,
    ...props
  } = rawProps;
  const { loading } = request;
  return (
    <ActionButton {...props} disabled={loading}>
      {children}
      <Loadable request={[request]} loadingElement={<LoadingIndicator height="2rem" />} />
    </ActionButton>
  );
}
