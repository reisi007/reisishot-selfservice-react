export type LoginData = { user: string, auth: string }

export function withLoginData(loginData: LoginData | undefined, withLoginData: (loginData: LoginData) => JSX.Element): JSX.Element {
  return <>
    {loginData !== undefined && withLoginData(loginData)}
  </>;
}

export type LoginDataProps = { loginData: LoginData }
