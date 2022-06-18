import { HTMLProps, MouseEventHandler, useCallback } from 'react';
import { StyledLinkButton } from './StyledButton';
import { RequiredField } from '../types/helper';

export function StyledCopyLinkButton(props: RequiredField<Omit<HTMLProps<HTMLAnchorElement>, 'onClick'>, 'href'>) {
  const { href: url } = props;
  const onClick: MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    navigator.clipboard.writeText(url);
    event.preventDefault();
  }, [url]);

  return <StyledLinkButton {...props} onClick={onClick} />;
}
