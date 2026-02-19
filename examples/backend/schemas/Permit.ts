/**
 * Permit Schema (PLC - Permitting & Licensing)
 *
 * Represents permit applications for building, business, events, etc.
 * Tracks the full lifecycle from submission through approval/denial.
 *
 * Based on OpenGov PLC domain model.
 */

import { Schema } from 'effect';

/**
 * Permit Status - Application lifecycle states
 */
export const PermitStatusSchema = Schema.Literal(
  'draft',        // Not yet submitted
  'submitted',    // Awaiting initial review
  'in_review',    // Under departmental review
  'pending_info', // Waiting for applicant information
  'approved',     // Approved, awaiting payment/issuance
  'issued',       // Permit issued and active
  'denied',       // Application denied
  'expired',      // Permit has expired
  'revoked',      // Permit revoked
  'closed'        // Final closure
);
export type PermitStatus = typeof PermitStatusSchema.Type;

/**
 * Permit Type - Common permit categories
 */
export const PermitTypeSchema = Schema.Literal(
  'building',           // Construction permits
  'electrical',         // Electrical work
  'plumbing',          // Plumbing work
  'mechanical',        // HVAC systems
  'demolition',        // Demolition permits
  'grading',           // Site grading
  'business_license',  // Business licenses
  'special_event',     // Event permits
  'encroachment',      // Right-of-way use
  'sign',              // Signage permits
  'other'
);
export type PermitType = typeof PermitTypeSchema.Type;

/**
 * Applicant Kind - Type of permit applicant
 */
export const ApplicantKindSchema = Schema.Literal(
  'individual',   // Private citizen
  'business',     // Business entity
  'contractor',   // Licensed contractor
  'government'    // Government agency
);
export type ApplicantKind = typeof ApplicantKindSchema.Type;

/**
 * Applicant Schema - Person or entity applying for permit
 */
export const ApplicantSchema = Schema.Struct({
  id: Schema.String,
  kind: ApplicantKindSchema,
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  phone: Schema.optionalWith(Schema.String, { as: 'Option' }),
  addressLine1: Schema.String,
  addressLine2: Schema.optionalWith(Schema.String, { as: 'Option' }),
  city: Schema.String,
  state: Schema.String,
  postalCode: Schema.String,
  licenseNumber: Schema.optionalWith(Schema.String, { as: 'Option' }), // For contractors
  createdAt: Schema.String,
  updatedAt: Schema.String
});

export type Applicant = typeof ApplicantSchema.Type;

/**
 * Review Step Schema - Individual review in workflow
 */
export const ReviewStepSchema = Schema.Struct({
  id: Schema.String,
  permitApplicationId: Schema.String,
  name: Schema.String,
  department: Schema.String,
  status: Schema.Literal('pending', 'in_progress', 'approved', 'rejected', 'not_required'),
  assigneeId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  comments: Schema.optionalWith(Schema.String, { as: 'Option' }),
  decidedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdAt: Schema.String
});

export type ReviewStep = typeof ReviewStepSchema.Type;

/**
 * Inspection Schema - On-site inspections
 */
export const InspectionSchema = Schema.Struct({
  id: Schema.String,
  permitApplicationId: Schema.String,
  inspectionType: Schema.String,
  status: Schema.Literal('scheduled', 'completed', 'passed', 'failed', 'cancelled', 'no_show'),
  scheduledFor: Schema.String, // ISO datetime
  inspectorId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  completedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  notes: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdAt: Schema.String
});

export type Inspection = typeof InspectionSchema.Type;

/**
 * Permit Application Schema - Core permit entity
 */
export const PermitApplicationSchema = Schema.Struct({
  id: Schema.String,
  agencyId: Schema.String,
  permitNumber: Schema.String.pipe(Schema.pattern(/^[A-Z]{3}-\d{4}-\d{5}$/)), // e.g., "BLD-2024-00123"
  applicantId: Schema.String,
  type: PermitTypeSchema,
  status: PermitStatusSchema,
  projectName: Schema.String.pipe(Schema.minLength(1)),
  projectDescription: Schema.String,
  projectAddressLine1: Schema.String,
  projectAddressLine2: Schema.optionalWith(Schema.String, { as: 'Option' }),
  projectCity: Schema.String,
  projectState: Schema.String,
  projectPostalCode: Schema.String,
  parcelNumber: Schema.optionalWith(Schema.String, { as: 'Option' }), // APN/Parcel ID
  estimatedValue: Schema.optionalWith(Schema.Number, { as: 'Option' }), // Project value
  totalFees: Schema.Number,
  paidAmount: Schema.Number,
  submittedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  approvedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  issuedAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  expiresAt: Schema.optionalWith(Schema.String, { as: 'Option' }),
  createdAt: Schema.String,
  updatedAt: Schema.String
});

export type PermitApplication = typeof PermitApplicationSchema.Type;

/**
 * Permit Application Create Schema
 */
export const PermitApplicationCreateSchema = Schema.Struct({
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

export type PermitApplicationCreate = typeof PermitApplicationCreateSchema.Type;

/**
 * Permit Application Update Schema
 */
export const PermitApplicationUpdateSchema = Schema.partial(
  Schema.Struct({
    type: PermitTypeSchema,
    status: PermitStatusSchema,
    projectName: Schema.String.pipe(Schema.minLength(1)),
    projectDescription: Schema.String,
    projectAddressLine1: Schema.String,
    projectAddressLine2: Schema.optionalWith(Schema.String, { as: 'Option' }),
    projectCity: Schema.String,
    projectState: Schema.String,
    projectPostalCode: Schema.String,
    parcelNumber: Schema.optionalWith(Schema.String, { as: 'Option' }),
    estimatedValue: Schema.optionalWith(Schema.Number, { as: 'Option' })
  })
);

export type PermitApplicationUpdate = typeof PermitApplicationUpdateSchema.Type;

/**
 * Applicant Create Schema
 */
export const ApplicantCreateSchema = Schema.Struct({
  kind: ApplicantKindSchema,
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  phone: Schema.optionalWith(Schema.String, { as: 'Option' }),
  addressLine1: Schema.String,
  addressLine2: Schema.optionalWith(Schema.String, { as: 'Option' }),
  city: Schema.String,
  state: Schema.String,
  postalCode: Schema.String,
  licenseNumber: Schema.optionalWith(Schema.String, { as: 'Option' })
});

export type ApplicantCreate = typeof ApplicantCreateSchema.Type;

/**
 * Inspection Create Schema
 */
export const InspectionCreateSchema = Schema.Struct({
  permitApplicationId: Schema.String,
  inspectionType: Schema.String,
  scheduledFor: Schema.String,
  inspectorId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  notes: Schema.optionalWith(Schema.String, { as: 'Option' })
});

export type InspectionCreate = typeof InspectionCreateSchema.Type;

/**
 * Permit Filter Schema
 */
export const PermitFilterSchema = Schema.Struct({
  agencyId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  applicantId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  type: Schema.optionalWith(PermitTypeSchema, { as: 'Option' }),
  status: Schema.optionalWith(PermitStatusSchema, { as: 'Option' }),
  submittedAfter: Schema.optionalWith(Schema.String, { as: 'Option' }),
  submittedBefore: Schema.optionalWith(Schema.String, { as: 'Option' }),
  search: Schema.optionalWith(Schema.String, { as: 'Option' }) // Search permit number, project name
});

export type PermitFilter = typeof PermitFilterSchema.Type;
