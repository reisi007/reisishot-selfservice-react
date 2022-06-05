export type LoginData = { user: string, auth: string };

export function withLoginData(loginData: LoginData | undefined, children: (loginData: LoginData) => JSX.Element): JSX.Element {
  return (
    <>
      {loginData !== undefined && children(loginData)}
    </>
  );
}

export type LoginDataProps = { loginData: LoginData };
