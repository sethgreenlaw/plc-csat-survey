import { HttpApiBuilder } from '@effect/platform';
import { Effect } from 'effect';
import { Api } from '@opengov/protocol';

/**
 * Health API Implementation
 *
 * Provides health check endpoints for monitoring and load balancer health checks.
 */
export const HealthApiLive = HttpApiBuilder.group(Api, 'health', (handlers) =>
  handlers
    .handle('check', () =>
      Effect.succeed({
        status: 'ok' as const,
        timestamp: new Date().toISOString()
      })
    )
    .handle('ready', () =>
      Effect.succeed({
        ready: true
      })
    )
);
