import type { FC } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Home, Account, Cog, Folder, ChartLine, Security } from '@opengov/react-capital-assets';

/**
 * Pattern 3: Three-Column Layout
 *
 * Dashboards with navigation, main content, and info panel.
 *
 * When to use:
 * - Admin panels with sidebar navigation
 * - Complex dashboards with contextual info
 * - Workspaces requiring quick navigation and info panels
 * - Applications with persistent navigation needs
 *
 * Structure:
 * - Left navigation: 2 columns on lg+
 * - Main content: 7 columns on lg+
 * - Right info panel: 3 columns on lg+
 * - All columns stack vertically on smaller screens
 *
 * Key patterns:
 * - Use lg breakpoint (1200px) for three-column layouts
 * - Navigation uses ListItemButton with icons
 * - Info panel contains quick stats and activity
 */
export const ThreeColumnLayout: FC = () => {
  const theme = useTheme();

  const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Account, label: 'Users' },
    { icon: Folder, label: 'Projects' },
    { icon: ChartLine, label: 'Analytics' },
    { icon: Security, label: 'Security' },
    { icon: Cog, label: 'Settings' }
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Three-Column Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 3: Admin panels with navigation, content, and info panel
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Three Column Grid */}
      <Grid container spacing={3}>
        {/* Left Navigation - 2 columns on lg+, hidden on smaller */}
        <Grid size={{ xs: 12, lg: 2 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="overline" sx={{ px: 2, color: theme.palette.text.secondary }}>
              Navigation
            </Typography>
            <List dense>
              {navItems.map(({ icon, label, active }) => (
                <ListItemButton
                  key={label}
                  selected={active ?? false}
                  aria-current={active ? 'page' : undefined}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SvgIcon
                      component={icon}
                      inheritViewBox
                      sx={{
                        fontSize: 20,
                        color: active ? theme.palette.primary.main : theme.palette.text.secondary
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: active ? 600 : 400
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content - 7 columns on lg+, full on smaller */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Main Content Area
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              This is the primary workspace area. It takes 7 columns on large screens
              and expands to full width on smaller devices.
            </Typography>

            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid size={{ xs: 6 }} key={item}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: theme.palette.action.hover,
                      borderRadius: 1,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {item * 25}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Metric {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Right Info Panel - 3 columns on lg+, full on smaller */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Quick Info
              </Typography>
              <Stack spacing={1}>
                {['Status: Active', 'Last updated: Today', 'Version: 2.1.0'].map((info) => (
                  <Typography key={info} variant="body2" color="text.secondary">
                    {info}
                  </Typography>
                ))}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Stack spacing={1}>
                {['User logged in', 'Settings updated', 'Report generated'].map((activity) => (
                  <Typography key={activity} variant="body2" color="text.secondary">
                    {activity}
                  </Typography>
                ))}
              </Stack>
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
{`<Grid container spacing={3}>
  {/* Left Nav: 2 cols on lg+ */}
  <Grid size={{ xs: 12, lg: 2 }}>
    <Paper>Navigation</Paper>
  </Grid>

  {/* Main: 7 cols on lg+ */}
  <Grid size={{ xs: 12, lg: 7 }}>
    <Paper>Main Content</Paper>
  </Grid>

  {/* Right Panel: 3 cols on lg+ */}
  <Grid size={{ xs: 12, lg: 3 }}>
    <Paper>Info Panel</Paper>
  </Grid>
</Grid>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
