import { Navigate, Route } from 'react-router-dom';
import { useWaitlistLogin } from './WaitlistContextProvider';
import { lazyInternal, ReactFunctionComponent } from '../lazy';
import { withLoginData } from '../utils/LoginData';

export function useWaitlistRoutes() {
  const [waitlistLogin] = useWaitlistLogin();

  const EmailPage = lazy((m) => m.EmailLandingPage);
  const EmailChoosePage = lazy((m) => m.EmailChooseLandingPage);
  const EmailReviewPage = lazy((m) => m.EmailReviewLandingPage);
  const BookPage = lazy((m) => m.PrivateWaitlistPage);
  const PublicPage = lazy((m) => m.PublicWaitlistPage);
  const ReviewImagePage = lazy((m) => m.ReviewImagePage);

  const privateArea = withLoginData(waitlistLogin, (data) => (
    <>
      <Route path="book" element={<BookPage loginData={data} />} />
      <Route path="review/:folder" element={<ReviewImagePage loginData={data} />} />
    </>
  ));

  return (
    <Route path="/waitlist">
      {privateArea}
      <Route index element={<PublicPage />} />
      <Route path=":referrer" element={<PublicPage />} />
      <Route path=":email/:hash" element={<EmailPage />} />
      <Route path=":email/:hash/:choose_id" element={<EmailChoosePage />} />
      <Route path=":email/:hash/review" element={<EmailReviewPage />} />
      <Route path="*" element={<Navigate to="/waitlist" />} />
    </Route>
  );
}

function lazy<T>(selector: (m: typeof import('./Waitlist.module')) => ReactFunctionComponent<T>) {
  return lazyInternal(import('./Waitlist.module'), selector);
}
