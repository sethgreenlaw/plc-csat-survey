/**
 * Work Orders API Example (Protocol-Driven)
 *
 * HttpApi definition for work order management endpoints.
 * Demonstrates complex workflows with status transitions
 * and related entities (work logs).
 *
 * Based on OpenGov EAM domain.
 */

import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { Schema } from 'effect';

// Status and type schemas
const WorkOrderStatusSchema = Schema.Literal(
  'open', 'scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled'
);

const WorkOrderPrioritySchema = Schema.Literal('emergency', 'high', 'medium', 'low');

const WorkOrderTypeSchema = Schema.Literal(
  'preventive', 'corrective', 'inspection', 'emergency', 'improvement'
);

const WorkLogTypeSchema = Schema.Literal('labor', 'materials', 'equipment', 'other');

// Entity schemas
const WorkOrderSchema = Schema.Struct({
  id: Schema.String,
  agencyId: Schema.String,
  assetId: Schema.String,
  workOrderNumber: Schema.String,
  title: Schema.String,
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
  notes: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdById: Schema.String,
  createdAt: Schema.String,
  updatedAt: Schema.String
});

const WorkOrderCreateSchema = Schema.Struct({
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

const WorkLogSchema = Schema.Struct({
  id: Schema.String,
  workOrderId: Schema.String,
  userId: Schema.String,
  type: WorkLogTypeSchema,
  description: Schema.String,
  hours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  cost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  workedAt: Schema.String,
  createdAt: Schema.String
});

const WorkLogCreateSchema = Schema.Struct({
  type: WorkLogTypeSchema,
  description: Schema.String,
  hours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  cost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  workedAt: Schema.String
});

// Error schemas
const NotFoundError = Schema.Struct({
  _tag: Schema.Literal('NotFoundError'),
  message: Schema.String
});

const ValidationError = Schema.Struct({
  _tag: Schema.Literal('ValidationError'),
  message: Schema.String,
  field: Schema.optionalWith(Schema.String, { as: 'Option' })
});

const InfrastructureError = Schema.Struct({
  _tag: Schema.Literal('InfrastructureError'),
  message: Schema.String
});

// Pagination and filter schemas
const PaginationSchema = Schema.Struct({
  limit: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.positive()), { as: 'Option' }),
  offset: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.nonNegative()), { as: 'Option' })
});

const WorkOrderFilterSchema = Schema.Struct({
  agencyId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  status: Schema.optionalWith(WorkOrderStatusSchema, { as: 'Option' }),
  priority: Schema.optionalWith(WorkOrderPrioritySchema, { as: 'Option' }),
  type: Schema.optionalWith(WorkOrderTypeSchema, { as: 'Option' }),
  assignedToId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  dueBefore: Schema.optionalWith(Schema.String, { as: 'Option' }),
  dueAfter: Schema.optionalWith(Schema.String, { as: 'Option' }),
  search: Schema.optionalWith(Schema.String, { as: 'Option' })
});

/**
 * Work Orders API Group
 *
 * Full CRUD plus workflow actions for work order management.
 */
export class WorkOrdersApi extends HttpApiGroup.make('workOrders')
  // List work orders with filtering
  .add(
    HttpApiEndpoint.get('list', '/work-orders')
      .setUrlParams(Schema.extend(PaginationSchema, WorkOrderFilterSchema))
      .addSuccess(Schema.Struct({
        data: Schema.Array(WorkOrderSchema),
        total: Schema.Number,
        limit: Schema.Number,
        offset: Schema.Number
      }))
      .addError(InfrastructureError)
  )
  // Get single work order
  .add(
    HttpApiEndpoint.get('getById', '/work-orders/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(WorkOrderSchema)
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Create work order
  .add(
    HttpApiEndpoint.post('create', '/work-orders')
      .setPayload(WorkOrderCreateSchema)
      .addSuccess(WorkOrderSchema)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Update work order
  .add(
    HttpApiEndpoint.patch('update', '/work-orders/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.partial(WorkOrderCreateSchema))
      .addSuccess(WorkOrderSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Delete work order
  .add(
    HttpApiEndpoint.del('delete', '/work-orders/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(Schema.Struct({ deleted: Schema.Boolean }))
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // --- Workflow Actions ---
  // Assign work order
  .add(
    HttpApiEndpoint.post('assign', '/work-orders/:id/assign')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        assignedToId: Schema.String,
        notes: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(WorkOrderSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Start work
  .add(
    HttpApiEndpoint.post('start', '/work-orders/:id/start')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        notes: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(WorkOrderSchema)
      .addError(NotFoundError)
      .addError(ValidationError) // e.g., invalid status transition
      .addError(InfrastructureError)
  )
  // Complete work order
  .add(
    HttpApiEndpoint.post('complete', '/work-orders/:id/complete')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        actualHours: Schema.optionalWith(Schema.Number, { as: 'Option' }),
        actualCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
        notes: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(WorkOrderSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Put on hold
  .add(
    HttpApiEndpoint.post('hold', '/work-orders/:id/hold')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        reason: Schema.String.pipe(Schema.minLength(1))
      }))
      .addSuccess(WorkOrderSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Cancel work order
  .add(
    HttpApiEndpoint.post('cancel', '/work-orders/:id/cancel')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        reason: Schema.String.pipe(Schema.minLength(1))
      }))
      .addSuccess(WorkOrderSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // --- Work Logs (nested resource) ---
  // List work logs for a work order
  .add(
    HttpApiEndpoint.get('listLogs', '/work-orders/:id/logs')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setUrlParams(PaginationSchema)
      .addSuccess(Schema.Array(WorkLogSchema))
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Add work log entry
  .add(
    HttpApiEndpoint.post('addLog', '/work-orders/:id/logs')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(WorkLogCreateSchema)
      .addSuccess(WorkLogSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  .prefix('/api') {}
