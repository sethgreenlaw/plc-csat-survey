import type { FC } from 'react';
import { Box, Paper, Stack, Typography, Button, SvgIcon, useTheme } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Plus, Download } from '@opengov/react-capital-assets';

/**
 * Pattern 1: Standard Page Layout
 *
 * The most common layout for pages with a header and content area.
 *
 * When to use:
 * - Most pages in your application
 * - List views and overview pages
 * - Dashboards with single content area
 * - Any page that needs a title, description, and primary content
 *
 * Structure:
 * - PageHeader with title, description, and actions
 * - Content area with proper spacing using Stack
 *
 * Key patterns:
 * - Use Stack with spacing={3} for consistent vertical rhythm
 * - PageHeaderComposable provides title, description, and actions
 * - Paper with variant="outlined" for content sections
 * - Use theme.palette for colors, never hardcode hex values
 */
export const StandardPageLayout: FC = () => {
  const theme = useTheme();

  const headerActions = [
    <Button
      key="export"
      variant="outlined"
      color="inherit"
      startIcon={<SvgIcon component={Download} inheritViewBox />}
    >
      Export
    </Button>,
    <Button
      key="add"
      variant="contained"
      color="primary"
      startIcon={<SvgIcon component={Plus} inheritViewBox />}
    >
      Add New
    </Button>
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header actions={headerActions}>
          <PageHeaderComposable.Title>Standard Page Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 1: The most common layout for pages with header and content
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Main Content */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Content Area
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This is where your main page content goes. The PageHeader provides context
          and actions, while the content area below handles the primary functionality.
        </Typography>

        <Box
          sx={{
            p: 4,
            bgcolor: theme.palette.action.hover,
            borderRadius: 1,
            textAlign: 'center'
          }}
        >
          <Typography color="text.secondary">
            Your content here
          </Typography>
        </Box>
      </Paper>

      {/* Code Example */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
          Code Pattern
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: theme.palette.grey[900],
            color: theme.palette.grey[100],
            borderRadius: 1,
            overflow: 'auto',
            fontSize: theme.typography.caption.fontSize,
            fontFamily: 'monospace'
          }}
        >
{`{/* PageHeader sits flush with navbar - no padding above */}
<>
  <PageHeaderComposable>
    <PageHeaderComposable.Header actions={actions}>
      <PageHeaderComposable.Title>Page Title</PageHeaderComposable.Title>
      <PageHeaderComposable.Description>
        Page description
      </PageHeaderComposable.Description>
    </PageHeaderComposable.Header>
  </PageHeaderComposable>

  {/* Content area with padding */}
  <Box sx={{ p: 3 }}>
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        {/* Main content */}
      </Paper>
    </Stack>
  </Box>
</>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
