/**
 * Permits API Example (Protocol-Driven)
 *
 * HttpApi definition for permit application management.
 * Demonstrates complex workflow with multiple related entities
 * (applicants, reviews, inspections).
 *
 * Based on OpenGov PLC domain.
 */

import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { Schema } from 'effect';

// Status and type schemas
const PermitStatusSchema = Schema.Literal(
  'draft', 'submitted', 'in_review', 'pending_info',
  'approved', 'issued', 'denied', 'expired', 'revoked', 'closed'
);

const PermitTypeSchema = Schema.Literal(
  'building', 'electrical', 'plumbing', 'mechanical',
  'demolition', 'grading', 'business_license', 'special_event',
  'encroachment', 'sign', 'other'
);

const ReviewStepStatusSchema = Schema.Literal(
  'pending', 'in_progress', 'approved', 'rejected', 'not_required'
);

const InspectionStatusSchema = Schema.Literal(
  'scheduled', 'completed', 'passed', 'failed', 'cancelled', 'no_show'
);

// Entity schemas
const PermitApplicationSchema = Schema.Struct({
  id: Schema.String,
  agencyId: Schema.String,
  permitNumber: Schema.String,
  applicantId: Schema.String,
  type: PermitTypeSchema,
  status: PermitStatusSchema,
  projectName: Schema.String,
  projectDescription: Schema.String,
  projectAddressLine1: Schema.String,
  projectAddressLine2: Schema.optionalWith(Schema.String, { as: 'Option' }),
  projectCity: Schema.String,
  projectState: Schema.String,
  projectPostalCode: Schema.String,
  parcelNumber: Schema.optionalWith(Schema.String, { as: 'Option' }),
  estimatedValue: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  totalFees: Schema.Number,
  paidAmount: Schema.Number,
  submittedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  approvedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  issuedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  expiresAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdAt: Schema.String,
  updatedAt: Schema.String
});

const PermitApplicationCreateSchema = Schema.Struct({
  agencyId: Schema.String,
  applicantId: Schema.String,
  type: PermitTypeSchema,
  projectName: Schema.String.pipe(Schema.minLength(1)),
  projectDescription: Schema.String,
  projectAddressLine1: Schema.String,
  projectAddressLine2: Schema.optionalWith(Schema.String, { as: 'Option' }),
  projectCity: Schema.String,
  projectState: Schema.String,
  projectPostalCode: Schema.String,
  parcelNumber: Schema.optionalWith(Schema.String, { as: 'Option' }),
  estimatedValue: Schema.optionalWith(Schema.Number, { as: 'Option' })
});

const ReviewStepSchema = Schema.Struct({
  id: Schema.String,
  permitApplicationId: Schema.String,
  name: Schema.String,
  department: Schema.String,
  status: ReviewStepStatusSchema,
  assigneeId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  comments: Schema.optionalWith(Schema.String, { as: 'Option' }),
  decidedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdAt: Schema.String
});

const InspectionSchema = Schema.Struct({
  id: Schema.String,
  permitApplicationId: Schema.String,
  inspectionType: Schema.String,
  status: InspectionStatusSchema,
  scheduledFor: Schema.String,
  inspectorId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  completedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  notes: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdAt: Schema.String
});

const InspectionCreateSchema = Schema.Struct({
  inspectionType: Schema.String.pipe(Schema.minLength(1)),
  scheduledFor: Schema.String,
  inspectorId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  notes: Schema.optionalWith(Schema.String, { as: 'Option' })
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

// Payment error for fee operations
const PaymentError = Schema.Struct({
  _tag: Schema.Literal('PaymentError'),
  message: Schema.String,
  code: Schema.optionalWith(Schema.String, { as: 'Option' })
});

// Pagination and filter schemas
const PaginationSchema = Schema.Struct({
  limit: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.positive()), { as: 'Option' }),
  offset: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.nonNegative()), { as: 'Option' })
});

const PermitFilterSchema = Schema.Struct({
  agencyId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  applicantId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  type: Schema.optionalWith(PermitTypeSchema, { as: 'Option' }),
  status: Schema.optionalWith(PermitStatusSchema, { as: 'Option' }),
  submittedAfter: Schema.optionalWith(Schema.String, { as: 'Option' }),
  submittedBefore: Schema.optionalWith(Schema.String, { as: 'Option' }),
  search: Schema.optionalWith(Schema.String, { as: 'Option' })
});

