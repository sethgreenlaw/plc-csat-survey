# OpenGov Template Example

A monorepo template for OpenGov projects using Bun, Effect-TS, Drizzle ORM, React, and MUI.

## Tech Stack

- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **Backend**: Effect Platform (functional TypeScript HTTP server)
- **Database**: PostgreSQL with Drizzle ORM + Effect SQL
- **Frontend**: React 19 + React Router + Vite + MUI (Capital Design System)
- **Shared**: Protocol package with Effect Schema
- **Build**: Bun workspaces + TypeScript project references

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.3.5+
- PostgreSQL 14+ (or use mock data mode for development without a database)

### Quick Start (No Database Required)

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Build all packages
bun run build

# Start with mock data (no database needed)
bun run dev:mock
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:3000) with mock data.

### Full Setup (With Database)

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Start local PostgreSQL (optional - uses pgserve)
bun run db:start

# Setup database (create user and database)
bun run db:setup

# Apply migrations
bun run db:migrate

# Build all packages
bun run build

# Start development servers
bun run dev           # Backend with hot reload
bun run frontend:dev  # Frontend dev server (in another terminal)
```

## Mock Data Mode

Run the application without a database using mock data. Perfect for rapid development, demos, and testing.

### Configuration

Control mock mode via `USE_MOCK_DATA` environment variable:

| Value | Behavior |
|-------|----------|
| `auto` (default) | Try database, fallback to mock if unavailable |
| `true` / `mock` | Force mock mode (no database connection) |
| `false` / `real` | Force real database (fails if unavailable) |

```bash
# Run both frontend and backend with mock data
bun run dev:mock

# Or run backend only with mock data
USE_MOCK_DATA=true bun run dev
```

See [CLAUDE.md](./CLAUDE.md) for details on adding mock data for new entities.

## Available Scripts

```bash
# Development
bun run dev              # Start backend with hot reload
bun run frontend:dev     # Start frontend dev server
bun run dev:mock         # Start both with mock data (no database)

# Database
bun run db:start         # Start local PostgreSQL (pgserve)
bun run db:setup         # Create database and user
bun run db:generate      # Generate Drizzle migrations
bun run db:migrate       # Apply migrations

# Building
bun run build            # Build all packages

# Testing
bun test                 # Run all tests

# Code Quality
bun run lint             # Check linting
bun run lint:fix         # Auto-fix linting
bun run format:check     # Check formatting
bun run format:fix       # Fix formatting
bun run typecheck        # Type check all packages

