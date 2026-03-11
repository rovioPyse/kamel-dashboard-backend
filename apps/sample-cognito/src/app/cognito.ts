import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
  type ICognitoUserPoolData,
} from "amazon-cognito-identity-js";

export interface CognitoConfig {
  userPoolId: string;
  clientId: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface LoginResultSuccess {
  type: "success";
  tokens: AuthTokens;
}

export interface LoginResultNewPassword {
  type: "newPasswordRequired";
  cognitoUser: CognitoUser;
  requiredAttributes: Record<string, string>;
}

export type LoginResult = LoginResultSuccess | LoginResultNewPassword;

const createUserPool = (config: CognitoConfig): CognitoUserPool =>
  new CognitoUserPool({
    UserPoolId: config.userPoolId.trim(),
    ClientId: config.clientId.trim(),
  } satisfies ICognitoUserPoolData);

const toTokens = (session: CognitoUserSession): AuthTokens => ({
  accessToken: session.getAccessToken().getJwtToken(),
  idToken: session.getIdToken().getJwtToken(),
  refreshToken: session.getRefreshToken().getToken(),
});

export const authenticate = (
  config: CognitoConfig,
  username: string,
  password: string,
): Promise<LoginResult> =>
  new Promise((resolve, reject) => {
    const userPool = createUserPool(config);
    const cognitoUser = new CognitoUser({
      Username: username.trim(),
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username.trim(),
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve({
          type: "success",
          tokens: toTokens(session),
        });
      },
      onFailure: (error) => {
        reject(error);
      },
      newPasswordRequired: (userAttributes) => {
        resolve({
          type: "newPasswordRequired",
          cognitoUser,
          requiredAttributes: {},
        });
      },
    });
  });

export const completeNewPassword = (
  cognitoUser: CognitoUser,
  newPassword: string,
  requiredAttributes: Record<string, string>,
): Promise<AuthTokens> =>
  new Promise((resolve, reject) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, requiredAttributes, {
      onSuccess: (session) => {
        resolve(toTokens(session));
      },
      onFailure: (error) => {
        reject(error);
      },
    });
  });
