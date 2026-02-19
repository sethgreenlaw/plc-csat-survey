/**
 * Mock Data Store
 *
 * In-memory data store for mock mode. Provides simple CRUD operations
 * organized by table name.
 */

import { Effect, Option, Ref } from 'effect';

/**
 * Type for a single record in the store
 */
export type MockRecord = Record<string, unknown> & { id: string };

/**
 * Type for the entire data store
 */
export type MockStore = Map<string, MockRecord[]>;

/**
 * MockDataStore Service
 *
 * Provides in-memory data storage for mock mode.
 * Data persists for the lifetime of the application.
 */
export class MockDataStore extends Effect.Service<MockDataStore>()('MockDataStore', {
  effect: Effect.gen(function* () {
    const storeRef = yield* Ref.make<MockStore>(new Map());

    return {
      /**
       * Seed data for a table (replaces existing data)
       */
      seed: (tableName: string, data: MockRecord[]) =>
        Ref.update(storeRef, (store) => {
          const newStore = new Map(store);
          newStore.set(tableName, data);
          return newStore;
        }),

      /**
       * Get all records from a table
       */
      findAll: <T extends MockRecord>(tableName: string) =>
        Effect.map(Ref.get(storeRef), (store) => (store.get(tableName) ?? []) as T[]),

      /**
       * Find record by ID
       */
      findById: <T extends MockRecord>(tableName: string, id: string) =>
        Effect.map(Ref.get(storeRef), (store) => {
          const records = store.get(tableName) ?? [];
          return Option.fromNullable(records.find((r) => r.id === id) as T | undefined);
        }),

      /**
       * Find records matching a predicate
       */
      findWhere: <T extends MockRecord>(tableName: string, predicate: (record: T) => boolean) =>
        Effect.map(Ref.get(storeRef), (store) => {
          const records = store.get(tableName) ?? [];
          return records.filter((r) => predicate(r as T)) as T[];
        }),

      /**
       * Insert a record (auto-generates ID if not provided)
       */
      insert: <T extends MockRecord>(tableName: string, data: Omit<T, 'id'> & { id?: string }) => {
        const now = new Date().toISOString();
        const record = {
          ...data,
          id: data.id ?? crypto.randomUUID(),
          createdAt: (data as Record<string, unknown>).createdAt ?? now,
          updatedAt: (data as Record<string, unknown>).updatedAt ?? now
        } as unknown as T;

        return Effect.as(
          Ref.update(storeRef, (store) => {
            const newStore = new Map(store);
            const records = newStore.get(tableName) ?? [];
            newStore.set(tableName, [...records, record as MockRecord]);
            return newStore;
          }),
          record
        );
      },

      /**
       * Update a record by ID
       */
      update: <T extends MockRecord>(tableName: string, id: string, data: Partial<T>) => {
        const now = new Date().toISOString();

        return Effect.gen(function* () {
          let updated: T | undefined;

          yield* Ref.update(storeRef, (store) => {
            const newStore = new Map(store);
            const records = newStore.get(tableName) ?? [];
            const index = records.findIndex((r) => r.id === id);

            if (index >= 0) {
              updated = {
                ...records[index],
                ...data,
                updatedAt: now
              } as unknown as T;
              const newRecords = [...records];
              newRecords[index] = updated as MockRecord;
              newStore.set(tableName, newRecords);
            }

            return newStore;
          });

          return Option.fromNullable(updated);
        });
      },

      /**
       * Delete a record by ID
       */
      delete: (tableName: string, id: string) =>
        Effect.gen(function* () {
          let deleted = false;

          yield* Ref.update(storeRef, (store) => {
            const newStore = new Map(store);
            const records = newStore.get(tableName) ?? [];
            const filtered = records.filter((r) => r.id !== id);
            deleted = filtered.length < records.length;
            newStore.set(tableName, filtered);
            return newStore;
          });

          return deleted;
        }),

      /**
       * Count records in a table
       */
      count: (tableName: string, predicate?: (record: MockRecord) => boolean) =>
        Effect.map(Ref.get(storeRef), (store) => {
          const records = store.get(tableName) ?? [];
          return predicate ? records.filter(predicate).length : records.length;
        }),

      /**
       * Clear all data from a table
       */
      clear: (tableName: string) =>
        Ref.update(storeRef, (store) => {
          const newStore = new Map(store);
          newStore.delete(tableName);
          return newStore;
        }),

      /**
       * Clear all data from all tables
       */
      clearAll: () => Ref.set(storeRef, new Map())
    };
  }),
  dependencies: []
}) {}
