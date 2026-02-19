/**
 * Mock Data Configuration
 *
 * Configuration for controlling mock data mode.
 */

import { Config } from 'effect';

/**
 * Data Mode Configuration
 *
 * USE_MOCK_DATA environment variable controls mock mode:
 * - "true" or "1": Force mock mode (no database)
 * - "false" or "0": Force real database (will fail if unavailable)
 * - "auto" (default): Try real database, fallback to mock if unavailable
 */
export const DataModeConfig = Config.string('USE_MOCK_DATA').pipe(
  Config.orElse(() => Config.succeed('auto'))
);

/**
 * Check if mock mode is explicitly enabled
 */
export const isMockEnabled = Config.map(DataModeConfig, (mode) =>
  mode === 'true' || mode === '1' || mode === 'mock'
);

/**
 * Check if fallback mode is enabled (try real, fallback to mock)
 */
export const isFallbackEnabled = Config.map(
  DataModeConfig,
  (mode) => mode === 'auto' || mode === 'fallback'
);

/**
 * Check if real database is required (no fallback)
 */
export const isRealRequired = Config.map(
  DataModeConfig,
  (mode) => mode === 'false' || mode === '0' || mode === 'real'
);
