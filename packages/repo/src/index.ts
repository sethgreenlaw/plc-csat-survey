// SQL Layer
export { DrizzleConfig, RealSqlLive, SqlLive, getDrizzleKitConfig } from './sql.js';

// Mock Data
export {
  MockDataStore,
  MockSqlLive,
  MockPgDrizzleLive,
  DataModeConfig,
  isMockEnabled,
  isFallbackEnabled,
  isRealRequired,
  seedAllMockData,
  createSeedId,
  seedTimestamp,
  type MockRecord,
  type MockStore
} from './mock/index.js';
