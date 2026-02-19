# Examples

This directory contains reference patterns and examples for AI coding agents building applications with Effect-TS, Drizzle ORM, and the Capital Design System.

**Important**: These files are reference material, not part of the application. Use them as templates when building new features.

## Directory Structure

```
examples/
├── README.md           # This file
├── layouts/            # 12 common layout patterns (visual structure)
│   ├── index.ts
│   ├── StandardPageLayout.tsx
│   ├── TwoColumnLayout.tsx
│   ├── ThreeColumnLayout.tsx
│   ├── CardGridLayout.tsx
│   ├── VerticalFormLayout.tsx
│   ├── HorizontalFormLayout.tsx
│   ├── ListWithItemsLayout.tsx
│   ├── TabbedLayout.tsx
│   ├── CenteredContentLayout.tsx
│   ├── DashboardGridLayout.tsx
│   ├── DetailsPageLayout.tsx
│   └── DataTableLayout.tsx
├── pages/              # Page templates (operational patterns)
│   ├── index.ts
│   ├── BaseTemplate.tsx
│   ├── ListPageTemplate.tsx
│   ├── DetailPageTemplate.tsx
│   └── FormPageTemplate.tsx
└── backend/            # Backend service examples
    ├── README.md       # Detailed backend patterns
    ├── schemas/        # Effect Schema definitions
    │   ├── Asset.ts    # EAM: Infrastructure assets
    │   ├── WorkOrder.ts # EAM: Maintenance work orders
    │   └── Permit.ts   # PLC: Permit applications
    ├── apis/           # HttpApi endpoint definitions
    │   ├── AssetsApi.ts
    │   ├── WorkOrdersApi.ts
    │   └── PermitsApi.ts
    └── repos/          # Drizzle ORM repository patterns
        ├── asset-repo.ts
        ├── work-order-repo.ts
        └── permit-repo.ts
```

## Three Types of Examples

### Layout Patterns (layouts/)
**Visual structure patterns** - How to arrange content on screen.
- Grid configurations, column arrangements
- Responsive breakpoints
- Component composition

### Page Templates (pages/)
**Operational patterns** - Full working pages with behavior.
- State management
- Routing and navigation
- CRUD operations (list, view, create, edit)
- Validation and error handling
- Confirmation dialogs

### Backend Examples (backend/)
**Service patterns** - APIs, data models, and repositories.
- Effect Schema definitions for government domains
- Protocol-driven API specifications
- Drizzle ORM repository patterns with Effect-TS

## OpenGov Domains

The backend examples cover common government software domains:

| Domain | Description | Examples |
|--------|-------------|----------|
| **EAM** | Enterprise Asset Management | Assets, Work Orders, Work Logs |
| **PLC** | Permitting & Licensing | Permits, Applicants, Inspections, Reviews |

## UX Principles

These examples are aligned with OpenGov's four core UX principles:

### 1. Purposeful and Human-Centric
- Friendly, helpful messaging throughout
- Empty states guide users to next steps
- Error messages explain how to fix issues
- Confirmation dialogs are reassuring, not alarming

### 2. One Platform, Unified Experience
- Consistent Capital Design System components
- Familiar patterns across all products
- Persona-aware design (see `context/personas.md`)
- Full accessibility support (WCAG 2.1 AA)

### 3. Transparency by Design
- Audit trails show who did what and when
- Data sources are attributed and linked
- Automated decisions are explained
- Users understand WHY things happened

### 4. AI at the Core (AI First)
- AI assistant in consistent location
- Context-aware suggestions
- Role-based insights and predictions
- Smart defaults with explanations

See `context/tone-guidelines.md` for messaging examples and `.claude/ux-checklist.md` for the full checklist.

---

## Layout Patterns

### 1. Standard Page Layout
Most common layout for pages with a header and content area.
- **Use for**: List views, dashboards, general pages
- **Key**: PageHeaderComposable + Stack + Paper

### 2. Two-Column Layout
Details pages with main content (8 cols) and sidebar (4 cols).
- **Use for**: Entity details, profiles, articles
- **Key**: Grid with `size={{ xs: 12, md: 8 }}` / `size={{ xs: 12, md: 4 }}`

### 3. Three-Column Layout
Admin panels with navigation (2 cols), content (7 cols), and info panel (3 cols).
- **Use for**: Admin dashboards, workspaces
- **Key**: Grid with `size={{ xs: 12, lg: 2 }}` / `size={{ xs: 12, lg: 7 }}` / `size={{ xs: 12, lg: 3 }}`

### 4. Card Grid Layout
Responsive grid of cards that adapts to screen size.
- **Use for**: Product listings, project galleries, feature showcases
- **Key**: Grid with `size={{ xs: 12, sm: 6, md: 4, lg: 3 }}`
- **Responsive**: 1 → 2 → 3 → 4 columns as screen grows

### 5. Vertical Form Layout
Standard forms with stacked fields and sections.
- **Use for**: User registration, settings, data entry
- **Key**: Stack with `spacing={3}`, sections separated by Divider

### 6. Horizontal Form Layout
Inline filters and search controls.
- **Use for**: Search bars, filter panels, quick actions
- **Key**: Stack with `direction={{ xs: 'column', md: 'row' }}`

### 7. List with Items Layout
Activity feeds, notifications, and item lists.
- **Use for**: Activity feeds, notifications, logs
- **Key**: List with ListItemAvatar, ListItemText, secondaryAction

### 8. Tabbed Layout
Multi-section pages with tab navigation.
- **Use for**: Settings pages, profiles, configuration
- **Key**: Tabs + TabPanel pattern

