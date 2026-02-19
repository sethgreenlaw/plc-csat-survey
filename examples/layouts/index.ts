/**
 * Capital Design System - Layout Patterns
 *
 * Reference patterns for AI coding agents building UIs with the Capital Design System.
 * Each layout demonstrates best practices for MUI Grid v2, Capital Design tokens,
 * and @opengov component packages.
 *
 * Usage:
 * - Import individual layouts: import { StandardPageLayout } from './layouts'
 * - Access metadata: import { layoutMetadata } from './layouts'
 * - Get all layouts: import { layouts } from './layouts'
 */

// Component exports
export { StandardPageLayout } from './StandardPageLayout';
export { TwoColumnLayout } from './TwoColumnLayout';
export { ThreeColumnLayout } from './ThreeColumnLayout';
export { CardGridLayout } from './CardGridLayout';
export { VerticalFormLayout } from './VerticalFormLayout';
export { HorizontalFormLayout } from './HorizontalFormLayout';
export { ListWithItemsLayout } from './ListWithItemsLayout';
export { TabbedLayout } from './TabbedLayout';
export { CenteredContentLayout } from './CenteredContentLayout';
export { DashboardGridLayout } from './DashboardGridLayout';
export { DetailsPageLayout } from './DetailsPageLayout';
export { DataTableLayout } from './DataTableLayout';

// UX Principles Components (AI First, Transparency, Accessibility)
export { AIAssistantPanel, AIAssistantPanelContent } from './AIAssistantPanel';
export {
  ContextualSuggestions,
  InlineSuggestionCard,
  PredictionBanner,
  SmartDefaultSuggestion,
  ProactiveWarningCard,
  FieldHintTooltip
} from './ContextualSuggestions';
export { AccessibleFormLayout } from './AccessibleFormLayout';
export {
  TransparencyComponents,
  AuditTrail,
  DataSourceCard,
  DecisionExplainer,
  ChangeHistoryItem
} from './TransparencyComponents';

/**
 * Layout metadata for AI agents to understand when to use each pattern.
 */
export interface LayoutMetadata {
  /** Unique identifier for the layout */
  id: string;
  /** Display name */
  name: string;
  /** Brief description of the pattern */
  description: string;
  /** Use cases where this pattern is appropriate */
  useCases: string[];
  /** Grid configuration used (MUI Grid v2 breakpoints) */
  gridConfig: string;
  /** Key MUI/CDS components used */
  keyComponents: string[];
  /** Category for grouping */
  category: 'page' | 'grid' | 'form' | 'list' | 'dashboard' | 'detail';
}

