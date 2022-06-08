import { LoginData } from './LoginData';

export function computeContractLink({
  user,
  auth,
}: LoginData) {
  return `${window.location.protocol}//${window.location.host}/contracts/${user}/${auth}`;
}