### 9. Centered Content Layout
Vertically and horizontally centered content.
- **Use for**: Login pages, 404 pages, single-focus content
- **Key**: Box with `display: 'flex'`, `alignItems: 'center'`, `justifyContent: 'center'`

### 10. Dashboard Grid Layout
Mixed-size widgets for dashboards.
- **Use for**: Analytics dashboards, admin panels, overview pages
- **Key**: Multiple Grid rows with varying column spans

### 11. Details Page Layout
Profile or entity details with sections.
- **Use for**: User profiles, product details, entity views
- **Key**: Avatar header + detail sections + sidebar

### 12. Data Table Layout
CRUD operations with data tables.
- **Use for**: Admin panels, data management, list views
- **Key**: OgGridTable + filter bar + PageHeader with actions

### 13. AI Assistant Panel (UX: AI First)
Context-aware AI assistance with role-based insights.
- **Use for**: Dashboard sidebars, workflow guidance, intelligent assistance
- **Key**: Consistent location, explainable suggestions, personalized greeting

### 14. Contextual Suggestions (UX: AI First)
Inline AI hints, predictions, and smart defaults.
- **Use for**: Form assistance, predictive help, smart defaults
- **Key**: Dismissible, explained with "why", confidence levels

### 15. Accessible Form Layout (UX: Unified Experience)
WCAG 2.1 AA compliant form with full accessibility.
- **Use for**: Government forms, inclusive design, accessibility reference
- **Key**: ARIA labels, keyboard navigation, screen reader announcements

### 16. Transparency Components (UX: Transparency)
Audit trails, data sources, and decision explanations.
- **Use for**: Activity history, data attribution, calculation breakdowns
- **Key**: WHO did WHAT, WHEN, and WHY

## Page Templates

### Base Template
Foundation wrapper for all pages with PageHeader.
- **Use for**: Any page that needs header + content
- **Key**: Wraps content with PageHeaderComposable

### List Page Template
Data grid with search, filters, and CRUD navigation.
- **Use for**: Entity lists, admin panels, data management
- **Key features**:
  - OgGridTable integration
  - Search and status filters
  - Empty state handling
  - Row click navigation
  - Create button action

### Detail Page Template
Entity view with sidebar actions and metadata.
- **Use for**: Entity details, profiles, document viewers
- **Key features**:
  - Two-column layout (8/4)
  - Breadcrumb navigation
  - Status chip display
  - Action buttons (Edit, Duplicate, Archive, Delete)
  - Confirmation dialogs
  - Metadata sidebar

### Form Page Template
Create/edit form with validation and settings.
- **Use for**: Create new entity, edit existing, settings forms
- **Key features**:
  - Two-column layout (8/4)
  - Field validation with errors
  - Unsaved changes warning
  - Loading states during save
  - Edit/create mode detection

## Backend Examples

### Schema Patterns
Effect Schema definitions for type-safe data models:
- **Asset**: Infrastructure assets with condition tracking
- **WorkOrder**: Maintenance work orders with status workflow
- **Permit**: Permit applications with reviews and inspections

### API Patterns
Protocol-driven HttpApi definitions:
- CRUD endpoints with pagination and filtering
- Workflow actions (submit, approve, complete)
- Nested resources (work logs, inspections)

### Repository Patterns
Drizzle ORM with Effect-TS integration:
- Filtered queries with dynamic where clauses
- Sequence generation for unique identifiers
- Status transitions with timestamp updates
- Aggregation queries for dashboards

See [backend/README.md](./backend/README.md) for detailed patterns.

## Key Components

### From Capital Design System
- `PageHeaderComposable` - Page headers with title, description, actions
- `OgGridTable` - Data tables with sorting, filtering, pagination
- Icons from `@opengov/react-capital-assets`

### From MUI
- `Grid` (v2) - Use `size` prop: `<Grid size={{ xs: 12, md: 6 }}>`
- `Stack` - Vertical/horizontal layouts with spacing
- `Paper` - Elevated content containers
- `Box` - Generic flex container

## MUI Grid v2 Breakpoints

```typescript
// Breakpoint values
xs: 0px    // Extra small (phones)
sm: 600px  // Small (tablets)
md: 900px  // Medium (small laptops)
lg: 1200px // Large (desktops)
xl: 1536px // Extra large (large monitors)

// Usage
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
  {/* Full → Half → Third → Quarter as screen grows */}
</Grid>
```

## Usage Guidelines

### Frontend
1. **Always use theme colors** - Use `theme.palette.*` instead of hardcoded hex values
2. **Responsive first** - Use responsive breakpoints for all layouts
3. **Stack for simple layouts** - Use Stack with spacing for vertical/horizontal alignment
4. **Grid for complex layouts** - Use Grid for multi-column responsive layouts
5. **Consistent spacing** - Use `spacing={3}` (24px) for major sections, `spacing={2}` (16px) for subsections

### Backend
1. **Protocol First** - Define schemas in protocol package, share between frontend and backend
2. **Type Safety** - Use `Effect.fn` for all repository methods
3. **Error Types** - Use tagged errors for proper error handling
4. **Pagination** - Always support limit/offset for list endpoints
5. **Timestamps** - Auto-update `updatedAt` on all mutations

## Using Templates

### Frontend Pages
1. Copy the template file to your pages directory
2. Replace all `ENTITY_NAME` placeholders with your entity name
3. Customize the entity type interface
4. Update column definitions (list) or form fields
5. Connect to your real API

### Backend Services
1. Copy schema, API, and repo examples
2. Update entity fields to match your domain
3. Add/remove workflow actions as needed
4. Register API handlers in backend index
5. Run migrations for new tables
