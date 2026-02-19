# CLAUDE.md - AI Assistant Guide

This file provides context and guidelines for AI assistants working with this codebase.

## IMPORTANT: Frontend/UI Development Requirements

**ALWAYS use the `cds-frontend` plugin when doing ANY frontend or UI work.**

Before writing or modifying any React components, MUI code, or frontend files:

1. **Use CDS skills first** to ensure proper patterns:
   - `/component-patterns` - Learn Composable + Configurable API patterns
   - `/mui-theme` - Learn theme usage (colors, spacing, typography)
   - `/layout-patterns` - Learn Grid, Stack, Box patterns
   - `/design-tokens` - Get token values for styling
   - `/validate-capital` - Validate CDS compliance

2. **For Figma implementations**, use:
   - `/figma-to-code` - Generate components from Figma designs
   - `/component-detector` - Detect which OpenGov packages to use

3. **Check the UX principles** in `.claude/ux-checklist.md` before finalizing UI code

4. **Reference examples** in `examples/layouts/` and `examples/pages/`

**This is NOT optional** - skipping CDS patterns leads to inconsistent UI that doesn't match the Capital Design System.

---

## Project Overview

This is an OpenGov monorepo template using:
- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **Backend**: Effect Platform (functional TypeScript framework)
- **Database**: PostgreSQL with Drizzle ORM + Effect SQL
- **Frontend**: React 19 + React Router + Vite + MUI (Capital Design System)
- **Shared**: Protocol package with Effect Schema for type-safe contracts
- **Build**: Bun workspaces + TypeScript project references

## Architecture

```
packages/
├── protocol/     # Shared schemas, API definitions, error types
├── repo/         # Database layer (Drizzle schema, SQL config, repositories)
├── backend/      # Effect Platform HTTP server (Bun runtime)
└── frontend/     # React SPA with MUI
examples/
├── layouts/      # 12 reference layout patterns for UI development
└── pages/        # Page templates (list, detail, form) with CRUD patterns
context/          # Domain knowledge for AI agents (personas, suite scope)
```

### Package Dependencies
```
protocol (pure schemas)
   ↓
repo → protocol
   ↓
backend → repo, protocol
frontend → protocol
```

## Bun Runtime

This project uses Bun instead of Node.js. Key commands:

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Run TypeScript files directly
bun src/main.ts

# Run tests
bun test

# Build all packages
bun --filter '*' build
```

## Effect-TS Standards

### 1. Use Effect.fn for functions returning Effects

**DO THIS:**
```typescript
const listTasks = Effect.fn(function* (
  where: typeof TaskModelWhereSchema.Type,
  pagination: typeof PaginationSchema.Type
) {
  const tasks = yield* Effect.tryPromise(() =>
    db.query.tasks.findMany({ ...pagination, where })
  );
  return yield* decodeArray(TaskModel)(tasks);
});
```

**DON'T DO THIS:**
```typescript
const listTasks = (where, pagination) =>
  Effect.gen(function* () {
    // ...
  });
