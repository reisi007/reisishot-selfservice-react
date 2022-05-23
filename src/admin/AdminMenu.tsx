import React from 'react';

type Props = { isUserLoggedIn: boolean }

// @ts-ignore TS6133 - TODO use this param
export function AdminMenu({isUserLoggedIn}: Props) {
  return <div className="flex justify-evenly p-2 mb-2 text-white bg-reisishot rounded">Placeholder Admin Menu</div>;
}
