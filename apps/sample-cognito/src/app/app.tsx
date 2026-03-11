import { FormEvent, useEffect, useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import {
  type AuthTokens,
  authenticate,
  completeNewPassword,
  type CognitoConfig,
} from "./cognito";

const configStorageKey = "sample-cognito-admin-config";

const defaultConfig: CognitoConfig = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "",
  clientId: import.meta.env.VITE_COGNITO_ADMIN_CLIENT_ID ?? "",
};

const readStoredConfig = (): CognitoConfig => {
  const storedValue = window.localStorage.getItem(configStorageKey);
  if (!storedValue) {
    return defaultConfig;
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<CognitoConfig>;
    return {
      userPoolId: parsed.userPoolId ?? defaultConfig.userPoolId,
      clientId: parsed.clientId ?? defaultConfig.clientId,
    };
  } catch {
    return defaultConfig;
  }
};

type ChallengeState = {
  cognitoUser: CognitoUser;
  requiredAttributes: Record<string, string>;
};

export function App() {
  const [config, setConfig] = useState<CognitoConfig>(readStoredConfig);
  const [bootstrapUsername, setBootstrapUsername] = useState("");
  const [bootstrapPassword, setBootstrapPassword] = useState("");
  const [returningUsername, setReturningUsername] = useState("");
  const [returningPassword, setReturningPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [challenge, setChallenge] = useState<ChallengeState | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [status, setStatus] = useState("Choose a login path and authenticate against the admin app client.");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(configStorageKey, JSON.stringify(config));
  }, [config]);

  const runAuthentication = async (
    username: string,
    password: string,
    mode: "bootstrap" | "returning",
  ) => {
    setIsSubmitting(true);
    setError("");
    setTokens(null);
    setChallenge(null);

    try {
      const result = await authenticate(config, username, password);

      if (result.type === "newPasswordRequired") {
        setChallenge({
          cognitoUser: result.cognitoUser,
          requiredAttributes: result.requiredAttributes,
        });
        setStatus(
          mode === "returning"
            ? "This user is still in first-login state. Complete the force-change-password step below."
            : "Cognito requires a new password before the first sign-in can complete.",
        );
        return;
      }

      setTokens(result.tokens);
      setStatus(
        mode === "returning"
          ? "Authenticated with the permanent password. Fresh Cognito tokens are shown below."
          : "Authenticated successfully. Tokens returned from Cognito are shown below.",
      );
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Authentication failed.";
      setError(message);
      setStatus(mode === "returning" ? "Token generation failed." : "Login failed.");
    } finally {
      setIsSubmitting(false);
    };
  };

  const handleBootstrapLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAuthentication(bootstrapUsername, bootstrapPassword, "bootstrap");
  };

  const handleReturningLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAuthentication(returningUsername, returningPassword, "returning");
  };

  const handleCompletePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!challenge) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const nextTokens = await completeNewPassword(
        challenge.cognitoUser,
        newPassword,
        challenge.requiredAttributes,
      );

      setTokens(nextTokens);
      setChallenge(null);
      setBootstrapPassword("");
      setNewPassword("");
      setStatus("Password updated and sign-in completed.");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Password update failed.";
      setError(message);
      setStatus("New password challenge failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTokens(null);
    setChallenge(null);
    setError("");
    setStatus("Choose a login path and authenticate against the admin app client.");
    setBootstrapUsername("");
    setBootstrapPassword("");
    setReturningUsername("");
    setReturningPassword("");
    setNewPassword("");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Admin Cognito Sandbox</p>
          <h1>Direct username and password login against the shared admin user pool.</h1>
          <p className="lead">
            This screen authenticates directly with Cognito, handles the
            <code> NEW_PASSWORD_REQUIRED </code>
            challenge, and prints the ID, access, and refresh tokens returned by Cognito.
          </p>
        </div>

        <div className="status-panel">
          <span className="status-label">Status</span>
          <p>{status}</p>
          {error ? <p className="status-error">{error}</p> : null}
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Pool Configuration</h2>
            <p>Use Vite env vars or edit the values here. They are stored in local storage.</p>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>User Pool ID</span>
              <input
                value={config.userPoolId}
                onChange={(event) =>
                  setConfig((current) => ({
                    ...current,
                    userPoolId: event.target.value,
                  }))
                }
                placeholder="ap-south-1_XXXXXXXXX"
              />
            </label>

            <label className="field">
              <span>Admin App Client ID</span>
              <input
                value={config.clientId}
                onChange={(event) =>
                  setConfig((current) => ({
                    ...current,
                    clientId: event.target.value,
                  }))
                }
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </label>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>First Login</h2>
            <p>
              Use this section for a console-created user with a temporary password. If Cognito
              requires a password reset, the challenge panel will open below.
            </p>
          </div>

          <form className="stack" onSubmit={handleBootstrapLogin}>
            <label className="field">
              <span>Username</span>
              <input
                value={bootstrapUsername}
                onChange={(event) => setBootstrapUsername(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={bootstrapPassword}
                onChange={(event) => setBootstrapPassword(event.target.value)}
                placeholder="Temporary password from Cognito"
                autoComplete="current-password"
              />
            </label>

            <div className="button-row">
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Checking..." : "Start first login"}
              </button>
              <button className="ghost-button" type="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Generate Tokens</h2>
            <p>
              Use this section for a user who has already completed the force-change-password
              challenge and now has a permanent password.
            </p>
          </div>

          <form className="stack" onSubmit={handleReturningLogin}>
            <label className="field">
              <span>Username</span>
              <input
                value={returningUsername}
                onChange={(event) => setReturningUsername(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span>Permanent Password</span>
              <input
                type="password"
                value={returningPassword}
                onChange={(event) => setReturningPassword(event.target.value)}
                placeholder="Current permanent password"
                autoComplete="current-password"
              />
            </label>

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Get tokens"}
            </button>
          </form>
        </div>

        {challenge ? (
          <div className="panel">
            <div className="panel-header">
              <h2>Force Change Password</h2>
              <p>
                The user is in Cognito&apos;s first-login challenge state. Set a new password to
                finish authentication.
              </p>
            </div>

            <form className="stack" onSubmit={handleCompletePassword}>
              <label className="field">
                <span>New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter a new permanent password"
                  autoComplete="new-password"
                />
              </label>

              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Complete challenge"}
              </button>
            </form>
          </div>
        ) : null}

        <div className="panel token-panel">
          <div className="panel-header">
            <h2>Cognito Tokens</h2>
            <p>The raw tokens returned from Cognito are shown below for inspection.</p>
          </div>

          <div className="token-stack">
            <div className="token-block">
              <span>ID Token</span>
              <pre>{tokens?.idToken ?? "No token yet."}</pre>
            </div>

            <div className="token-block">
              <span>Access Token</span>
              <pre>{tokens?.accessToken ?? "No token yet."}</pre>
            </div>

            <div className="token-block">
              <span>Refresh Token</span>
              <pre>{tokens?.refreshToken ?? "No token yet."}</pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