```

### 2. Prefer generator syntax over pipe

**DO THIS:**
```typescript
const result = yield* Effect.tryPromise(() => fetch(url));
const decoded = yield* Schema.decodeUnknown(MySchema)(result);
return decoded;
```

**DON'T DO THIS:**
```typescript
return yield* Effect.tryPromise(() => fetch(url)).pipe(
  Effect.flatMap(Schema.decodeUnknown(MySchema))
);
```

**Exception**: Use `.pipe()` for simple effects with combinators:
```typescript
const assignSkill = Effect.fn('AgentRepo.assignSkill')((params) =>
  Effect.tryPromise(() => db.insert(agentSkills).values([params]))
    .pipe(Effect.sandbox, Effect.mapError(InfrastructureError.fromCause('Error')))
);
```

### 3. Prefer Effect.tryPromise over Effect.promise

**DO THIS:**
```typescript
Effect.tryPromise(() => db.query.tasks.findFirst());
// or with custom error:
Effect.tryPromise({
  try: () => db.query.tasks.findFirst(),
  catch: (e) => new DbError(e)
});
```

**DON'T DO THIS:**
```typescript
Effect.promise(() => db.query.tasks.findFirst());
```

### 4. Use Schema.make() for constructing schema-typed objects

**DO THIS:**
```typescript
const payload = AgentExportSchema.make({
  version: '1.0',
  exportedAt: new Date().toISOString(),
  agent: { id: agent.id, name: agent.name }
});
```

**DON'T DO THIS:**
```typescript
const payload = {
  version: '1.0' as const,
  exportedAt: new Date().toISOString(),
  agent: { id: agent.id, name: agent.name as const }
};
```

## Drizzle ORM Standards

### Schema Definition

```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});
```

### Repository Pattern with Effect

```typescript
export class UserRepo extends Effect.Service<UserRepo>()('UserRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;

    return {
      findAll: Effect.fn('UserRepo.findAll')(function* () {
        return yield* drizzle.select().from(users);
      }),

      findById: Effect.fn('UserRepo.findById')(function* (id: string) {
        const result = yield* drizzle.select().from(users).where(eq(users.id, id));
        return Option.fromNullable(result[0]);
      }),

      insert: Effect.fn('UserRepo.insert')(function* (data: UserInsert) {
        const result = yield* drizzle.insert(users).values(data).returning();
        return result[0];
      })
    };
  }),
  dependencies: []
}) {}
```

### SQL Configuration with Effect Config

```typescript
export const DrizzleConfig = Config.nested('DB')(
  Config.all({
    database: Config.string('DATABASE'),
    username: Config.string('USERNAME'),
    password: Config.redacted('PASSWORD'),
    host: Config.string('HOST'),
    port: Config.integer('PORT').pipe(Config.orElse(() => Config.succeed(5432)))
  })
);
```

## Mock Data Service

The template includes a mock data service for running without a database. This enables rapid development and testing without PostgreSQL setup.

### Configuration

Control mock mode via `USE_MOCK_DATA` environment variable:

| Value | Behavior |
|-------|----------|
| `auto` (default) | Try database, fallback to mock if unavailable |
| `true` / `mock` | Force mock mode (no database connection) |
| `false` / `real` | Force real database (fails if unavailable) |

```bash
# Run with mock data only
USE_MOCK_DATA=true bun run dev

# Run with real database only (no fallback)
USE_MOCK_DATA=false bun run dev

# Auto mode (default) - try real, fallback to mock
bun run dev
```

### Adding Mock Data for New Entities

When creating a new entity, add mock data in `packages/repo/src/mock/seed.ts`:

**Step 1: Define seed data array**

```typescript
// packages/repo/src/mock/seed.ts
export const sampleUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@example.gov',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'user@example.gov',
    name: 'Regular User',
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
```

**Step 2: Seed the data in seedAllMockData**

```typescript
// packages/repo/src/mock/seed.ts
export const seedAllMockData = Effect.fn('seedAllMockData')(function* () {
  const store = yield* MockDataStore;

  // Add your entity seeds - use TABLE NAME as the key
  yield* store.seed('users', sampleUsers);
  yield* store.seed('tasks', sampleTasks);
  yield* store.seed('permits', samplePermits);

  console.log('[MockData] Mock data seeded successfully');
});
```

**Important:** The table name in `store.seed()` must match your Drizzle table name exactly (e.g., `'users'` for `pgTable('users', ...)`).

### Seed Data Helpers

```typescript
import { createSeedId, seedTimestamp } from '@opengov/repo';

// Generate consistent UUIDs
const id1 = createSeedId(1);  // '550e8400-e29b-41d4-a716-44665544001'
const id2 = createSeedId(2);  // '550e8400-e29b-41d4-a716-44665544002'

// Generate timestamps
const now = seedTimestamp();        // current time ISO string
const weekAgo = seedTimestamp(7);   // 7 days ago ISO string
```

### MockDataStore API

Access mock data directly in tests or custom logic:

```typescript
import { MockDataStore } from '@opengov/repo';

// In an Effect context
const store = yield* MockDataStore;

