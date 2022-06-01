import {ButtonHTMLAttributes} from 'react';

type Props = { children: JSX.Element } & ButtonHTMLAttributes<unknown>

export function Button({children, ...buttonProps}: Props) {
  return <button {...buttonProps}
                 className={`p-2 border m-2 duration-150 rounded-lg focus:ring disabled:opacity-75 disabled:bg-gray-600 disabled:text-gray-200 ${buttonProps.className ? buttonProps.className : ''}`}>{children}</button>;
}
