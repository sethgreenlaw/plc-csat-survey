import type { FC } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { TrendingUp, TrendingDown, Account, ChartLine, CurrencyUsd, Folder } from '@opengov/react-capital-assets';

/**
 * Pattern 10: Dashboard Grid Layout
 *
 * Mixed-size widgets for dashboards.
 *
 * When to use:
 * - Analytics dashboards
 * - Admin overview pages
 * - KPI displays
 * - Any page with multiple metrics and charts
 *
 * Structure:
 * - Stat cards row: 4 equal columns for key metrics
 * - Charts row: Mixed sizes (8/4 or 6/6) for visualizations
 * - Bottom row: Equal-width panels for lists/tables
 *
 * Key patterns:
 * - Stats row: size={{ xs: 12, sm: 6, md: 3 }} for 4-column grid
 * - Large chart: size={{ xs: 12, lg: 8 }} for 2/3 width
 * - Small chart: size={{ xs: 12, lg: 4 }} for 1/3 width
 * - Use height prop on Paper for consistent widget heights
 * - TrendingUp/TrendingDown icons for change indicators
 */
export const DashboardGridLayout: FC = () => {
  const theme = useTheme();

  const stats = [
    { icon: Account, label: 'Total Users', value: '12,345', change: '+12%', positive: true },
    { icon: CurrencyUsd, label: 'Revenue', value: '$45,678', change: '+8%', positive: true },
    { icon: Folder, label: 'Orders', value: '1,234', change: '-3%', positive: false },
    { icon: ChartLine, label: 'Conversion', value: '3.2%', change: '+0.5%', positive: true }
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Dashboard Grid Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 10: Mixed-size widgets for dashboards and analytics
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Stats Row - 4 columns */}
      <Grid container spacing={3} role="region" aria-label="Key metrics">
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                height: '100%'
              }}
              role="article"
              aria-label={`${stat.label}: ${stat.value}, ${stat.change} change`}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <SvgIcon
                      component={stat.positive ? TrendingUp : TrendingDown}
                      inheritViewBox
                      sx={{
                        fontSize: 16,
                        color: stat.positive ? theme.palette.success.main : theme.palette.error.main
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: stat.positive ? theme.palette.success.main : theme.palette.error.main,
                        fontWeight: 500
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SvgIcon component={stat.icon} inheritViewBox />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row - Mixed sizes */}
      <Grid container spacing={3}>
        {/* Large Chart - 8 columns */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 350 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Revenue Over Time
            </Typography>
            <Box
              sx={{
                height: 'calc(100% - 40px)',
                bgcolor: theme.palette.action.hover,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography color="text.secondary">
                Line chart would render here
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Small Chart - 4 columns */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 350 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Traffic Sources
            </Typography>
            <Box
              sx={{
                height: 'calc(100% - 40px)',
                bgcolor: theme.palette.action.hover,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography color="text.secondary">
                Pie chart would render here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Row - Equal sizes */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Activity
            </Typography>
            <Box
              sx={{
                height: 'calc(100% - 40px)',
                bgcolor: theme.palette.action.hover,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography color="text.secondary">
                Activity list would render here
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Top Products
            </Typography>
            <Box
              sx={{
                height: 'calc(100% - 40px)',
                bgcolor: theme.palette.action.hover,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography color="text.secondary">
                Product list would render here
              </Typography>
            </Box>
          </Paper>
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
{`{/* Stats Row - 4 equal columns */}
<Grid container spacing={3}>
  {stats.map((stat) => (
    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.id}>
      <Paper>Stat Card</Paper>
    </Grid>
  ))}
</Grid>

{/* Charts Row - Mixed sizes */}
<Grid container spacing={3}>
  <Grid size={{ xs: 12, lg: 8 }}>
    <Paper>Large Chart (8 cols)</Paper>
  </Grid>
  <Grid size={{ xs: 12, lg: 4 }}>
    <Paper>Small Chart (4 cols)</Paper>
  </Grid>
</Grid>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