// CRUD operations
yield* store.seed('users', sampleUsers);           // Seed initial data
const users = yield* store.findAll('users');       // Get all
const user = yield* store.findById('users', id);   // Get by ID (returns Option)
const admins = yield* store.findWhere('users',     // Filter with predicate
  (u) => u.role === 'admin'
);
const newUser = yield* store.insert('users', data); // Insert (auto-generates ID)
yield* store.update('users', id, { name: 'New' }); // Update
yield* store.delete('users', id);                  // Delete
yield* store.clear('users');                       // Clear table
yield* store.clearAll();                           // Clear all tables
```

### MockPgDrizzle and Effect Integration

The mock Drizzle implementation (`MockPgDrizzle`) bridges Drizzle's Promise-based API with Effect. Understanding this integration is important to avoid common pitfalls.

**How it works:**

MockPgDrizzle creates query builders that implement `then()` to be Promise-compatible. Inside `then()`, it uses `Effect.runPromise()` to execute MockDataStore operations:

```typescript
// Simplified internal implementation
then: (resolve, reject) => {
  const effect = Effect.gen(function* () {
    const records = yield* mockStore.findAll(tableName);
    return records;
  });
  return Effect.runPromise(effect).then(resolve, reject);
}
```

**Important limitation:** Because `Effect.runPromise()` runs Effects without providing additional context, the MockDataStore must be fully self-contained. It uses an internal `Ref` for state, which works because `Ref` operations don't require external services.

**Correct repository pattern:**

Repositories should use standard Drizzle operations that work identically with both real and mock PgDrizzle:

```typescript
// DO THIS - standard Drizzle operations work with both real and mock
export class TaskRepo extends Effect.Service<TaskRepo>()('TaskRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;

    return {
      findAll: Effect.fn('TaskRepo.findAll')(function* () {
        // Drizzle query is yielded - works with both real and mock
        return yield* drizzle.select().from(tasks);
      }),

      findById: Effect.fn('TaskRepo.findById')(function* (id: string) {
        const result = yield* drizzle.select().from(tasks).where(eq(tasks.id, id));
        return Option.fromNullable(result[0]);
      })
    };
  })
}) {}
```

**DON'T mix MockDataStore with PgDrizzle in repositories:**

```typescript
// DON'T DO THIS - mixing abstractions causes context issues
export class TaskRepo extends Effect.Service<TaskRepo>()('TaskRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;
    const mockStore = yield* MockDataStore; // Don't access both!

    return {
      findAll: Effect.fn('TaskRepo.findAll')(function* () {
        // This breaks the abstraction and won't work correctly
        return yield* mockStore.findAll('tasks');
      })
    };
  })
}) {}
```

**Layer composition:**

The mock and real layers are mutually exclusive. Provide one or the other:

```typescript
// Real database
const RealLive = Layer.mergeAll(PgDrizzleLive, /* other real layers */);

// Mock database
const MockLive = Layer.mergeAll(MockSqlLive, /* other mock layers */);

// Application chooses at startup based on configuration
const DataLayer = useMock ? MockLive : RealLive;
```

## Frontend Code Style

**REMINDER: Always use `cds-frontend` plugin skills before writing UI code!**

### Required: CDS Plugin Usage

| Task | Skill to Use |
|------|-------------|
| Creating new components | `/component-patterns` then `/mui-theme` |
| Working with layouts | `/layout-patterns` |
| Implementing Figma designs | `/figma-to-code` |
| Styling with theme | `/mui-theme` |
| Checking CDS compliance | `/validate-capital` |

### Code Standards

- **Strict type safety** - `any` can only be used in type constraints
- **Functional patterns** - Prefer FP over OOP
- **State extraction** - All state should be in standalone hook files
- **Interface-driven** - Program against interfaces, not implementations
- **Theme usage** - Always use `theme.palette.*` and `theme.spacing()`, never hardcode colors/spacing
- **UX principles** - Follow `.claude/ux-checklist.md` for messaging and accessibility

### Layout Patterns (examples/layouts/)

Reference patterns for building UIs. See `examples/README.md` for full details.

| Pattern | Use Case |
|---------|----------|
| StandardPageLayout | Most pages with header + content |
| TwoColumnLayout | Details pages (8/4 split) |
| ThreeColumnLayout | Admin panels (2/7/3 split) |
| CardGridLayout | Responsive card grids |
| VerticalFormLayout | Standard stacked forms |
| HorizontalFormLayout | Inline filters/search |
| ListWithItemsLayout | Activity feeds, notifications |
| TabbedLayout | Multi-section pages |
| CenteredContentLayout | Login, 404 pages |
| DashboardGridLayout | Mixed-size widgets |
| DetailsPageLayout | Profile/entity details |
| DataTableLayout | CRUD with OgGridTable |

**MUI Grid v2 syntax**: Use `size` prop instead of `xs`, `md`, etc.:
```typescript
<Grid size={{ xs: 12, md: 6 }}>Content</Grid>
```

**PageHeader Flush Pattern (REQUIRED)**: PageHeader must sit flush with navbar - no extra margin or padding:
```typescript
return (
  <>
    {/* PageHeader sits flush with navbar */}
    <PageHeaderComposable>
      <PageHeaderComposable.Header>
        <PageHeaderComposable.Title>Page Title</PageHeaderComposable.Title>
      </PageHeaderComposable.Header>
    </PageHeaderComposable>

    {/* Content area with padding */}
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>{/* Page content */}</Stack>
    </Box>
  </>
);
```

### Page Templates (examples/pages/)

Quick-start templates for common page types with state, routing, and CRUD operations.

| Template | Use Case |
|----------|----------|
| BaseTemplate | Foundation wrapper with PageHeader |
| ListPageTemplate | Data grid with search, filters, navigation |
| DetailPageTemplate | Entity view with sidebar actions |
| FormPageTemplate | Create/edit form with validation |

Usage: Copy template, replace `ENTITY_NAME` placeholders, customize fields.

### Domain Context (context/)

Reference context for understanding OpenGov government software:

| File | Description |
|------|-------------|
| `personas.md` | Government user personas (Budget Director, Permit Reviewer, etc.) |
| `suite-scope.md` | Product suites: B&P, EAM, PLC, PRO, FIN |

**Design for user tech fluency:**
- Low-tech users (Maintenance Workers) - Simplified interfaces, clear hierarchy
- Mid-tech users (Budget Directors) - Efficient workflows, progressive disclosure
- High-tech users (IT Directors) - Keyboard shortcuts, bulk operations

### React Patterns

```typescript
// State in hooks (src/hooks/useMyFeature.ts)
export const useMyFeature = () => {
  const [state, setState] = useState<MyState>(initialState);
  // ... logic
  return { state, actions };
};

