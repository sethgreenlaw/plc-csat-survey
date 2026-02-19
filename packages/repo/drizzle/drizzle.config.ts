import { defineConfig } from 'drizzle-kit';
import { Effect, Redacted } from 'effect';
import { DrizzleConfig } from '../src/sql.js';

/**
 * Drizzle Kit Configuration
 *
 * Used by drizzle-kit for migrations and schema management.
 */
export default Effect.runSync(
  Effect.map(DrizzleConfig, (dbConfig) =>
    defineConfig({
      schema: './src/schema.ts',
      out: './drizzle',
      dialect: 'postgresql',
      dbCredentials: {
        host: dbConfig.host,
        port: dbConfig.port,
        ssl: dbConfig.ssl,
        user: dbConfig.username,
        password: dbConfig.password ? Redacted.value(dbConfig.password) : undefined,
        database: dbConfig.database
      }
    })
  )
);
