import { Client as OktaClient } from '@okta/okta-sdk-nodejs';
import OktaAuth from '@okta/okta-auth-js';

const { OKTA_DOMAIN, OKTA_APP_TOKEN } = process.env;

const oktaClient = new OktaClient({
  orgUrl: OKTA_DOMAIN,
  token: OKTA_APP_TOKEN,
});

const oktaAuthClient = new OktaAuth({
  issuer: `${OKTA_DOMAIN}/oauth2/default`,
});

export interface IRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IRegistrationResponse {
  id: string;
}

export async function register(registerData: IRegisterData): Promise<IRegistrationResponse> {
  const { email, firstName, lastName, password } = registerData;
  const createdUser = await oktaClient.createUser({
    profile: { email, login: email, firstName, lastName },
    credentials: { password : { value: password } }
  });

  return createdUser;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ISession {
  sessionId: string;
  userId: string;
  userEmail: string;
}

export async function sessionLogin(loginData: ILoginData): Promise<ISession> {
  const { email: username, password } = loginData;
  const { sessionToken } = await oktaAuthClient.signIn({ username, password });

  const session = await oktaClient.createSession({ sessionToken });
  const { login, id, userId } = session;

  return { sessionId: id, userEmail: login, userId };
}

export async function getSessionBySessionId(sessionId: string): Promise<ISession> {
  const session = await oktaClient.getSession(sessionId);
  const { login, id, userId } = session;

  return { sessionId: id, userEmail: login, userId };
}
