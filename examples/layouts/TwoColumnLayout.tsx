import type { FC } from 'react';
import { Box, Grid, Paper, Stack, Typography, List, ListItem, ListItemText, Divider, useTheme } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';

/**
 * Pattern 2: Two-Column Layout
 *
 * Details pages with main content and a sidebar.
 *
 * When to use:
 * - Entity details pages (user profiles, product details)
 * - Articles with related content sidebar
 * - Documentation pages with navigation
 * - Any page needing primary content with supplementary info
 *
 * Structure:
 * - Main content area: 8 columns on desktop, full width on mobile
 * - Sidebar: 4 columns on desktop, stacks below on mobile
 *
 * Key patterns:
 * - Use MUI Grid v2 with size prop: size={{ xs: 12, md: 8 }}
 * - Responsive stacking: columns stack vertically on mobile
 * - Sidebar can contain multiple Paper sections in a Stack
 */
export const TwoColumnLayout: FC = () => {
  const theme = useTheme();

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Two-Column Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 2: Details pages with main content and sidebar
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Two Column Grid */}
      <Grid container spacing={3}>
        {/* Main Content - 8 columns on md+, full width on mobile */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Main Content
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              This area takes up 8 columns on desktop and stacks to full width on mobile.
              Perfect for the primary content of a details page.
            </Typography>

            <Stack spacing={2}>
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
                  sx={{
                    p: 3,
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Section {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Content for section {item}. This could be any detailed information.
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Sidebar - 4 columns on md+, full width on mobile */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Sidebar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                4 columns on desktop, stacks below main content on mobile.
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Related Items
              </Typography>
              <List dense disablePadding>
                {['Item A', 'Item B', 'Item C'].map((item, index) => (
                  <Box key={item}>
                    {index > 0 && <Divider />}
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText primary={item} />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

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
{`{/* Two-Column Layout: 8/4 split */}
<Grid container spacing={3}>
  {/* Main content: 8 cols on md+, full width on mobile */}
  <Grid size={{ xs: 12, md: 8 }}>
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      Main Content
    </Paper>
  </Grid>

  {/* Sidebar: 4 cols on md+, stacks below on mobile */}
  <Grid size={{ xs: 12, md: 4 }}>
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        Sidebar Section 1
      </Paper>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        Sidebar Section 2
      </Paper>
    </Stack>
  </Grid>
</Grid>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