// Components consume hooks
export const MyComponent = () => {
  const { state, actions } = useMyFeature();
  return <div>{/* UI */}</div>;
};
```

## API Design (Protocol-Driven)

APIs are defined once in the protocol package:

```typescript
// packages/protocol/src/Api.ts
export class UsersApi extends HttpApiGroup.make('users')
  .add(
    HttpApiEndpoint.get('list', '/users')
      .addSuccess(Schema.Array(UserSchema))
  )
  .add(
    HttpApiEndpoint.post('create', '/users')
      .setPayload(UserCreateSchema)
      .addSuccess(UserSchema)
      .addError(ValidationError)
  )
  .prefix('/api') {}
```

Backend implements the API:

```typescript
// packages/backend/src/api/UsersApi.ts
export const UsersApiLive = HttpApiBuilder.group(Api, 'users', (handlers) =>
  Effect.gen(function* () {
    const repo = yield* UserRepo;
    return handlers
      .handle('list', () => repo.findAll)
      .handle('create', ({ payload }) => repo.insert(payload));
  }).pipe(Effect.provide(UserRepo.Default))
);
```

## Error Handling

Use typed errors throughout:

```typescript
// Define in protocol
export class NotFoundError extends Schema.TaggedError<NotFoundError>()('NotFoundError', {
  message: Schema.String
}) {}

// Use in implementation
if (!user) {
  return yield* Effect.fail(new NotFoundError({ message: `User ${id} not found` }));
}
```

## Common Commands

```bash
# Development
bun run dev           # Start backend with hot reload
bun run frontend:dev  # Start frontend dev server

# Database
bun run db:start      # Start local PostgreSQL (pgserve)
bun run db:setup      # Create database and user
bun run db:generate   # Generate Drizzle migrations
bun run db:migrate    # Apply migrations

# Building
bun run build         # Build all packages

# Testing
bun test              # Run all tests

# Linting
bun run lint          # Check linting
bun run lint:fix      # Auto-fix linting issues
bun run format:check  # Check formatting
bun run format:fix    # Fix formatting
```

## Type Safety Rules

1. **No `any`** except in type constraints
2. **Strict mode enabled** across all packages
3. **No type: ignore** comments
4. **Full type inference** required
5. **Unused variables** must be prefixed with `_`

## Testing

- Use `bun:test` for testing (built into Bun)
- Use `testcontainers` for integration tests with real databases
- Mock external services only, not internal services

```typescript
import { describe, expect, test } from 'bun:test';

describe('UserRepo', () => {
  test('finds user by id', () => {
    // ...
  });
});
```

## Security

- **Never commit secrets** - use environment variables
- **Validate all inputs** with Effect Schema
- **Authorization checks** on every action
- **Use `Config.redacted()`** for sensitive values