export const layoutMetadata: LayoutMetadata[] = [
  {
    id: 'standard-page',
    name: 'Standard Page Layout',
    description: 'Most common layout with PageHeader and content area',
    useCases: [
      'Most pages in your application',
      'List views and overview pages',
      'Dashboards with single content area',
      'Any page needing title, description, and content'
    ],
    gridConfig: 'Stack spacing={3} (no Grid)',
    keyComponents: ['PageHeaderComposable', 'Paper', 'Stack', 'Button'],
    category: 'page'
  },
  {
    id: 'two-column',
    name: 'Two-Column Layout',
    description: 'Details pages with 8/4 main content and sidebar split',
    useCases: [
      'Entity details pages',
      'User profiles',
      'Articles with related content',
      'Documentation pages'
    ],
    gridConfig: 'size={{ xs: 12, md: 8 }} / size={{ xs: 12, md: 4 }}',
    keyComponents: ['Grid', 'Paper', 'Stack', 'List'],
    category: 'page'
  },
  {
    id: 'three-column',
    name: 'Three-Column Layout',
    description: 'Admin panels with 2/7/3 navigation, content, and info panel',
    useCases: [
      'Admin panels with navigation',
      'Complex dashboards',
      'Workspaces',
      'Applications with persistent navigation'
    ],
    gridConfig: 'size={{ xs: 12, lg: 2 }} / size={{ xs: 12, lg: 7 }} / size={{ xs: 12, lg: 3 }}',
    keyComponents: ['Grid', 'ListItemButton', 'ListItemIcon', 'Paper'],
    category: 'page'
  },
  {
    id: 'card-grid',
    name: 'Card Grid Layout',
    description: 'Responsive card grid that scales 1-2-3-4 columns',
    useCases: [
      'Product or project listings',
      'Feature showcases',
      'Dashboard widgets',
      'Gallery views'
    ],
    gridConfig: 'size={{ xs: 12, sm: 6, md: 4, lg: 3 }}',
    keyComponents: ['Grid', 'Card', 'CardContent', 'CardActions', 'Chip'],
    category: 'grid'
  },
  {
    id: 'vertical-form',
    name: 'Vertical Form Layout',
    description: 'Standard forms with stacked fields and sections',
    useCases: [
      'User registration forms',
      'Settings pages',
      'Data entry forms',
      'Multi-section forms'
    ],
    gridConfig: 'Stack spacing={2.5} within sections, spacing={3} between',
    keyComponents: ['TextField', 'Select', 'FormControl', 'Divider', 'Button'],
    category: 'form'
  },
  {
    id: 'horizontal-form',
    name: 'Horizontal Form Layout',
    description: 'Inline filters and search controls with responsive stacking',
    useCases: [
      'Search bars above data tables',
      'Filter panels',
      'Quick action toolbars',
      'Inline filtering interfaces'
    ],
    gridConfig: 'Stack direction={{ xs: "column", md: "row" }}',
    keyComponents: ['TextField', 'Select', 'Chip', 'InputAdornment', 'Button'],
    category: 'form'
  },
  {
    id: 'list-with-items',
    name: 'List with Items Layout',
    description: 'Activity feeds and notifications with avatars/icons',
    useCases: [
      'Activity feeds and timelines',
      'Notification lists',
      'Message lists and inboxes',
      'Audit logs and history'
    ],
    gridConfig: 'List with ListItem (no Grid)',
    keyComponents: ['List', 'ListItem', 'ListItemAvatar', 'Avatar', 'Chip'],
    category: 'list'
  },
  {
    id: 'tabbed',
    name: 'Tabbed Layout',
    description: 'Multi-section pages with tab navigation',
    useCases: [
      'Settings pages with categories',
      'Profile pages with sections',
      'Configuration panels',
      'Related content sections'
    ],
    gridConfig: 'Tabs with TabPanel (no Grid)',
    keyComponents: ['Tabs', 'Tab', 'TabPanel (custom)', 'Paper'],
    category: 'page'
  },
  {
    id: 'centered-content',
    name: 'Centered Content Layout',
    description: 'Login, 404, and other focused content pages',
    useCases: [
      'Authentication pages (login, register)',
      'Error pages (404, 500)',
      'Single-focus content',
      'Confirmation pages'
    ],
    gridConfig: 'Box with display="flex" alignItems/justifyContent="center"',
    keyComponents: ['Box', 'Paper', 'Stack', 'TextField', 'Button'],
    category: 'page'
  },
  {
    id: 'dashboard-grid',
    name: 'Dashboard Grid Layout',
    description: 'Mixed-size stat cards and chart widgets',
    useCases: [
      'Analytics dashboards',
      'Admin overview pages',
      'KPI displays',
      'Multi-metric views'
    ],
    gridConfig: 'Stats: size={{ xs: 12, sm: 6, md: 3 }}, Charts: size={{ xs: 12, lg: 8 }} / size={{ xs: 12, lg: 4 }}',
    keyComponents: ['Grid', 'Paper', 'SvgIcon', 'TrendingUp/Down icons'],
    category: 'dashboard'
  },
  {
    id: 'details-page',
    name: 'Details Page Layout',
    description: 'Profile/entity details with header, sections, and sidebar',
    useCases: [
      'User profiles',
      'Product details',
      'Entity views (customers, orders)',
      'Detailed information pages'
    ],
    gridConfig: 'size={{ xs: 12, md: 8 }} / size={{ xs: 12, md: 4 }}',
    keyComponents: ['Avatar', 'Grid', 'Stack', 'Chip', 'List', 'Button'],
    category: 'detail'
  },
  {
    id: 'data-table',
    name: 'Data Table Layout',
    description: 'CRUD operations with OgGridTable and filters',
    useCases: [
      'Admin panels with data management',
      'List views with sorting/filtering',
      'Tabular data display',
      'CRUD interfaces'
    ],
    gridConfig: 'OgGridTable with Stack filters above',
    keyComponents: ['OgGridTable', 'PageHeaderComposable', 'TextField', 'Select', 'Button'],
    category: 'list'
  },
  // UX Principles - AI at the Core
  {
    id: 'ai-assistant',
    name: 'AI Assistant Panel',
    description: 'Context-aware AI assistance with role-based insights and suggestions',
    useCases: [
      'Dashboard sidebars with AI recommendations',
      'Workflow pages with intelligent guidance',
      'Any page where AI assists with next steps',
      'Consistent AI location across platform'
    ],
    gridConfig: 'Paper panel (typically 360px wide in sidebar)',
    keyComponents: ['Paper', 'Timeline', 'Avatar', 'Collapse', 'TextField'],
    category: 'detail'
  },
  {
    id: 'contextual-suggestions',
    name: 'Contextual Suggestions',
    description: 'Inline AI hints, predictions, and smart defaults',
    useCases: [
      'Inline hints within forms',
      'Field-level AI suggestions',
      'Predictive assistance',
      'Smart default explanations'
    ],
    gridConfig: 'Inline Paper cards (dismissible)',
    keyComponents: ['Paper', 'Alert', 'Chip', 'Tooltip', 'Collapse'],
    category: 'form'
  },
  // UX Principles - Accessibility
  {
    id: 'accessible-form',
    name: 'Accessible Form Layout',
    description: 'WCAG 2.1 AA compliant form with full accessibility support',
    useCases: [
      'Government forms (legally required)',
      'Forms for diverse user populations',
      'Any form requiring accessibility',
      'Reference for ARIA implementation'
    ],
    gridConfig: 'Stack with fieldsets for grouping',
    keyComponents: ['TextField', 'RadioGroup', 'Checkbox', 'Alert', 'FormControl'],
    category: 'form'
  },
  // UX Principles - Transparency
  {
    id: 'transparency',
    name: 'Transparency Components',
    description: 'Audit trails, data sources, and decision explanations',
    useCases: [
      'Activity history displays',
      'Data source attribution',
      'Decision/calculation explanations',
      'Change tracking and audit logs'
    ],
    gridConfig: 'Timeline and Paper cards',
    keyComponents: ['Timeline', 'Paper', 'Chip', 'Link', 'Collapse'],
    category: 'detail'
  }
];