# Cleanup
bun run clean            # Remove dist folders and node_modules
```

## Project Structure

```
.
├── packages/
│   ├── protocol/      # Shared schemas and API definitions
│   │   └── src/
│   │       ├── Api.ts           # HTTP API specifications
│   │       ├── schemas/         # Effect Schema definitions
│   │       └── errors/          # Shared error types
│   │
│   ├── repo/          # Database layer
│   │   └── src/
│   │       ├── schema.ts        # Drizzle table definitions
│   │       ├── sql.ts           # SQL connection configuration
│   │       ├── mock/            # Mock data service
│   │       │   ├── MockDataStore.ts   # In-memory data store
│   │       │   ├── MockPgDrizzle.ts   # Mock Drizzle implementation
│   │       │   └── seed.ts            # Sample data
│   │       └── user-repo.ts     # User repository
│   │
│   ├── backend/       # Effect Platform HTTP server
│   │   └── src/
│   │       ├── api/             # API implementations
│   │       └── main.ts          # Server entry point
│   │
│   └── frontend/      # React SPA with MUI
│       └── src/
│           ├── components/      # Reusable components
│           ├── pages/           # Route pages
│           ├── hooks/           # Custom hooks
│           └── App.tsx          # Main app component
│
├── examples/          # Reference patterns for AI agents
│   ├── layouts/       # 12+ layout patterns (Grid, Stack, responsive)
│   ├── pages/         # Page templates (List, Detail, Form)
│   └── backend/       # API, schema, and repository examples
│
├── context/           # Domain knowledge for AI agents
│   ├── personas.md    # Government user personas
│   ├── suite-scope.md # Product suites (B&P, EAM, PLC, etc.)
│   └── tone-guidelines.md  # UX writing guidelines
│
├── scripts/           # Development scripts
│   └── dev-mock.sh    # Run frontend+backend with mock data
│
├── .claude/           # AI assistant configuration
│   └── ux-checklist.md  # UX compliance checklist
│
├── CLAUDE.md          # AI assistant guidelines
└── package.json       # Root workspace config
```

## Example Patterns

The `examples/` directory contains reference patterns for building consistent UIs:

### Layout Patterns (examples/layouts/)

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
| AccessibleFormLayout | Forms with full a11y support |

### Page Templates (examples/pages/)

| Template | Use Case |
|----------|----------|
| BaseTemplate | Foundation wrapper with PageHeader |
| ListPageTemplate | Data grid with search, filters, navigation |
| DetailPageTemplate | Entity view with sidebar actions |
| FormPageTemplate | Create/edit form with validation |

### Key Design Patterns

**PageHeader Flush Pattern**: PageHeader sits flush with the navbar (no extra padding):

```tsx
return (
  <>
    {/* PageHeader flush with navbar */}
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

**MUI Grid v2 syntax**: Use `size` prop instead of `xs`, `md`:

```tsx
<Grid size={{ xs: 12, md: 6 }}>Content</Grid>
```

## UX Principles

All examples follow OpenGov's four core UX principles:

1. **Purposeful and Human-Centric** - Friendly messaging, helpful empty states, clear error guidance
2. **One Platform, Unified Experience** - Consistent CDS components, persona-aware design, full accessibility
3. **Transparency by Design** - Audit trails, data attribution, explained automation
4. **AI-Enhanced, Human-Controlled** - AI assists but humans decide, confidence indicators, easy corrections

See `context/` for detailed personas and product suite information.

## Development Workflow

### Adding a New API Endpoint

1. **Define in protocol** (`packages/protocol/src/Api.ts`):
```typescript
export class MyApi extends HttpApiGroup.make('myFeature')
  .add(
    HttpApiEndpoint.get('list', '/items')
      .addSuccess(Schema.Array(ItemSchema))
  )
  .prefix('/api') {}
```

2. **Add repository** (`packages/repo/src/item-repo.ts`):
```typescript
export class ItemRepo extends Effect.Service<ItemRepo>()('ItemRepo', {
  effect: Effect.gen(function* () {
    const drizzle = yield* PgDrizzle;
    return {
      findAll: Effect.fn('ItemRepo.findAll')(function* () {
        return yield* drizzle.select().from(items);
      })
    };
  }),
  dependencies: []
}) {}
```

3. **Implement in backend** (`packages/backend/src/api/MyApi.ts`):
```typescript
export const MyApiLive = HttpApiBuilder.group(Api, 'myFeature', (handlers) =>
  Effect.gen(function* () {
    const repo = yield* ItemRepo;
    return handlers.handle('list', () => repo.findAll);
  }).pipe(Effect.provide(ItemRepo.Default))
);
```

4. **Register the implementation** in `packages/backend/src/main.ts`

5. **Add mock data** (optional) in `packages/repo/src/mock/seed.ts`

### Adding a New Page

1. Create page component in `packages/frontend/src/pages/`
2. Add route in `packages/frontend/src/App.tsx`
3. Create custom hooks in `packages/frontend/src/hooks/` for data fetching
4. Reference `examples/layouts/` and `examples/pages/` for patterns

## Code Standards

See [CLAUDE.md](./CLAUDE.md) for detailed coding standards including:
- Effect-TS patterns (Effect.fn, generators, Schema.make)
- Drizzle ORM patterns
- React/Frontend guidelines
- Mock data service usage
- Error handling
- Type safety rules

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_DATABASE` - Database name
- `DB_USERNAME` - Database user
- `DB_PASSWORD` - Database password

Optional:
- `USE_MOCK_DATA` - Control mock data mode (`auto`, `true`, `false`)

## Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

## Deployment

The project includes GitHub Actions CI that runs on every push:
- Linting and formatting checks
- Type checking
- Unit tests
- Production build

See `.github/workflows/ci.yml` for the full pipeline.

## License

UNLICENSED - OpenGov Internal Use Only
