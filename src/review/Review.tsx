import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadedReview } from '../admin/reviews/reviews.api';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { DaysAgo } from '../utils/Age';
import { FiveStarRating } from '../form/FiveStarRating';

export function Review({
  name,
  email,
  creation_date: creationDate,
  review_private: privateReview = '',
  review_public: publicReview = '',
  rating,
  className,
  children,
}: LoadedReview & { className?: string, children?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <Card className={className}>
      <h2 className="mb-2">
        {name}
        {' '}
        (
        {email}
        )
      </h2>
      <div className="flex justify-center">
        <Badge><DaysAgo dateString={creationDate} /></Badge>
      </div>
      {!!rating && (
        <FiveStarRating
          className="mt-2 -mb-2 text-center"
          starSize="rs-lg"
          value={rating}
        />
      )}
      {!!privateReview && (
        <>
          <h3 className="my-2 font-medium">{t('reviews.titles.private')}</h3>
          <p className="text-center whitespace-pre-line">{privateReview}</p>
        </>
      )}
      {!!publicReview && (
        <>
          <h3 className="my-2 font-medium">{t('reviews.titles.text')}</h3>
          <p className="text-center whitespace-pre-line">{publicReview}</p>
        </>
      )}
      <div className="grow" />
      {children !== undefined && children}
    </Card>
  );
}
