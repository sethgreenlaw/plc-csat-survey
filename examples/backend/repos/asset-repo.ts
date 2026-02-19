/**
 * Asset Repository Example (Drizzle ORM)
 *
 * Repository pattern implementation for asset management
 * using Drizzle ORM with Effect-TS integration.
 *
 * Based on OpenGov EAM domain.
 */

import { pgTable, text, timestamp, uuid, numeric, jsonb } from 'drizzle-orm/pg-core';
import { eq, and, or, ilike, sql } from 'drizzle-orm';
import { Effect, Option } from 'effect';
import { PgDrizzle } from '@effect/sql-drizzle/Pg';

// ============================================================================
// Drizzle Schema Definition
// ============================================================================

/**
 * Assets Table
 *
 * Stores infrastructure and fixed assets for government agencies.
 */
export const assets = pgTable('assets', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  agencyId: uuid('agency_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  assetType: text('asset_type').notNull(), // 'fixed' | 'infrastructure'
  assetCode: text('asset_code').notNull().unique(),
  parentAssetId: uuid('parent_asset_id'),
  locationId: uuid('location_id'),
  condition: text('condition').notNull(), // 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  acquisitionDate: timestamp('acquisition_date', { withTimezone: true, mode: 'string' }),
  acquisitionCost: numeric('acquisition_cost'),
  currentValue: numeric('current_value'),
  warrantyExpiration: timestamp('warranty_expiration', { withTimezone: true, mode: 'string' }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

/**
 * Type exports for the assets table
 */
export type AssetRow = typeof assets.$inferSelect;
export type AssetInsert = typeof assets.$inferInsert;

// ============================================================================
// Repository Service
// ============================================================================

/**
 * Asset filter parameters
 */
interface AssetFilter {
  agencyId?: string;
  assetType?: 'fixed' | 'infrastructure';
  condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  parentAssetId?: string | null;
  search?: string;
}

/**
 * Pagination parameters
 */
interface Pagination {
  limit?: number;
  offset?: number;
}

/**
 * AssetRepo Service
 *
 * Provides data access methods for asset management.
 * Uses Effect.fn pattern for type-safe, composable operations.
 */
export class AssetRepo extends Effect.Service<AssetRepo>()('AssetRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;

    return {
      /**
       * Find all assets with optional filtering and pagination
       */
      findAll: Effect.fn('AssetRepo.findAll')(function* (
        filter: AssetFilter = {},
        pagination: Pagination = {}
      ) {
        const { limit = 50, offset = 0 } = pagination;
        const conditions = [];

        if (filter.agencyId) {
          conditions.push(eq(assets.agencyId, filter.agencyId));
        }
        if (filter.assetType) {
          conditions.push(eq(assets.assetType, filter.assetType));
        }
        if (filter.condition) {
          conditions.push(eq(assets.condition, filter.condition));
        }
        if (filter.parentAssetId !== undefined) {
          conditions.push(
            filter.parentAssetId === null
              ? sql`${assets.parentAssetId} IS NULL`
              : eq(assets.parentAssetId, filter.parentAssetId)
          );
        }
        if (filter.search) {
          conditions.push(
            or(
              ilike(assets.name, `%${filter.search}%`),
              ilike(assets.assetCode, `%${filter.search}%`)
            )
          );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, countResult] = yield* Effect.all([
          drizzle
            .select()
            .from(assets)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(assets.name),
          drizzle
            .select({ count: sql<number>`count(*)::int` })
            .from(assets)
            .where(whereClause)
        ]);

        return {
          data,
          total: countResult[0]?.count ?? 0,
          limit,
          offset
        };
      }),

      /**
       * Find asset by ID
       */
      findById: Effect.fn('AssetRepo.findById')(function* (id: string) {
        const result = yield* drizzle
          .select()
          .from(assets)
          .where(eq(assets.id, id));
        return Option.fromNullable(result[0]);
      }),

      /**
       * Find assets by asset code
       */
      findByCode: Effect.fn('AssetRepo.findByCode')(function* (code: string) {
        const result = yield* drizzle
          .select()
          .from(assets)
          .where(eq(assets.assetCode, code));
        return Option.fromNullable(result[0]);
      }),

      /**
       * Find child assets (for hierarchy)
       */
      findChildren: Effect.fn('AssetRepo.findChildren')(function* (
        parentId: string,
        pagination: Pagination = {}
      ) {
        const { limit = 50, offset = 0 } = pagination;
        return yield* drizzle
          .select()
          .from(assets)
          .where(eq(assets.parentAssetId, parentId))
          .limit(limit)
          .offset(offset)
          .orderBy(assets.name);
      }),

      /**
       * Find root assets (no parent)
       */
      findRootAssets: Effect.fn('AssetRepo.findRootAssets')(function* (
        agencyId: string,
        pagination: Pagination = {}
      ) {
        const { limit = 50, offset = 0 } = pagination;
        return yield* drizzle
          .select()
          .from(assets)
          .where(
            and(
              eq(assets.agencyId, agencyId),
              sql`${assets.parentAssetId} IS NULL`
            )
          )
          .limit(limit)
          .offset(offset)
          .orderBy(assets.name);
      }),

      /**
       * Insert new asset
       */
      insert: Effect.fn('AssetRepo.insert')(function* (data: AssetInsert) {
        const result = yield* drizzle
          .insert(assets)
          .values(data)
          .returning();
        return result[0];
      }),

      /**
       * Update existing asset
       */
      update: Effect.fn('AssetRepo.update')(function* (
        id: string,
        data: Partial<AssetInsert>
      ) {
        const result = yield* drizzle
          .update(assets)
          .set({
            ...data,
            updatedAt: new Date().toISOString()
          })
          .where(eq(assets.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      /**
       * Update asset condition
       */
      updateCondition: Effect.fn('AssetRepo.updateCondition')(function* (
        id: string,
        condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
      ) {
        const result = yield* drizzle
          .update(assets)
          .set({
            condition,
            updatedAt: new Date().toISOString()
          })
          .where(eq(assets.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      /**
       * Delete asset
       */
      delete: Effect.fn('AssetRepo.delete')(function* (id: string) {
        const result = yield* drizzle
          .delete(assets)
          .where(eq(assets.id, id))
          .returning({ id: assets.id });
        return result.length > 0;
      }),

      /**
       * Count assets by condition (for dashboard metrics)
       */
      countByCondition: Effect.fn('AssetRepo.countByCondition')(function* (
        agencyId: string
      ) {
        const result = yield* drizzle
          .select({
            condition: assets.condition,
            count: sql<number>`count(*)::int`
          })
          .from(assets)
          .where(eq(assets.agencyId, agencyId))
          .groupBy(assets.condition);

        return result.reduce(
          (acc, row) => {
            acc[row.condition as keyof typeof acc] = row.count;
            return acc;
          },
          { excellent: 0, good: 0, fair: 0, poor: 0, critical: 0 }
        );
      })
    };
  }),
  dependencies: []
}) {}
