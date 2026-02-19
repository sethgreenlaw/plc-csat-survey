import { HttpApi, HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { Schema } from 'effect';

/**
 * Health API
 *
 * Basic health check endpoints for monitoring.
 */
export class HealthApi extends HttpApiGroup.make('health')
  .add(
    HttpApiEndpoint.get('check', '/health')
      .addSuccess(Schema.Struct({ status: Schema.Literal('ok'), timestamp: Schema.String }))
  )
  .add(
    HttpApiEndpoint.get('ready', '/health/ready')
      .addSuccess(Schema.Struct({ ready: Schema.Boolean }))
  ) {}

/**
 * Main API
 *
 * Combines all API groups into the main API specification.
 */
export class Api extends HttpApi.make('api').add(HealthApi) {}
