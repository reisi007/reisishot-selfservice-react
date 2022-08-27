import { Waitlist as PrivateWaitlist } from './private/Waitlist';
import { Waitlist as PublicWaitlist } from './public/Waitlist';
import { EmailLanding } from './private/EmailLanding';
import { ChooseImages } from './private_choose/ChooseImages';
import { EmaiChooselLanding } from './private/EmailChooseLanding';
import { EmailReviewLanding } from './private/EmailReviewLanding';

export const EmailLandingPage = EmailLanding;
export const EmailChooseLandingPage = EmaiChooselLanding;
export const EmailReviewLandingPage = EmailReviewLanding;
export const PrivateWaitlistPage = PrivateWaitlist;
export const PublicWaitlistPage = PublicWaitlist;
export const ReviewImagePage = ChooseImages;
