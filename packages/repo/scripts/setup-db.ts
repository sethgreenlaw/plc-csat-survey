/**
 * Database Setup Script
 *
 * Creates the database and user if they don't exist.
 * Run with: bun run db:setup
 *
 * Requires PostgreSQL credentials in environment:
 * - DB_HOST
 * - DB_PORT
 * - DB_USERNAME (target user to create)
 * - DB_PASSWORD (target user password)
 * - DB_DATABASE (target database to create)
 */

import { PgClient } from '@effect/sql-pg';
import { Config, Effect, Layer, Redacted } from 'effect';

// Admin config connects to 'postgres' database as 'postgres' user
const AdminConfig = Config.all({
  host: Config.string('DB_HOST').pipe(Config.withDefault('127.0.0.1')),
  port: Config.integer('DB_PORT').pipe(Config.withDefault(5432)),
  username: Config.succeed('postgres'),
  password: Config.redacted('DB_ADMIN_PASSWORD').pipe(
    Config.orElse(() => Config.redacted('DB_PASSWORD')),
    Config.orElse(() => Config.succeed(Redacted.make('postgres')))
  ),
  database: Config.succeed('postgres')
});

const TargetConfig = Config.all({
  database: Config.string('DB_DATABASE'),
  username: Config.string('DB_USERNAME'),
  password: Config.string('DB_PASSWORD').pipe(Config.withDefault(''))
});

const program = Effect.gen(function* () {
  const target = yield* TargetConfig;
  const client = yield* PgClient.PgClient;

  console.log(`Setting up database: ${target.database}`);

  // Check if user exists
  const userExists = yield* client.unsafe(`SELECT 1 FROM pg_roles WHERE rolname = '${target.username}'`);

  if (userExists.length === 0) {
    console.log(`Creating user: ${target.username}`);
    yield* client.unsafe(`CREATE USER "${target.username}" WITH PASSWORD '${target.password}'`);
  } else {
    console.log(`User ${target.username} already exists, updating password`);
    yield* client.unsafe(`ALTER USER "${target.username}" WITH PASSWORD '${target.password}'`);
  }

  // Check if database exists
  const dbExists = yield* client.unsafe(`SELECT 1 FROM pg_database WHERE datname = '${target.database}'`);

  if (dbExists.length === 0) {
    console.log(`Creating database: ${target.database}`);
    yield* client.unsafe(`CREATE DATABASE "${target.database}" OWNER "${target.username}"`);
  } else {
    console.log(`Database ${target.database} already exists`);
  }

  // Grant privileges
  yield* client.unsafe(`GRANT ALL PRIVILEGES ON DATABASE "${target.database}" TO "${target.username}"`);

  console.log('Database setup complete!');
});

const AdminPgLive = PgClient.layerConfig(AdminConfig);

Effect.runPromise(program.pipe(Effect.provide(AdminPgLive)))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Database setup failed:', err);
    process.exit(1);
  });
