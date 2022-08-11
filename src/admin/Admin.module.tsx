import { Login } from './login/Login';
import { Statistics } from './statistics/Statistics';
import { AdminMenu } from './AdminMenu';
import { CreateContract } from './contract/CreateContract';
import { Waitlist } from './waitlist/Waitlist';
import { DisplayReviews } from './reviews/DisplayReviews';
import { WaitlistSupport } from './support/WaitlistSupport';
import { ChooseImage } from './choose-image/ChooseImage';

export const LoginPage = Login;
export const StatisticsPage = Statistics;
export const ContractsPage = CreateContract;
export const WaitlistPage = Waitlist;
export const ReviewPage = DisplayReviews;
export const SupportPage = WaitlistSupport;
export const ChooseImagePage = ChooseImage;

export const LazyAdminMenu = AdminMenu;