/**
 * All layouts as an array for iteration.
 */
export const layouts = [
  { id: 'standard-page', component: 'StandardPageLayout' },
  { id: 'two-column', component: 'TwoColumnLayout' },
  { id: 'three-column', component: 'ThreeColumnLayout' },
  { id: 'card-grid', component: 'CardGridLayout' },
  { id: 'vertical-form', component: 'VerticalFormLayout' },
  { id: 'horizontal-form', component: 'HorizontalFormLayout' },
  { id: 'list-with-items', component: 'ListWithItemsLayout' },
  { id: 'tabbed', component: 'TabbedLayout' },
  { id: 'centered-content', component: 'CenteredContentLayout' },
  { id: 'dashboard-grid', component: 'DashboardGridLayout' },
  { id: 'details-page', component: 'DetailsPageLayout' },
  { id: 'data-table', component: 'DataTableLayout' },
  // UX Principles Components
  { id: 'ai-assistant', component: 'AIAssistantPanel' },
  { id: 'contextual-suggestions', component: 'ContextualSuggestions' },
  { id: 'accessible-form', component: 'AccessibleFormLayout' },
  { id: 'transparency', component: 'TransparencyComponents' }
] as const;

/**
 * Helper to get metadata by layout ID.
 */
export function getLayoutMetadata(id: string): LayoutMetadata | undefined {
  return layoutMetadata.find((meta) => meta.id === id);
}

