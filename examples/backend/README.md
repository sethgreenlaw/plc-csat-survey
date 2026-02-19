# Backend Examples

Reference implementations for building backend services with Effect-TS, Drizzle ORM, and protocol-driven APIs.

**Important**: These files are reference material, not part of the application. Use them as templates when building new backend services.

## Directory Structure

```
backend/
├── README.md           # This file
├── index.ts            # Exports all examples
├── schemas/            # Effect Schema definitions
│   ├── Asset.ts        # EAM: Infrastructure asset schemas
│   ├── WorkOrder.ts    # EAM: Work order schemas
│   └── Permit.ts       # PLC: Permit application schemas
├── apis/               # HttpApi endpoint definitions
│   ├── AssetsApi.ts    # Asset CRUD + condition updates
│   ├── WorkOrdersApi.ts # Work orders + workflow actions
│   └── PermitsApi.ts   # Permits + reviews + inspections
└── repos/              # Drizzle ORM repository patterns
    ├── asset-repo.ts   # Asset data access layer
    ├── work-order-repo.ts # Work order + logs data access
    └── permit-repo.ts  # Permit + reviews + inspections
```

## OpenGov Domains

### EAM - Enterprise Asset Management
- **Assets**: Infrastructure and fixed assets (vehicles, buildings, equipment)
- **Work Orders**: Maintenance scheduling, repairs, inspections
- **Work Logs**: Time and materials tracking

### PLC - Permitting & Licensing
- **Applicants**: Citizens, businesses, contractors
- **Permits**: Building, electrical, plumbing, business licenses
- **Review Steps**: Multi-department approval workflow
- **Inspections**: On-site inspections with pass/fail results

## Schema Patterns

### Basic Entity Schema

```typescript
import { Schema } from 'effect';

// Define status/type literals
const StatusSchema = Schema.Literal('active', 'inactive', 'archived');

// Main entity schema
export const EntitySchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String.pipe(Schema.minLength(1)),
  status: StatusSchema,
  createdAt: Schema.String,
  updatedAt: Schema.String
});

export type Entity = typeof EntitySchema.Type;

// Create schema (subset of fields)
export const EntityCreateSchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1)),
  status: StatusSchema
});

// Update schema (all fields optional)
export const EntityUpdateSchema = Schema.partial(EntityCreateSchema);
```

### Validation Patterns

```typescript
// Email validation
Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))

// Minimum length
Schema.String.pipe(Schema.minLength(1))

// Code format (e.g., "ABC-123")
Schema.String.pipe(Schema.pattern(/^[A-Z]{3}-\d{3}$/))

// Optional field with Option type
Schema.optionalWith(Schema.String, { as: 'Option' })

// Positive number
Schema.Number.pipe(Schema.positive())
```

## API Patterns

### Protocol-Driven API Definition

```typescript
import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { Schema } from 'effect';

export class EntitiesApi extends HttpApiGroup.make('entities')
  // List with filtering
  .add(
    HttpApiEndpoint.get('list', '/entities')
      .setUrlParams(FilterSchema)
      .addSuccess(Schema.Array(EntitySchema))
      .addError(InfrastructureError)
  )
  // Get by ID
  .add(
    HttpApiEndpoint.get('getById', '/entities/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(EntitySchema)
      .addError(NotFoundError)
  )
  // Create
  .add(
    HttpApiEndpoint.post('create', '/entities')
      .setPayload(EntityCreateSchema)
      .addSuccess(EntitySchema)
      .addError(ValidationError)
  )
  // Update
  .add(
    HttpApiEndpoint.patch('update', '/entities/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .setPayload(EntityUpdateSchema)
      .addSuccess(EntitySchema)
      .addError(NotFoundError)
      .addError(ValidationError)
  )
  // Delete
  .add(
    HttpApiEndpoint.del('delete', '/entities/:id')
      .setPath(Schema.Struct({ id: Schema.String }))
      .addSuccess(Schema.Struct({ deleted: Schema.Boolean }))
      .addError(NotFoundError)
  )
  .prefix('/api') {}
```

### Workflow Actions

