import { Navigate, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { WaitlistPerson } from '../waitlist/public/waitlist-public.api';

const REVIEW_URL = '/reviews/write';

export function useNavigateToReview() {
  const navigate = useNavigate();
  return useCallback((person: WaitlistPerson) => {
    navigate(REVIEW_URL, { state: person });
  }, [navigate]);
}

export function NavigateToReview({ person }: { person: WaitlistPerson }) {
  return <Navigate to={REVIEW_URL} state={person} />;
}
