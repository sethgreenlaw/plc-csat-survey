import { HttpLayerRouter } from '@effect/platform';
import { BunContext, BunHttpServer, BunRuntime } from '@effect/platform-bun';
import { Effect, Layer } from 'effect';
import { SqlLive } from '@opengov/repo';
import { AppLive } from './index.js';

/**
 * Runtime Layer
 *
 * Combines SQL and Bun context layers.
 */
const RuntimeLayer = Layer.mergeAll(SqlLive, BunContext.layer);

/**
 * Server Layer
 *
 * HTTP server with all routes.
 */
const ServerLive = HttpLayerRouter.serve(AppLive).pipe(Layer.provide(BunHttpServer.layer({ port: 8080 })));

/**
 * Launch the server
 */
const program = Layer.launch(ServerLive);

Effect.provide(program, RuntimeLayer).pipe(BunRuntime.runMain);
