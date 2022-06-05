import classNames from 'classnames';
import { LeaderboardEntry } from './waitlist.api';

type Props = { items: Array<LeaderboardEntry>, className?: string };

export function List({ items, className = '' }: Props) {
  return (
    <ol className={`grid grid-cols-1 gap-2 list-none sm:grid-cols-2 md:grid-cols-3 ${className}`}>
      {items.map((i) => <Item key={i.referrer + i.points} item={i} />)}
    </ol>
  );
}

function Item({ item }: { item: LeaderboardEntry }) {
  const borderClasses = classNames({
    'border-yellow-500': item.position === 1,
    'border-gray-500': item.position === 2,
    'border-amber-700': item.position === 3,
    'border-red-500': item.points < 0,
  });

  const textClasses = classNames({
    'text-yellow-500': item.position === 1,
    'text-gray-500': item.position === 2,
    'text-amber-700': item.position === 3,
    'text-red-700': item.points < 0,
  });

  return (
    <li className={`p-2 m-2 border-2 rounded-xl ${borderClasses}`}>
      <h4 className="text-center">
        {item.position}
        )&nbsp;
        <span className={`font-semibold ${textClasses}`}>{item.referrer}</span>
      </h4>
      <div className={`text-center font-thin text-2xl ${textClasses}`}>{item.points}</div>
    </li>
  );
}