/**
 * Permits API Group
 *
 * Full permit lifecycle management including reviews and inspections.
 */
export class PermitsApi extends HttpApiGroup.make('permits')
  // List permit applications
  .add(
    HttpApiEndpoint.get('list', '/permits')
      .setUrlParams(Schema.extend(PaginationSchema, PermitFilterSchema))
      .addSuccess(Schema.Struct({
        data: Schema.Array(PermitApplicationSchema),
        total: Schema.Number,
        limit: Schema.Number,
        offset: Schema.Number
      }))
      .addError(InfrastructureError)
  )
  // Get single permit application
  .add(
    HttpApiEndpoint.get('getById', '/permits/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(PermitApplicationSchema)
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Create permit application (draft)
  .add(
    HttpApiEndpoint.post('create', '/permits')
      .setPayload(PermitApplicationCreateSchema)
      .addSuccess(PermitApplicationSchema)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Update permit application
  .add(
    HttpApiEndpoint.patch('update', '/permits/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.partial(PermitApplicationCreateSchema))
      .addSuccess(PermitApplicationSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // --- Workflow Actions ---
  // Submit application for review
  .add(
    HttpApiEndpoint.post('submit', '/permits/:id/submit')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(PermitApplicationSchema)
      .addError(NotFoundError)
      .addError(ValidationError) // e.g., missing required info
      .addError(InfrastructureError)
  )
  // Request additional information from applicant
  .add(
    HttpApiEndpoint.post('requestInfo', '/permits/:id/request-info')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        message: Schema.String.pipe(Schema.minLength(1)),
        requiredDocuments: Schema.optionalWith(Schema.Array(Schema.String), { as: 'Option' })
      }))
      .addSuccess(PermitApplicationSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Approve application
  .add(
    HttpApiEndpoint.post('approve', '/permits/:id/approve')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        conditions: Schema.optionalWith(Schema.Array(Schema.String), { as: 'Option' }),
        expiresAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
        notes: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(PermitApplicationSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Deny application
  .add(
    HttpApiEndpoint.post('deny', '/permits/:id/deny')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        reason: Schema.String.pipe(Schema.minLength(1)),
        appealDeadline: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(PermitApplicationSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Issue permit (after payment)
  .add(
    HttpApiEndpoint.post('issue', '/permits/:id/issue')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(PermitApplicationSchema)
      .addError(NotFoundError)
      .addError(ValidationError) // e.g., fees not paid
      .addError(PaymentError)
      .addError(InfrastructureError)
  )
  // Record payment
  .add(
    HttpApiEndpoint.post('recordPayment', '/permits/:id/payments')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        amount: Schema.Number.pipe(Schema.positive()),
        method: Schema.Literal('cash', 'check', 'card', 'ach'),
        referenceNumber: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(Schema.Struct({
        permitId: Schema.String,
        totalFees: Schema.Number,
        paidAmount: Schema.Number,
        remainingBalance: Schema.Number
      }))
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(PaymentError)
      .addError(InfrastructureError)
  )
  // --- Review Steps ---
  // List review steps
  .add(
    HttpApiEndpoint.get('listReviews', '/permits/:id/reviews')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(Schema.Array(ReviewStepSchema))
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Update review step
  .add(
    HttpApiEndpoint.patch('updateReview', '/permits/:id/reviews/:reviewId')
      .setPath(Schema.Struct({ id: Schema.String, reviewId: Schema.String }))
      .setPayload(Schema.Struct({
        status: ReviewStepStatusSchema,
        comments: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(ReviewStepSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // --- Inspections ---
  // List inspections
  .add(
    HttpApiEndpoint.get('listInspections', '/permits/:id/inspections')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(Schema.Array(InspectionSchema))
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Schedule inspection
  .add(
    HttpApiEndpoint.post('scheduleInspection', '/permits/:id/inspections')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(InspectionCreateSchema)
      .addSuccess(InspectionSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Record inspection result
  .add(
    HttpApiEndpoint.patch('recordInspectionResult', '/permits/:id/inspections/:inspectionId')
      .setPath(Schema.Struct({ id: Schema.String, inspectionId: Schema.String }))
      .setPayload(Schema.Struct({
        status: Schema.Literal('passed', 'failed'),
        notes: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(InspectionSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  .prefix('/api') {}
