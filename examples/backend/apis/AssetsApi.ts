/**
 * Assets API Example (Protocol-Driven)
 *
 * HttpApi definition for asset management endpoints.
 * This demonstrates the protocol-driven API pattern where
 * the API contract is defined once and shared between
 * frontend and backend.
 *
 * Based on OpenGov EAM domain.
 */

import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { Schema } from 'effect';

// Import from your protocol package in real usage
// import { AssetSchema, AssetCreateSchema, ... } from '@opengov/protocol';

// For this example, we define inline (in production, import from protocol)
const AssetTypeSchema = Schema.Literal('fixed', 'infrastructure');
const AssetConditionSchema = Schema.Literal('excellent', 'good', 'fair', 'poor', 'critical');

const AssetSchema = Schema.Struct({
  id: Schema.String,
  agencyId: Schema.String,
  name: Schema.String,
  description: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetType: AssetTypeSchema,
  assetCode: Schema.String,
  parentAssetId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  locationId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  condition: AssetConditionSchema,
  acquisitionDate: Schema.optionalWith(Schema.String, { as: 'Option' }),
  acquisitionCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  currentValue: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  createdAt: Schema.String,
  updatedAt: Schema.String
});

const AssetCreateSchema = Schema.Struct({
  agencyId: Schema.String,
  name: Schema.String.pipe(Schema.minLength(1)),
  description: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetType: AssetTypeSchema,
  assetCode: Schema.String.pipe(Schema.pattern(/^[A-Z0-9-]+$/)),
  parentAssetId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  locationId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  condition: AssetConditionSchema,
  acquisitionDate: Schema.optionalWith(Schema.String, { as: 'Option' }),
  acquisitionCost: Schema.optionalWith(Schema.Number, { as: 'Option' })
});

const AssetUpdateSchema = Schema.partial(AssetCreateSchema);

// Shared error schemas (typically from @opengov/protocol)
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

// Pagination schema
const PaginationSchema = Schema.Struct({
  limit: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.positive()), { as: 'Option' }),
  offset: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.nonNegative()), { as: 'Option' })
});

// Filter schema for list endpoint
const AssetFilterSchema = Schema.Struct({
  agencyId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetType: Schema.optionalWith(AssetTypeSchema, { as: 'Option' }),
  condition: Schema.optionalWith(AssetConditionSchema, { as: 'Option' }),
  search: Schema.optionalWith(Schema.String, { as: 'Option' })
});

/**
 * Assets API Group
 *
 * CRUD operations for asset management.
 * All endpoints are prefixed with /api.
 */
export class AssetsApi extends HttpApiGroup.make('assets')
  // List assets with filtering and pagination
  .add(
    HttpApiEndpoint.get('list', '/assets')
      .setUrlParams(Schema.extend(PaginationSchema, AssetFilterSchema))
      .addSuccess(Schema.Struct({
        data: Schema.Array(AssetSchema),
        total: Schema.Number,
        limit: Schema.Number,
        offset: Schema.Number
      }))
      .addError(InfrastructureError)
  )
  // Get single asset by ID
  .add(
    HttpApiEndpoint.get('getById', '/assets/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(AssetSchema)
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Get child assets (hierarchy)
  .add(
    HttpApiEndpoint.get('getChildren', '/assets/:id/children')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setUrlParams(PaginationSchema)
      .addSuccess(Schema.Array(AssetSchema))
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Create new asset
  .add(
    HttpApiEndpoint.post('create', '/assets')
      .setPayload(AssetCreateSchema)
      .addSuccess(AssetSchema)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Update existing asset
  .add(
    HttpApiEndpoint.patch('update', '/assets/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(AssetUpdateSchema)
      .addSuccess(AssetSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  // Delete asset
  .add(
    HttpApiEndpoint.del('delete', '/assets/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(Schema.Struct({ deleted: Schema.Boolean }))
      .addError(NotFoundError)
      .addError(InfrastructureError)
  )
  // Update asset condition (common action)
  .add(
    HttpApiEndpoint.patch('updateCondition', '/assets/:id/condition')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(Schema.Struct({
        condition: AssetConditionSchema,
        notes: Schema.optionalWith(Schema.String, { as: 'Option' })
      }))
      .addSuccess(AssetSchema)
      .addError(NotFoundError)
      .addError(ValidationError)
      .addError(InfrastructureError)
  )
  .prefix('/api') {}
