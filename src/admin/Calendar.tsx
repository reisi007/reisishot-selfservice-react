import {ShootingDateEntry} from './admin.api';
import React from 'react';

type Props = { data: Array<ShootingDateEntry>, rowCreator: (e: ShootingDateEntry, idx: number) => React.ReactElement }

export function Calendar({data, rowCreator}: Props) {
  return <ul>{data.map(rowCreator)}</ul>;
}
