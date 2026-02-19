/**
 * Work Order Schema (EAM - Enterprise Asset Management)
 *
 * Represents maintenance work orders for asset management.
 * Used to track scheduled maintenance, repairs, and inspections.
 *
 * Based on OpenGov EAM domain model.
 */

import { Schema } from 'effect';

/**
 * Work Order Status
 */
export const WorkOrderStatusSchema = Schema.Literal(
  'open',
  'scheduled',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled'
);
export type WorkOrderStatus = typeof WorkOrderStatusSchema.Type;

/**
 * Work Order Priority
 */
export const WorkOrderPrioritySchema = Schema.Literal(
  'emergency',
  'high',
  'medium',
  'low'
);
export type WorkOrderPriority = typeof WorkOrderPrioritySchema.Type;

/**
 * Work Order Type
 */
export const WorkOrderTypeSchema = Schema.Literal(
  'preventive',      // Scheduled maintenance
  'corrective',      // Repairs
  'inspection',      // Safety/compliance inspections
  'emergency',       // Urgent repairs
  'improvement'      // Upgrades/enhancements
);
export type WorkOrderType = typeof WorkOrderTypeSchema.Type;

/**
 * Work Log Entry Schema - Time and materials tracking
 */
export const WorkLogSchema = Schema.Struct({
  id: Schema.String,
  workOrderId: Schema.String,
  userId: Schema.String,
  type: Schema.Literal('labor', 'materials', 'equipment', 'other'),
  description: Schema.String,
  hours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  cost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  workedAt: Schema.String, // ISO date
  createdAt: Schema.String
});

export type WorkLog = typeof WorkLogSchema.Type;

/**
 * Work Order Schema - Core work order entity
 */
export const WorkOrderSchema = Schema.Struct({
  id: Schema.String,
  agencyId: Schema.String,
  assetId: Schema.String,
  workOrderNumber: Schema.String.pipe(Schema.pattern(/^WO-\d{6}$/)), // e.g., "WO-000123"
  title: Schema.String.pipe(Schema.minLength(1)),
  description: Schema.String,
  type: WorkOrderTypeSchema,
  status: WorkOrderStatusSchema,
  priority: WorkOrderPrioritySchema,
  assignedToId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  vendorId: Schema.optionalWith(Schema.String, { as: 'Option' }), // External contractor
  scheduledFor: Schema.optionalWith(Schema.String, { as: 'Option' }), // ISO datetime
  dueDate: Schema.optionalWith(Schema.String, { as: 'Option' }), // ISO date
  completedAt: Schema.optionalWith(Schema.String, { as: 'Option' }), // ISO datetime
  estimatedHours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  actualHours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  estimatedCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  actualCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  notes: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdById: Schema.String,
  createdAt: Schema.String,
  updatedAt: Schema.String
});

export type WorkOrder = typeof WorkOrderSchema.Type;

/**
 * Work Order Create Schema
 */
export const WorkOrderCreateSchema = Schema.Struct({
  agencyId: Schema.String,
  assetId: Schema.String,
  title: Schema.String.pipe(Schema.minLength(1)),
  description: Schema.String,
  type: WorkOrderTypeSchema,
  priority: WorkOrderPrioritySchema,
  assignedToId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  vendorId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  scheduledFor: Schema.optionalWith(Schema.String, { as: 'Option' }),
  dueDate: Schema.optionalWith(Schema.String, { as: 'Option' }),
  estimatedHours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  estimatedCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  notes: Schema.optionalWith(Schema.String, { as: 'Option' })
});

export type WorkOrderCreate = typeof WorkOrderCreateSchema.Type;

/**
 * Work Order Update Schema
 */
export const WorkOrderUpdateSchema = Schema.partial(
  Schema.Struct({
    title: Schema.String.pipe(Schema.minLength(1)),
    description: Schema.String,
    type: WorkOrderTypeSchema,
    status: WorkOrderStatusSchema,
    priority: WorkOrderPrioritySchema,
    assignedToId: Schema.optionalWith(Schema.String, { as: 'Option' }),
    vendorId: Schema.optionalWith(Schema.String, { as: 'Option' }),
    scheduledFor: Schema.optionalWith(Schema.String, { as: 'Option' }),
    dueDate: Schema.optionalWith(Schema.String, { as: 'Option' }),
    completedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
    estimatedHours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
    actualHours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
    estimatedCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
    actualCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
    notes: Schema.optionalWith(Schema.String, { as: 'Option' })
  })
);

export type WorkOrderUpdate = typeof WorkOrderUpdateSchema.Type;

/**
 * Work Log Create Schema
 */
export const WorkLogCreateSchema = Schema.Struct({
  workOrderId: Schema.String,
  type: Schema.Literal('labor', 'materials', 'equipment', 'other'),
  description: Schema.String,
  hours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  cost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  workedAt: Schema.String
});

export type WorkLogCreate = typeof WorkLogCreateSchema.Type;

/**
 * Work Order Filter Schema
 */
export const WorkOrderFilterSchema = Schema.Struct({
  agencyId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  status: Schema.optionalWith(WorkOrderStatusSchema, { as: 'Option' }),
  priority: Schema.optionalWith(WorkOrderPrioritySchema, { as: 'Option' }),
  type: Schema.optionalWith(WorkOrderTypeSchema, { as: 'Option' }),
  assignedToId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  dueBefore: Schema.optionalWith(Schema.String, { as: 'Option' }), // ISO date
  dueAfter: Schema.optionalWith(Schema.String, { as: 'Option' }), // ISO date
  search: Schema.optionalWith(Schema.String, { as: 'Option' })
});

export type WorkOrderFilter = typeof WorkOrderFilterSchema.Type;
