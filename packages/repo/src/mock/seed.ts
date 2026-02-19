/**
 * Mock Data Seeding
 *
 * Functions to seed mock data for development and testing.
 * Add your entity seed functions here.
 */

import { Effect } from 'effect';
import { MockDataStore } from './MockDataStore.js';

/**
 * Seed all mock data
 *
 * Call this function to populate the mock data store with sample data.
 * Add your entity seeding functions below.
 *
 * IMPORTANT: This function requires MockDataStore in the Effect context.
 * When seeding, ensure MockDataStore.Default is provided in the layer.
 */
export const seedAllMockData = Effect.fn('seedAllMockData')(function* () {
  // Ensure MockDataStore is initialized
  yield* MockDataStore;

  // Add your entity seeds here. Example:
  // const store = yield* MockDataStore;
  // yield* store.seed('users', sampleUsers);
  // yield* store.seed('tasks', sampleTasks);

  console.log('[MockData] Mock data seeded successfully');
});

/**
 * Example: User seed data
 *
 * Uncomment and customize for your entities:
 */
// export const sampleUsers = [
//   {
//     id: '550e8400-e29b-41d4-a716-446655440001',
//     email: 'admin@example.gov',
//     name: 'Admin User',
//     role: 'admin',
//     createdAt: '2024-01-01T00:00:00Z',
//     updatedAt: '2024-01-01T00:00:00Z'
//   },
//   {
//     id: '550e8400-e29b-41d4-a716-446655440002',
//     email: 'user@example.gov',
//     name: 'Regular User',
//     role: 'user',
//     createdAt: '2024-01-01T00:00:00Z',
//     updatedAt: '2024-01-01T00:00:00Z'
//   }
// ];

/**
 * Helper to create seed data with UUIDs
 */
export const createSeedId = (index: number, prefix = '550e8400-e29b-41d4-a716-4466554400'): string =>
  `${prefix}${index.toString().padStart(2, '0')}`;

/**
 * Helper to create timestamp for seed data
 */
export const seedTimestamp = (daysAgo = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};
