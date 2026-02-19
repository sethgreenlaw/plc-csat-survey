/**
 * Page Templates
 *
 * Quick-start templates for common page types. These are operational patterns
 * with state management, routing, and CRUD operations.
 *
 * Usage:
 * 1. Copy the template to your pages directory
 * 2. Replace ENTITY_NAME placeholders with your entity name
 * 3. Customize fields, validation, and API calls
 *
 * Templates complement the layout patterns in examples/layouts/ which focus
 * on visual structure rather than behavior.
 */

export { BaseTemplate } from './BaseTemplate';
export { ENTITY_NAME_ListPage } from './ListPageTemplate';
export { ENTITY_NAME_DetailPage } from './DetailPageTemplate';
export { ENTITY_NAME_FormPage } from './FormPageTemplate';

/**
 * Page template metadata for AI agents
 */
export interface PageTemplateMetadata {
  id: string;
  name: string;
  description: string;
  useCases: string[];
  keyFeatures: string[];
  relatedLayout: string;
}

export const pageTemplateMetadata: PageTemplateMetadata[] = [
  {
    id: 'base',
    name: 'Base Template',
    description: 'Foundation wrapper with PageHeader for all pages',
    useCases: [
      'Wrapping simple pages',
      'Starting point for custom layouts',
      'Pages that need just header + content'
    ],
    keyFeatures: [
      'PageHeaderComposable integration',
      'Flexible content area',
      'Optional actions slot'
    ],
    relatedLayout: 'StandardPageLayout'
  },
  {
    id: 'list',
    name: 'List Page Template',
    description: 'Data grid with search, filters, and CRUD navigation',
    useCases: [
      'Entity list views',
      'Admin panels',
      'Data management interfaces',
      'Searchable collections'
    ],
    keyFeatures: [
      'OgGridTable integration',
      'Search and status filters',
      'Empty state handling',
      'Row click navigation',
      'Create button action'
    ],
    relatedLayout: 'DataTableLayout'
  },
  {
    id: 'detail',
    name: 'Detail Page Template',
    description: 'Entity view with sidebar actions and metadata',
    useCases: [
      'Entity detail views',
      'Profile pages',
      'Document viewers',
      'Record displays'
    ],
    keyFeatures: [
      'Two-column layout (8/4)',
      'Breadcrumb navigation',
      'Status chip display',
      'Action buttons with dialogs',
      'Metadata sidebar',
      'Delete/archive confirmations'
    ],
    relatedLayout: 'DetailsPageLayout'
  },
  {
    id: 'form',
    name: 'Form Page Template',
    description: 'Create/edit form with validation and settings sidebar',
    useCases: [
      'Create new entity',
      'Edit existing entity',
      'Settings forms',
      'Data entry interfaces'
    ],
    keyFeatures: [
      'Two-column layout (8/4)',
      'Field validation with errors',
      'Unsaved changes warning',
      'Loading states',
      'Settings sidebar',
      'Edit/create mode detection'
    ],
    relatedLayout: 'VerticalFormLayout'
  }
];

/**
 * Get template metadata by ID
 */
export function getPageTemplateMetadata(id: string): PageTemplateMetadata | undefined {
  return pageTemplateMetadata.find(t => t.id === id);
}
