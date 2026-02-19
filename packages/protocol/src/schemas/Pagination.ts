import { Schema } from 'effect';

/**
 * Pagination Schema
 *
 * Common pagination parameters for list endpoints.
 */
export const PaginationSchema = Schema.Struct({
  limit: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.positive()), {
    default: () => 20
  }),
  offset: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.nonNegative()), {
    default: () => 0
  })
});

export type Pagination = typeof PaginationSchema.Type;

/**
 * Paginated Response Schema
 *
 * Wrapper for paginated list responses.
 */
export const paginatedResponse = <A, I, R>(itemSchema: Schema.Schema<A, I, R>) =>
  Schema.Struct({
    items: Schema.Array(itemSchema),
    total: Schema.Int,
    limit: Schema.Int,
    offset: Schema.Int
  });
