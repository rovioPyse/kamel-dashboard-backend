import { readFileSync } from "node:fs";
import type { Context } from "aws-lambda";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import {
  Pool,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from "pg";

export type DbSecret = {
  username?: string;
  password: string;
  engine?: string;
  host?: string;
  port?: number;
  dbname?: string;
};

const REGION = process.env.AWS_REGION || "ap-south-1";
const DB_SECRET_ARN = mustGetEnv("DB_SECRET_ARN");
const DB_HOST = mustGetEnv("DB_HOST");
const DB_PORT = Number(process.env.DB_PORT || "5432");
const DB_NAME = mustGetEnv("DB_NAME");
const DB_USER = mustGetEnv("DB_USER");
const DB_SSL_CA_PATH = process.env.DB_SSL_CA_PATH || "/certs/global-bundle.pem";
const DB_POOL_MAX = Number(process.env.DB_POOL_MAX || "1");
const DB_IDLE_TIMEOUT_MS = Number(process.env.DB_IDLE_TIMEOUT_MS || "30000");
const DB_CONNECTION_TIMEOUT_MS = Number(
  process.env.DB_CONNECTION_TIMEOUT_MS || "5000"
);
const DB_STATEMENT_TIMEOUT_MS = Number(
  process.env.DB_STATEMENT_TIMEOUT_MS || "15000"
);
const DB_QUERY_TIMEOUT_MS = Number(process.env.DB_QUERY_TIMEOUT_MS || "15000");
const DB_SECRET_CACHE_TTL_MS = Number(
  process.env.DB_SECRET_CACHE_TTL_MS || "300000"
);

const secretsManager = new SecretsManagerClient({ region: REGION });

let pool: Pool | null = null;
let poolInitPromise: Promise<Pool> | null = null;

let cachedSecret: DbSecret | null = null;
let cachedSecretExpiresAt = 0;
let secretFetchPromise: Promise<DbSecret> | null = null;

function mustGetEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readCaCert(): string {
  return readFileSync(DB_SSL_CA_PATH, "utf8");
}

async function fetchSecret(): Promise<DbSecret> {
  const now = Date.now();

  if (cachedSecret && now < cachedSecretExpiresAt) {
    return cachedSecret;
  }

  if (secretFetchPromise) {
    return secretFetchPromise;
  }

  secretFetchPromise = (async () => {
    const response = await secretsManager.send(
      new GetSecretValueCommand({
        SecretId: DB_SECRET_ARN,
      })
    );

    if (!response.SecretString) {
      throw new Error("Secrets Manager returned empty SecretString");
    }

    const parsed = JSON.parse(response.SecretString) as DbSecret;

    if (!parsed.password) {
      throw new Error('Secret is missing "password"');
    }

    cachedSecret = parsed;
    cachedSecretExpiresAt = Date.now() + DB_SECRET_CACHE_TTL_MS;

    return parsed;
  })();

  try {
    return await secretFetchPromise;
  } finally {
    secretFetchPromise = null;
  }
}

function resetSecretCache(): void {
  cachedSecret = null;
  cachedSecretExpiresAt = 0;
  secretFetchPromise = null;
}

async function destroyPool(): Promise<void> {
  const current = pool;
  pool = null;
  poolInitPromise = null;

  if (!current) {
    return;
  }

  try {
    await current.end();
  } catch (error) {
    console.warn("Failed to close existing pool cleanly", error);
  }
}

function isCredentialError(error: unknown): boolean {
  const err = error as { code?: string; message?: string } | undefined;
  const message = (err?.message || "").toLowerCase();
  const code = err?.code || "";

  return (
    code === "28P01" ||
    message.includes("password authentication failed") ||
    message.includes("no pg_hba.conf entry")
  );
}

function isConnectionError(error: unknown): boolean {
  const err = error as { code?: string; message?: string } | undefined;
  const message = (err?.message || "").toLowerCase();
  const code = err?.code || "";

  return (
    ["57P01", "57P02", "57P03", "ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EPIPE"].includes(
      code
    ) ||
    message.includes("connection terminated unexpectedly") ||
    message.includes("terminating connection due to administrator command") ||
    message.includes("the database system is shutting down") ||
    message.includes("timeout expired")
  );
}

async function createPool(): Promise<Pool> {
  const secret = await fetchSecret();

  const nextPool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: secret.password,
    max: DB_POOL_MAX,
    min: 0,
    idleTimeoutMillis: DB_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: DB_CONNECTION_TIMEOUT_MS,
    allowExitOnIdle: true,
    ssl: {
      rejectUnauthorized: true,
      ca: readCaCert(),
    },
    keepAlive: true,
    statement_timeout: DB_STATEMENT_TIMEOUT_MS,
    query_timeout: DB_QUERY_TIMEOUT_MS,
    application_name: process.env.AWS_LAMBDA_FUNCTION_NAME || "lambda-pg",
  });

  nextPool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error", error);
  });

  return nextPool;
}

export async function getPool(): Promise<Pool> {
  if (pool) {
    return pool;
  }

  if (poolInitPromise) {
    return poolInitPromise;
  }

  poolInitPromise = (async () => {
    const createdPool = await createPool();
    pool = createdPool;
    return createdPool;
  })();

  try {
    return await poolInitPromise;
  } catch (error) {
    poolInitPromise = null;
    throw error;
  }
}

async function getFreshPoolAfterReconnect(): Promise<Pool> {
  await destroyPool();
  resetSecretCache();
  return getPool();
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: readonly unknown[] = []
): Promise<QueryResult<T>> {
  try {
    const currentPool = await getPool();
    return await currentPool.query<T>(text, [...params]);
  } catch (error) {
    if (isCredentialError(error) || isConnectionError(error)) {
      const freshPool = await getFreshPoolAfterReconnect();
      return freshPool.query<T>(text, [...params]);
    }

    throw error;
  }
}

export async function withClient<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  let client: PoolClient | null = null;

  try {
    const currentPool = await getPool();
    client = await currentPool.connect();
    return await fn(client);
  } catch (error) {
    if (client) {
      try {
        client.release(true);
      } catch {
        // Ignore release failures after a broken connection.
      }

      client = null;
    }

    if (isCredentialError(error) || isConnectionError(error)) {
      const freshPool = await getFreshPoolAfterReconnect();
      client = await freshPool.connect();

      try {
        return await fn(client);
      } finally {
        client.release();
      }
    }

    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  return withClient(async (client) => {
    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("ROLLBACK failed", rollbackError);
      }

      throw error;
    }
  });
}

export async function one<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: readonly unknown[] = []
): Promise<T> {
  const result = await query<T>(text, params);

  if (result.rowCount !== 1) {
    throw new Error(`Expected 1 row, got ${result.rowCount}`);
  }

  return result.rows[0];
}

export async function closePool(): Promise<void> {
  await destroyPool();
}

export function prepareLambdaDatabaseContext(context: Context): void {
  context.callbackWaitsForEmptyEventLoop = false;
}
