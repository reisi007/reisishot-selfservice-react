import { useParams } from 'react-router-dom';

export function Waitlist() {
  const { referrer } = useParams<'referrer'>();
  return (
    <h1>
      Public waitlist
      {referrer ?? 'No referrer'}
    </h1>
  );
}
