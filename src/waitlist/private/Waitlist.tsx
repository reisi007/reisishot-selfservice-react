import { LoginData } from '../../admin/login/LoginData';

export function Waitlist({ loginData }: { loginData: LoginData }) {
  const { user } = loginData;
  return (
    <h1>
      Waitlist
      {user}
    </h1>
  );
}
