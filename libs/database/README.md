# database

Aurora PostgreSQL helpers for Lambda workloads.

## Exports

- `getPool()` returns the shared module-scoped `pg` pool.
- `query()` runs parameterized SQL with one reconnect/auth retry.
- `withClient()` checks out a pooled client for advanced flows.
- `withTransaction()` wraps a callback in `BEGIN` / `COMMIT` / `ROLLBACK`.
- `one()` asserts that exactly one row was returned.
- `closePool()` is for tests and local scripts only.
- `prepareLambdaDatabaseContext()` sets `callbackWaitsForEmptyEventLoop = false`.

## Required environment variables

- `DB_SECRET_ARN`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_SSL_CA_PATH`
- `DB_POOL_MAX`
- `DB_IDLE_TIMEOUT_MS`
- `DB_CONNECTION_TIMEOUT_MS`
- `DB_STATEMENT_TIMEOUT_MS`
- `DB_QUERY_TIMEOUT_MS`
- `DB_SECRET_CACHE_TTL_MS`
