/**
 * Base Page Template
 *
 * Foundation template for all pages. Every page should use PageHeaderComposable.
 *
 * Usage:
 * - Wrap your page content with this template
 * - Always include a title
 * - Description is optional but recommended
 */

import type { FC, ReactNode } from 'react';
import { Box } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';

interface BaseTemplateProps {
  title: string;
  description?: string;
  actions?: ReactNode[];
  children: ReactNode;
}

export const BaseTemplate: FC<BaseTemplateProps> = ({
  title,
  description,
  actions,
  children
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Required: Every page must have PageHeaderComposable */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header {...(actions ? { actions } : {})}>
          <PageHeaderComposable.Title>{title}</PageHeaderComposable.Title>
          {description && (
            <PageHeaderComposable.Description>{description}</PageHeaderComposable.Description>
          )}
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content Area */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
};
