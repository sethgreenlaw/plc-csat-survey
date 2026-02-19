/**
 * Asset Schema (EAM - Enterprise Asset Management)
 *
 * Represents infrastructure assets like vehicles, buildings, equipment,
 * and other fixed or infrastructure assets managed by government agencies.
 *
 * Based on OpenGov EAM domain model.
 */

import { Schema } from 'effect';

/**
 * Asset Type - Fixed assets vs Infrastructure assets
 */
export const AssetTypeSchema = Schema.Literal('fixed', 'infrastructure');
export type AssetType = typeof AssetTypeSchema.Type;

/**
 * Asset Condition - Current state of the asset
 */
export const AssetConditionSchema = Schema.Literal(
  'excellent',
  'good',
  'fair',
  'poor',
  'critical'
);
export type AssetCondition = typeof AssetConditionSchema.Type;

/**
 * Location Schema - Geographic location with optional GIS data
 */
export const LocationSchema = Schema.Struct({
  id: Schema.String,
  addressLine1: Schema.String,
  addressLine2: Schema.optionalWith(Schema.String, { as: 'Option' }),
  city: Schema.String,
  state: Schema.String,
  postalCode: Schema.String,
  latitude: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  longitude: Schema.optionalWith(Schema.Number, { as: 'Option' })
});

export type Location = typeof LocationSchema.Type;

/**
 * Asset Schema - Core asset entity
 */
export const AssetSchema = Schema.Struct({
  id: Schema.String,
  agencyId: Schema.String,
  name: Schema.String.pipe(Schema.minLength(1)),
  description: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetType: AssetTypeSchema,
  assetCode: Schema.String.pipe(Schema.pattern(/^[A-Z0-9-]+$/)), // e.g., "VEH-001", "BLDG-123"
  parentAssetId: Schema.optionalWith(Schema.String, { as: 'Option' }), // For asset hierarchy
  locationId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  condition: AssetConditionSchema,
  acquisitionDate: Schema.optionalWith(Schema.String, { as: 'Option' }), // ISO date
  acquisitionCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  currentValue: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  warrantyExpiration: Schema.optionalWith(Schema.String, { as: 'Option' }), // ISO date
  metadata: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Unknown }), { as: 'Option' }),
  createdAt: Schema.String,
  updatedAt: Schema.String
});

export type Asset = typeof AssetSchema.Type;

/**
 * Asset Create Schema - Fields required to create a new asset
 */
export const AssetCreateSchema = Schema.Struct({
  agencyId: Schema.String,
  name: Schema.String.pipe(Schema.minLength(1)),
  description: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetType: AssetTypeSchema,
  assetCode: Schema.String.pipe(Schema.pattern(/^[A-Z0-9-]+$/)),
  parentAssetId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  locationId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  condition: AssetConditionSchema,
  acquisitionDate: Schema.optionalWith(Schema.String, { as: 'Option' }),
  acquisitionCost: Schema.optionalWith(Schema.Number, { as: 'Option' }),
  warrantyExpiration: Schema.optionalWith(Schema.String, { as: 'Option' }),
  metadata: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Unknown }), { as: 'Option' })
});

export type AssetCreate = typeof AssetCreateSchema.Type;

/**
 * Asset Update Schema - Fields that can be updated
 */
export const AssetUpdateSchema = Schema.partial(AssetCreateSchema);

export type AssetUpdate = typeof AssetUpdateSchema.Type;

/**
 * Asset List Filter Schema - Query parameters for listing assets
 */
export const AssetFilterSchema = Schema.Struct({
  agencyId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  assetType: Schema.optionalWith(AssetTypeSchema, { as: 'Option' }),
  condition: Schema.optionalWith(AssetConditionSchema, { as: 'Option' }),
  parentAssetId: Schema.optionalWith(Schema.String, { as: 'Option' }),
  search: Schema.optionalWith(Schema.String, { as: 'Option' }) // Search name/code
});

export type AssetFilter = typeof AssetFilterSchema.Type;