/**
 * Helper to get layouts by category.
 */
export function getLayoutsByCategory(category: LayoutMetadata['category']): LayoutMetadata[] {
  return layoutMetadata.filter((meta) => meta.category === category);
}

/**
 * Layout patterns for navigation (backward compatible with old format).
 * Used by the demo app's navigation menu.
 */
export const layoutPatterns = [
  { id: 'standard', path: 'standard', label: '1. Standard Page', description: 'Most pages with header and content' },
  { id: 'two-column', path: 'two-column', label: '2. Two-Column', description: 'Details pages with sidebar' },
  { id: 'three-column', path: 'three-column', label: '3. Three-Column', description: 'Admin panels with nav + content + info' },
  { id: 'card-grid', path: 'card-grid', label: '4. Card Grid', description: 'Responsive product/dashboard cards' },
  { id: 'vertical-form', path: 'vertical-form', label: '5. Vertical Form', description: 'Standard forms with stacked fields' },
  { id: 'horizontal-form', path: 'horizontal-form', label: '6. Horizontal Form', description: 'Inline filters and search' },
  { id: 'list', path: 'list', label: '7. List with Items', description: 'Activity feeds, notifications' },
  { id: 'tabbed', path: 'tabbed', label: '8. Tabbed', description: 'Multi-section pages' },
  { id: 'centered', path: 'centered', label: '9. Centered Content', description: 'Login pages, 404 pages' },
  { id: 'dashboard', path: 'dashboard', label: '10. Dashboard Grid', description: 'Mixed-size widgets' },
  { id: 'details', path: 'details', label: '11. Details Page', description: 'Profile/entity details' },
  { id: 'data-table', path: 'data-table', label: '12. Data Table', description: 'CRUD operations' },
  // UX Principles Patterns
  { id: 'ai-assistant', path: 'ai-assistant', label: '13. AI Assistant', description: 'AI First - Context-aware assistance' },
  { id: 'contextual-suggestions', path: 'contextual-suggestions', label: '14. Contextual Suggestions', description: 'AI First - Inline hints and predictions' },
  { id: 'accessible-form', path: 'accessible-form', label: '15. Accessible Form', description: 'WCAG 2.1 AA compliant form' },
  { id: 'transparency', path: 'transparency', label: '16. Transparency', description: 'Audit trails and data sources' }
] as const;

/**
 * Quick reference for Grid breakpoints (MUI v2 syntax):
 *
 * Breakpoint | Width    | Example
 * -----------|----------|----------------------------------
 * xs         | 0px+     | size={{ xs: 12 }}  (full width)
 * sm         | 600px+   | size={{ sm: 6 }}   (half width)
 * md         | 900px+   | size={{ md: 4 }}   (third width)
 * lg         | 1200px+  | size={{ lg: 3 }}   (quarter width)
 * xl         | 1536px+  | size={{ xl: 2 }}   (sixth width)
 *
 * Common patterns:
 * - 2 columns: size={{ xs: 12, md: 6 }}
 * - 3 columns: size={{ xs: 12, md: 4 }}
 * - 4 columns: size={{ xs: 12, sm: 6, md: 3 }}
 * - 8/4 split: size={{ xs: 12, md: 8 }} and size={{ xs: 12, md: 4 }}
 * - Responsive 1-2-3-4: size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
 */
