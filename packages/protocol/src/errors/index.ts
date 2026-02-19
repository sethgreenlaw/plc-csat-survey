import { HttpApiSchema } from '@effect/platform';
import { Schema } from 'effect';

/**
 * Not Found Error
 *
 * Returned when a requested resource does not exist.
 */
export class NotFoundError extends Schema.TaggedError<NotFoundError>()(
  'NotFoundError',
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 404 })
) {}

/**
 * Validation Error
 *
 * Returned when input validation fails.
 */
export class ValidationError extends Schema.TaggedError<ValidationError>()(
  'ValidationError',
  {
    message: Schema.String,
    field: Schema.optional(Schema.String)
  },
  HttpApiSchema.annotations({ status: 400 })
) {}

/**
 * Unauthorized Error
 *
 * Returned when authentication is required but not provided or invalid.
 */
export class UnauthorizedError extends Schema.TaggedError<UnauthorizedError>()(
  'UnauthorizedError',
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 401 })
) {}

/**
 * Forbidden Error
 *
 * Returned when the user lacks permission for the requested action.
 */
export class ForbiddenError extends Schema.TaggedError<ForbiddenError>()(
  'ForbiddenError',
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 403 })
) {}

/**
 * Infrastructure Error
 *
 * Returned when an internal system error occurs (database, external service, etc.).
 */
export class InfrastructureError extends Schema.TaggedError<InfrastructureError>()(
  'InfrastructureError',
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 500 })
) {
  /**
   * Create an InfrastructureError from a caught exception.
   */
  static fromCause(message: string) {
    return (_cause: unknown) => new InfrastructureError({ message });
  }
}