```typescript
// Status transition endpoint
.add(
  HttpApiEndpoint.post('submit', '/entities/:id/submit')
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(EntitySchema)
    .addError(NotFoundError)
    .addError(ValidationError) // Invalid transition
)

// Action with payload
.add(
  HttpApiEndpoint.post('assign', '/entities/:id/assign')
    .setPath(Schema.Struct({ id: Schema.String }))
    .setPayload(Schema.Struct({
      assigneeId: Schema.String,
      notes: Schema.optionalWith(Schema.String, { as: 'Option' })
    }))
    .addSuccess(EntitySchema)
)
```

## Repository Patterns

### Basic Repository Structure

```typescript
import { Effect, Option } from 'effect';
import { PgDrizzle } from '@effect/sql-drizzle/Pg';

export class EntityRepo extends Effect.Service<EntityRepo>()('EntityRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;

    return {
      findAll: Effect.fn('EntityRepo.findAll')(function* (filter, pagination) {
        // Build query with conditions
        const conditions = [];
        if (filter.status) conditions.push(eq(entities.status, filter.status));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        return yield* drizzle
          .select()
          .from(entities)
          .where(whereClause)
          .limit(pagination.limit)
          .offset(pagination.offset);
      }),

      findById: Effect.fn('EntityRepo.findById')(function* (id: string) {
        const result = yield* drizzle
          .select()
          .from(entities)
          .where(eq(entities.id, id));
        return Option.fromNullable(result[0]);
      }),

      insert: Effect.fn('EntityRepo.insert')(function* (data) {
        const result = yield* drizzle.insert(entities).values(data).returning();
        return result[0];
      }),

      update: Effect.fn('EntityRepo.update')(function* (id, data) {
        const result = yield* drizzle
          .update(entities)
          .set({ ...data, updatedAt: new Date().toISOString() })
          .where(eq(entities.id, id))
          .returning();
        return Option.fromNullable(result[0]);
      }),

      delete: Effect.fn('EntityRepo.delete')(function* (id: string) {
        const result = yield* drizzle
          .delete(entities)
          .where(eq(entities.id, id))
          .returning({ id: entities.id });
        return result.length > 0;
      })
    };
  }),
  dependencies: []
}) {}
```

### Sequence Generation

```typescript
// Generate sequential numbers (e.g., "WO-000123")
const generateNumber = Effect.fn('generateNumber')(function* (agencyId: string) {
  const result = yield* drizzle
    .insert(sequence)
    .values({ agencyId, lastNumber: 1 })
    .onConflictDoUpdate({
      target: sequence.agencyId,
      set: { lastNumber: sql`${sequence.lastNumber} + 1` }
    })
    .returning({ lastNumber: sequence.lastNumber });

  const num = result[0]?.lastNumber ?? 1;
  return `WO-${String(num).padStart(6, '0')}`;
});
```

### Aggregation Queries

```typescript
// Count by status
getStatsByStatus: Effect.fn('EntityRepo.getStatsByStatus')(function* (agencyId: string) {
  const result = yield* drizzle
    .select({
      status: entities.status,
      count: sql<number>`count(*)::int`
    })
    .from(entities)
    .where(eq(entities.agencyId, agencyId))
    .groupBy(entities.status);

  return result.reduce((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {} as Record<string, number>);
})
```

## Error Handling

### Standard Error Types

```typescript
// Define in protocol package
export class NotFoundError extends Schema.TaggedError<NotFoundError>()('NotFoundError', {
  message: Schema.String
}) {}

export class ValidationError extends Schema.TaggedError<ValidationError>()('ValidationError', {
  message: Schema.String,
  field: Schema.optionalWith(Schema.String, { as: 'Option' })
}) {}

export class InfrastructureError extends Schema.TaggedError<InfrastructureError>()('InfrastructureError', {
  message: Schema.String
}) {}
```

### Error Mapping in API Handlers

```typescript
const withErrorHandling = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(
    Effect.catchAll((error) =>
      Effect.fail(new InfrastructureError({ message: String(error) }))
    )
  );
```

## Usage Guidelines

1. **Protocol First**: Define schemas in the protocol package, share between frontend and backend
2. **Type Safety**: Use `Effect.fn` for all repository methods to get full type inference
3. **Error Types**: Use tagged errors for proper error handling across API boundaries
4. **Pagination**: Always support limit/offset for list endpoints
5. **Filtering**: Build dynamic where clauses from filter objects
6. **Timestamps**: Auto-update `updatedAt` on all mutations
7. **Sequences**: Use database sequences for unique identifiers (permit numbers, work order numbers)
