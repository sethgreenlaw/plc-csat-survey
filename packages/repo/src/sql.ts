import * as PgDrizzle from '@effect/sql-drizzle/Pg';
import { PgClient } from '@effect/sql-pg';
import { Config, Layer, Redacted } from 'effect';
import { DataModeConfig, MockSqlLive, seedAllMockData } from './mock/index.js';

/**
 * Database Configuration
 *
 * Reads database connection settings from environment variables.
 * All DB_* prefixed environment variables are used.
 */
export const DrizzleConfig = Config.nested('DB')(
  Config.all({
    database: Config.string('DATABASE'),
    username: Config.string('USERNAME'),
    password: Config.redacted('PASSWORD').pipe(Config.orElse(() => Config.succeed(undefined))),
    host: Config.string('HOST'),
    port: Config.integer('PORT').pipe(Config.orElse(() => Config.succeed(5432))),
    ssl: Config.boolean('SSL').pipe(Config.orElse(() => Config.succeed(undefined))),
    applicationName: Config.string('APPLICATION_NAME').pipe(
      Config.orElse(() => Config.succeed(undefined))
    )
  })
);

/**
 * PostgreSQL Client Layer
 *
 * Creates a connection pool to PostgreSQL using Effect SQL.
 */
const PgLive = PgClient.layerConfig(DrizzleConfig);

/**
 * Drizzle ORM Layer
 *
 * Provides Drizzle ORM integration with snake_case column naming.
 */
const DrizzleLive = PgDrizzle.layerWithConfig({
  casing: 'snake_case'
}).pipe(Layer.provide(PgLive));

/**
 * Real Database SQL Layer
 *
 * Provides both the raw PgClient and Drizzle ORM access.
 */
export const RealSqlLive = Layer.mergeAll(PgLive, DrizzleLive);

/**
 * Seeding Layer
 *
 * Runs seed function when MockSqlLive is used.
 */
const SeedingLayer = Layer.effectDiscard(seedAllMockData());

/**
 * Mock SQL Layer with seeding
 *
 * Provides mock data store with automatic seeding.
 */
const MockSqlLiveWithSeed = SeedingLayer.pipe(Layer.provide(MockSqlLive), Layer.provideMerge(MockSqlLive));

/**
 * SQL Layer with Fallback
 *
 * Behavior controlled by USE_MOCK_DATA environment variable:
 * - "true" or "mock": Use mock data only (no database connection)
 * - "false" or "real": Use real database only (fails if unavailable)
 * - "auto" (default): Try real database, fallback to mock if unavailable
 */
export const SqlLive = Layer.unwrapEffect(
  Config.map(DataModeConfig, (mode) => {
    // Force mock mode
    if (mode === 'true' || mode === '1' || mode === 'mock') {
      console.log('[SqlLive] Mock mode enabled via USE_MOCK_DATA');
      return MockSqlLiveWithSeed;
    }

    // Force real database (no fallback)
    if (mode === 'false' || mode === '0' || mode === 'real') {
      console.log('[SqlLive] Real database mode enabled');
      return RealSqlLive;
    }

    // Auto mode: try real, fallback to mock
    console.log('[SqlLive] Auto mode: trying real database with mock fallback');
    return Layer.catchAll(RealSqlLive, (error) => {
      console.log('[SqlLive] Database unavailable, falling back to mock mode');
      console.log('[SqlLive] Error:', error instanceof Error ? error.message : JSON.stringify(error));
      return MockSqlLiveWithSeed;
    });
  })
);

/**
 * Helper to get Drizzle config values for drizzle-kit
 */
export const getDrizzleKitConfig = () => {
  const config = Config.map(DrizzleConfig, (c) => ({
    host: c.host,
    port: c.port,
    ssl: c.ssl,
    user: c.username,
    password: c.password ? Redacted.value(c.password) : undefined,
    database: c.database
  }));
  return config;
};

// Note: MockDataStore and MockSqlLive are exported from ./mock/index.js
