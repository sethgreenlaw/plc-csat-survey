/**
 * Permit Repository Example (Drizzle ORM)
 *
 * Repository pattern for permit application management
 * with complex workflow, reviews, and inspections.
 *
 * Based on OpenGov PLC domain.
 */

import { pgTable, text, timestamp, uuid, numeric, date, integer, serial, boolean } from 'drizzle-orm/pg-core';
import { eq, and, or, ilike, sql, gte, lte } from 'drizzle-orm';
import { Effect, Option } from 'effect';
import { PgDrizzle } from '@effect/sql-drizzle/Pg';

// ============================================================================
// Drizzle Schema Definition
// ============================================================================

/**
 * Applicants Table
 */
export const applicants = pgTable('applicants', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  kind: text('kind').notNull(), // individual, business, contractor, government
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  licenseNumber: text('license_number'), // For contractors
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

/**
 * Permit Applications Table
 */
export const permitApplications = pgTable('permit_applications', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  agencyId: uuid('agency_id').notNull(),
  permitNumber: text('permit_number').notNull().unique(),
  applicantId: uuid('applicant_id').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('draft'),
  projectName: text('project_name').notNull(),
  projectDescription: text('project_description').notNull(),
  projectAddressLine1: text('project_address_line1').notNull(),
  projectAddressLine2: text('project_address_line2'),
  projectCity: text('project_city').notNull(),
  projectState: text('project_state').notNull(),
  projectPostalCode: text('project_postal_code').notNull(),
  parcelNumber: text('parcel_number'),
  estimatedValue: numeric('estimated_value'),
  totalFees: numeric('total_fees').notNull().default('0'),
  paidAmount: numeric('paid_amount').notNull().default('0'),
  submittedAt: timestamp('submitted_at', { withTimezone: true, mode: 'string' }),
  approvedAt: timestamp('approved_at', { withTimezone: true, mode: 'string' }),
  issuedAt: timestamp('issued_at', { withTimezone: true, mode: 'string' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

/**
 * Review Steps Table
 */
export const reviewSteps = pgTable('review_steps', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  permitApplicationId: uuid('permit_application_id').notNull(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  status: text('status').notNull().default('pending'),
  assigneeId: uuid('assignee_id'),
  comments: text('comments'),
  decidedAt: timestamp('decided_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

/**
 * Inspections Table
 */
export const inspections = pgTable('inspections', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  permitApplicationId: uuid('permit_application_id').notNull(),
  inspectionType: text('inspection_type').notNull(),
  status: text('status').notNull().default('scheduled'),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true, mode: 'string' }).notNull(),
  inspectorId: uuid('inspector_id'),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

/**
 * Permit Number Sequence
 */
export const permitSequence = pgTable('permit_sequence', {
  id: serial().primaryKey(),
  agencyId: uuid('agency_id').notNull(),
  permitType: text('permit_type').notNull(),
  year: integer('year').notNull(),
  lastNumber: integer('last_number').notNull().default(0)
});

export type ApplicantRow = typeof applicants.$inferSelect;
export type ApplicantInsert = typeof applicants.$inferInsert;
export type PermitApplicationRow = typeof permitApplications.$inferSelect;
export type PermitApplicationInsert = typeof permitApplications.$inferInsert;
export type ReviewStepRow = typeof reviewSteps.$inferSelect;
export type ReviewStepInsert = typeof reviewSteps.$inferInsert;
export type InspectionRow = typeof inspections.$inferSelect;
export type InspectionInsert = typeof inspections.$inferInsert;

// ============================================================================
// Repository Service
// ============================================================================

type PermitStatus = 'draft' | 'submitted' | 'in_review' | 'pending_info' | 'approved' | 'issued' | 'denied' | 'expired' | 'revoked' | 'closed';
type PermitType = 'building' | 'electrical' | 'plumbing' | 'mechanical' | 'demolition' | 'grading' | 'business_license' | 'special_event' | 'encroachment' | 'sign' | 'other';

interface PermitFilter {
  agencyId?: string;
  applicantId?: string;
  type?: PermitType;
  status?: PermitStatus;
  submittedAfter?: string;
  submittedBefore?: string;
  search?: string;
}

interface Pagination {
  limit?: number;
  offset?: number;
}

/**
 * PermitRepo Service
 */
export class PermitRepo extends Effect.Service<PermitRepo>()('PermitRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;

    /**
     * Generate permit number (e.g., "BLD-2024-00123")
     */
    const generatePermitNumber = Effect.fn('PermitRepo.generateNumber')(function* (
      agencyId: string,
      permitType: string
    ) {
      const year = new Date().getFullYear();
      const typePrefix = permitType.substring(0, 3).toUpperCase();

      // Upsert sequence
      const result = yield* drizzle
        .insert(permitSequence)
        .values({ agencyId, permitType, year, lastNumber: 1 })
        .onConflictDoUpdate({
          target: [permitSequence.agencyId, permitSequence.permitType, permitSequence.year],
          set: { lastNumber: sql`${permitSequence.lastNumber} + 1` }
        })
        .returning({ lastNumber: permitSequence.lastNumber });

      const num = result[0]?.lastNumber ?? 1;
      return `${typePrefix}-${year}-${String(num).padStart(5, '0')}`;
    });

    return {
      // --- Permit Application Operations ---

      /**
       * Find all permit applications with filtering
       */
      findAll: Effect.fn('PermitRepo.findAll')(function* (
        filter: PermitFilter = {},
        pagination: Pagination = {}
      ) {
        const { limit = 50, offset = 0 } = pagination;
        const conditions = [];

        if (filter.agencyId) {
          conditions.push(eq(permitApplications.agencyId, filter.agencyId));
        }
        if (filter.applicantId) {
          conditions.push(eq(permitApplications.applicantId, filter.applicantId));
        }
        if (filter.type) {
          conditions.push(eq(permitApplications.type, filter.type));
        }
        if (filter.status) {
          conditions.push(eq(permitApplications.status, filter.status));
        }
        if (filter.submittedAfter) {
          conditions.push(gte(permitApplications.submittedAt, filter.submittedAfter));
        }
        if (filter.submittedBefore) {
          conditions.push(lte(permitApplications.submittedAt, filter.submittedBefore));
        }
        if (filter.search) {
          conditions.push(
            or(
              ilike(permitApplications.permitNumber, `%${filter.search}%`),
              ilike(permitApplications.projectName, `%${filter.search}%`)
            )
          );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, countResult] = yield* Effect.all([
          drizzle
            .select()
            .from(permitApplications)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(permitApplications.createdAt),
          drizzle
            .select({ count: sql<number>`count(*)::int` })
            .from(permitApplications)
            .where(whereClause)
        ]);

        return { data, total: countResult[0]?.count ?? 0, limit, offset };
      }),

      /**
       * Find permit by ID
       */
      findById: Effect.fn('PermitRepo.findById')(function* (id: string) {
        const result = yield* drizzle
          .select()
          .from(permitApplications)
          .where(eq(permitApplications.id, id));
        return Option.fromNullable(result[0]);
      }),

      /**
       * Insert new permit application
       */
      insert: Effect.fn('PermitRepo.insert')(function* (
        data: Omit<PermitApplicationInsert, 'permitNumber'>
      ) {
        const permitNumber = yield* generatePermitNumber(data.agencyId, data.type);
        const result = yield* drizzle
          .insert(permitApplications)
          .values({ ...data, permitNumber })
          .returning();
        return result[0];
      }),

      /**
       * Update permit application
       */
      update: Effect.fn('PermitRepo.update')(function* (
        id: string,
        data: Partial<PermitApplicationInsert>
      ) {
        const result = yield* drizzle
          .update(permitApplications)
          .set({ ...data, updatedAt: new Date().toISOString() })
          .where(eq(permitApplications.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      /**
       * Transition permit status
       */
      transition: Effect.fn('PermitRepo.transition')(function* (
        id: string,
        newStatus: PermitStatus,
        additionalData?: Partial<PermitApplicationInsert>
      ) {
        const updates: Partial<PermitApplicationInsert> = {
          ...additionalData,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };

        // Set timestamps based on status
        const now = new Date().toISOString();
        if (newStatus === 'submitted') updates.submittedAt = now;
        if (newStatus === 'approved') updates.approvedAt = now;
        if (newStatus === 'issued') updates.issuedAt = now;

        const result = yield* drizzle
          .update(permitApplications)
          .set(updates)
          .where(eq(permitApplications.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      /**
       * Record payment
       */
      recordPayment: Effect.fn('PermitRepo.recordPayment')(function* (
        id: string,
        amount: number
      ) {
        const result = yield* drizzle
          .update(permitApplications)
          .set({
            paidAmount: sql`${permitApplications.paidAmount}::numeric + ${amount}`,
            updatedAt: new Date().toISOString()
          })
          .where(eq(permitApplications.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      // --- Review Steps ---

      /**
       * Find review steps for permit
       */
      findReviews: Effect.fn('PermitRepo.findReviews')(function* (permitId: string) {
        return yield* drizzle
          .select()
          .from(reviewSteps)
          .where(eq(reviewSteps.permitApplicationId, permitId))
          .orderBy(reviewSteps.createdAt);
      }),

      /**
       * Create review step
       */
      createReview: Effect.fn('PermitRepo.createReview')(function* (data: ReviewStepInsert) {
        const result = yield* drizzle.insert(reviewSteps).values(data).returning();
        return result[0];
      }),

      /**
       * Update review step
       */
      updateReview: Effect.fn('PermitRepo.updateReview')(function* (
        id: string,
        data: Partial<ReviewStepInsert>
      ) {
        const updates = { ...data };
        if (data.status === 'approved' || data.status === 'rejected') {
          updates.decidedAt = new Date().toISOString();
        }
        const result = yield* drizzle
          .update(reviewSteps)
          .set(updates)
          .where(eq(reviewSteps.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      // --- Inspections ---

      /**
       * Find inspections for permit
       */
      findInspections: Effect.fn('PermitRepo.findInspections')(function* (permitId: string) {
        return yield* drizzle
          .select()
          .from(inspections)
          .where(eq(inspections.permitApplicationId, permitId))
          .orderBy(inspections.scheduledFor);
      }),

      /**
       * Schedule inspection
       */
      scheduleInspection: Effect.fn('PermitRepo.scheduleInspection')(function* (
        data: InspectionInsert
      ) {
        const result = yield* drizzle.insert(inspections).values(data).returning();
        return result[0];
      }),

      /**
       * Record inspection result
       */
      recordInspectionResult: Effect.fn('PermitRepo.recordInspectionResult')(function* (
        id: string,
        status: 'passed' | 'failed',
        notes?: string
      ) {
        const result = yield* drizzle
          .update(inspections)
          .set({
            status,
            notes,
            completedAt: new Date().toISOString()
          })
          .where(eq(inspections.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      // --- Applicants ---

      /**
       * Find applicant by ID
       */
      findApplicant: Effect.fn('PermitRepo.findApplicant')(function* (id: string) {
        const result = yield* drizzle
          .select()
          .from(applicants)
          .where(eq(applicants.id, id));
        return Option.fromNullable(result[0]);
      }),

      /**
       * Create applicant
       */
      createApplicant: Effect.fn('PermitRepo.createApplicant')(function* (data: ApplicantInsert) {
        const result = yield* drizzle.insert(applicants).values(data).returning();
        return result[0];
      }),

      // --- Statistics ---

      /**
       * Get permit statistics by status
       */
      getStatsByStatus: Effect.fn('PermitRepo.getStatsByStatus')(function* (agencyId: string) {
        const result = yield* drizzle
          .select({
            status: permitApplications.status,
            count: sql<number>`count(*)::int`
          })
          .from(permitApplications)
          .where(eq(permitApplications.agencyId, agencyId))
          .groupBy(permitApplications.status);

        return result.reduce(
          (acc, row) => {
            acc[row.status as string] = row.count;
            return acc;
          },
          {} as Record<string, number>
        );
      })
    };
  }),
  dependencies: []
}) {}
