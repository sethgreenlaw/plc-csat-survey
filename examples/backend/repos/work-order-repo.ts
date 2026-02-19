/**
 * Work Order Repository Example (Drizzle ORM)
 *
 * Repository pattern for work order management with
 * workflow state transitions and related work logs.
 *
 * Based on OpenGov EAM domain.
 */

import { pgTable, text, timestamp, uuid, numeric, date, integer, serial } from 'drizzle-orm/pg-core';
import { eq, and, or, ilike, sql, gte, lte } from 'drizzle-orm';
import { Effect, Option } from 'effect';
import { PgDrizzle } from '@effect/sql-drizzle/Pg';

// ============================================================================
// Drizzle Schema Definition
// ============================================================================

/**
 * Work Orders Table
 */
export const workOrders = pgTable('work_orders', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  agencyId: uuid('agency_id').notNull(),
  assetId: uuid('asset_id').notNull(),
  workOrderNumber: text('work_order_number').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // preventive, corrective, inspection, emergency, improvement
  status: text('status').notNull().default('open'), // open, scheduled, in_progress, on_hold, completed, cancelled
  priority: text('priority').notNull(), // emergency, high, medium, low
  assignedToId: uuid('assigned_to_id'),
  vendorId: uuid('vendor_id'),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true, mode: 'string' }),
  dueDate: date('due_date', { mode: 'string' }),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
  estimatedHours: numeric('estimated_hours'),
  actualHours: numeric('actual_hours'),
  estimatedCost: numeric('estimated_cost'),
  actualCost: numeric('actual_cost'),
  notes: text('notes'),
  createdById: uuid('created_by_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

/**
 * Work Logs Table - Time and materials tracking
 */
export const workLogs = pgTable('work_logs', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  workOrderId: uuid('work_order_id').notNull(),
  userId: uuid('user_id').notNull(),
  type: text('type').notNull(), // labor, materials, equipment, other
  description: text('description').notNull(),
  hours: numeric('hours'),
  cost: numeric('cost'),
  workedAt: date('worked_at', { mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

/**
 * Work Order Number Sequence - For generating sequential numbers
 */
export const workOrderSequence = pgTable('work_order_sequence', {
  id: serial().primaryKey(),
  agencyId: uuid('agency_id').notNull().unique(),
  lastNumber: integer('last_number').notNull().default(0)
});

export type WorkOrderRow = typeof workOrders.$inferSelect;
export type WorkOrderInsert = typeof workOrders.$inferInsert;
export type WorkLogRow = typeof workLogs.$inferSelect;
export type WorkLogInsert = typeof workLogs.$inferInsert;

// ============================================================================
// Repository Service
// ============================================================================

type WorkOrderStatus = 'open' | 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
type WorkOrderPriority = 'emergency' | 'high' | 'medium' | 'low';
type WorkOrderType = 'preventive' | 'corrective' | 'inspection' | 'emergency' | 'improvement';

interface WorkOrderFilter {
  agencyId?: string;
  assetId?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  type?: WorkOrderType;
  assignedToId?: string;
  dueBefore?: string;
  dueAfter?: string;
  search?: string;
}

interface Pagination {
  limit?: number;
  offset?: number;
}

/**
 * WorkOrderRepo Service
 */
export class WorkOrderRepo extends Effect.Service<WorkOrderRepo>()('WorkOrderRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;

    /**
     * Generate next work order number for agency
     */
    const generateWorkOrderNumber = Effect.fn('WorkOrderRepo.generateNumber')(function* (
      agencyId: string
    ) {
      // Upsert sequence and get next number
      const result = yield* drizzle
        .insert(workOrderSequence)
        .values({ agencyId, lastNumber: 1 })
        .onConflictDoUpdate({
          target: workOrderSequence.agencyId,
          set: { lastNumber: sql`${workOrderSequence.lastNumber} + 1` }
        })
        .returning({ lastNumber: workOrderSequence.lastNumber });

      const num = result[0]?.lastNumber ?? 1;
      return `WO-${String(num).padStart(6, '0')}`;
    });

    return {
      /**
       * Find all work orders with filtering
       */
      findAll: Effect.fn('WorkOrderRepo.findAll')(function* (
        filter: WorkOrderFilter = {},
        pagination: Pagination = {}
      ) {
        const { limit = 50, offset = 0 } = pagination;
        const conditions = [];

        if (filter.agencyId) {
          conditions.push(eq(workOrders.agencyId, filter.agencyId));
        }
        if (filter.assetId) {
          conditions.push(eq(workOrders.assetId, filter.assetId));
        }
        if (filter.status) {
          conditions.push(eq(workOrders.status, filter.status));
        }
        if (filter.priority) {
          conditions.push(eq(workOrders.priority, filter.priority));
        }
        if (filter.type) {
          conditions.push(eq(workOrders.type, filter.type));
        }
        if (filter.assignedToId) {
          conditions.push(eq(workOrders.assignedToId, filter.assignedToId));
        }
        if (filter.dueBefore) {
          conditions.push(lte(workOrders.dueDate, filter.dueBefore));
        }
        if (filter.dueAfter) {
          conditions.push(gte(workOrders.dueDate, filter.dueAfter));
        }
        if (filter.search) {
          conditions.push(
            or(
              ilike(workOrders.title, `%${filter.search}%`),
              ilike(workOrders.workOrderNumber, `%${filter.search}%`)
            )
          );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, countResult] = yield* Effect.all([
          drizzle
            .select()
            .from(workOrders)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(workOrders.createdAt),
          drizzle
            .select({ count: sql<number>`count(*)::int` })
            .from(workOrders)
            .where(whereClause)
        ]);

        return { data, total: countResult[0]?.count ?? 0, limit, offset };
      }),

      /**
       * Find work order by ID
       */
      findById: Effect.fn('WorkOrderRepo.findById')(function* (id: string) {
        const result = yield* drizzle
          .select()
          .from(workOrders)
          .where(eq(workOrders.id, id));
        return Option.fromNullable(result[0]);
      }),

      /**
       * Find overdue work orders
       */
      findOverdue: Effect.fn('WorkOrderRepo.findOverdue')(function* (agencyId: string) {
        const today = new Date().toISOString().split('T')[0];
        return yield* drizzle
          .select()
          .from(workOrders)
          .where(
            and(
              eq(workOrders.agencyId, agencyId),
              lte(workOrders.dueDate, today),
              sql`${workOrders.status} NOT IN ('completed', 'cancelled')`
            )
          )
          .orderBy(workOrders.dueDate);
      }),

      /**
       * Insert new work order (auto-generates work order number)
       */
      insert: Effect.fn('WorkOrderRepo.insert')(function* (
        data: Omit<WorkOrderInsert, 'workOrderNumber'>
      ) {
        const workOrderNumber = yield* generateWorkOrderNumber(data.agencyId);
        const result = yield* drizzle
          .insert(workOrders)
          .values({ ...data, workOrderNumber })
          .returning();
        return result[0];
      }),

      /**
       * Update work order
       */
      update: Effect.fn('WorkOrderRepo.update')(function* (
        id: string,
        data: Partial<WorkOrderInsert>
      ) {
        const result = yield* drizzle
          .update(workOrders)
          .set({
            ...data,
            updatedAt: new Date().toISOString()
          })
          .where(eq(workOrders.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      /**
       * Transition work order status
       */
      transition: Effect.fn('WorkOrderRepo.transition')(function* (
        id: string,
        newStatus: WorkOrderStatus,
        additionalData?: Partial<WorkOrderInsert>
      ) {
        const updates: Partial<WorkOrderInsert> = {
          ...additionalData,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };

        // Set completedAt when completing
        if (newStatus === 'completed') {
          updates.completedAt = new Date().toISOString();
        }

        const result = yield* drizzle
          .update(workOrders)
          .set(updates)
          .where(eq(workOrders.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      /**
       * Delete work order
       */
      delete: Effect.fn('WorkOrderRepo.delete')(function* (id: string) {
        // Delete work logs first (cascade)
        yield* drizzle.delete(workLogs).where(eq(workLogs.workOrderId, id));
        const result = yield* drizzle
          .delete(workOrders)
          .where(eq(workOrders.id, id))
          .returning({ id: workOrders.id });
        return result.length > 0;
      }),

      // --- Work Log Operations ---

      /**
       * Find work logs for a work order
       */
      findLogs: Effect.fn('WorkOrderRepo.findLogs')(function* (
        workOrderId: string,
        pagination: Pagination = {}
      ) {
        const { limit = 50, offset = 0 } = pagination;
        return yield* drizzle
          .select()
          .from(workLogs)
          .where(eq(workLogs.workOrderId, workOrderId))
          .limit(limit)
          .offset(offset)
          .orderBy(workLogs.workedAt);
      }),

      /**
       * Add work log entry
       */
      addLog: Effect.fn('WorkOrderRepo.addLog')(function* (data: WorkLogInsert) {
        const result = yield* drizzle
          .insert(workLogs)
          .values(data)
          .returning();
        return result[0];
      }),

      /**
       * Calculate total hours and cost from logs
       */
      calculateTotals: Effect.fn('WorkOrderRepo.calculateTotals')(function* (
        workOrderId: string
      ) {
        const result = yield* drizzle
          .select({
            totalHours: sql<number>`COALESCE(SUM(${workLogs.hours}::numeric), 0)::float`,
            totalCost: sql<number>`COALESCE(SUM(${workLogs.cost}::numeric), 0)::float`
          })
          .from(workLogs)
          .where(eq(workLogs.workOrderId, workOrderId));

        return {
          totalHours: result[0]?.totalHours ?? 0,
          totalCost: result[0]?.totalCost ?? 0
        };
      }),

      /**
       * Get work order statistics by status (for dashboard)
       */
      getStatsByStatus: Effect.fn('WorkOrderRepo.getStatsByStatus')(function* (
        agencyId: string
      ) {
        const result = yield* drizzle
          .select({
            status: workOrders.status,
            count: sql<number>`count(*)::int`
          })
          .from(workOrders)
          .where(eq(workOrders.agencyId, agencyId))
          .groupBy(workOrders.status);

        return result.reduce(
          (acc, row) => {
            acc[row.status as keyof typeof acc] = row.count;
            return acc;
          },
          { open: 0, scheduled: 0, in_progress: 0, on_hold: 0, completed: 0, cancelled: 0 }
        );
      })
    };
  }),
  dependencies: []
}) {}
