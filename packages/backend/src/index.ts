import { HttpApiSwagger, HttpLayerRouter, HttpServerResponse, OpenApi } from '@effect/platform';
import { Layer } from 'effect';
import { Api } from '@opengov/protocol';
import { HealthApiLive } from './api/HealthApi.js';

/**
 * API Routes
 *
 * Combines all API group implementations with the HttpApi.
 */
const routes = Layer.mergeAll(HealthApiLive);

const ApiRoutes = HttpLayerRouter.addHttpApi(Api).pipe(Layer.provide(routes));

/**
 * Swagger Documentation
 */
const DocsRoutes = HttpApiSwagger.layerHttpLayerRouter({ path: '/api/docs', api: Api });

/**
 * OpenAPI spec route
 */
const openApiSpec = OpenApi.fromApi(Api);
const OpenApiSpecRoutes = HttpLayerRouter.add('GET', '/api/openapi.json', HttpServerResponse.json(openApiSpec));

/**
 * All Routes Combined
 */
export const AppLive = Layer.mergeAll(ApiRoutes, DocsRoutes, OpenApiSpecRoutes);
