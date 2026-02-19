import type { FC } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Folder, Account, ChartLine, Cog, DatabaseOutline, Security } from '@opengov/react-capital-assets';

/**
 * Pattern 4: Card Grid Layout
 *
 * Responsive grid of cards for products, projects, or dashboard items.
 *
 * When to use:
 * - Product or project listings
 * - Feature showcases
 * - Dashboard widgets
 * - Gallery views
 * - Any collection of similar items
 *
 * Responsive behavior:
 * - xs (0px+):    1 card per row (12 cols)
 * - sm (600px+):  2 cards per row (6 cols each)
 * - md (900px+):  3 cards per row (4 cols each)
 * - lg (1200px+): 4 cards per row (3 cols each)
 *
 * Key patterns:
 * - Cards use height: '100%' for equal heights in rows
 * - Card hover effects with transition and boxShadow
 * - CardContent with flexGrow: 1 pushes CardActions to bottom
 * - Use Chip for status indicators
 */
export const CardGridLayout: FC = () => {
  const theme = useTheme();

  const cards = [
    { icon: Folder, title: 'Projects', description: 'Manage your projects', count: 12, status: 'Active' },
    { icon: Account, title: 'Team', description: 'Collaborate with team', count: 8, status: 'Active' },
    { icon: ChartLine, title: 'Analytics', description: 'View insights', count: 24, status: 'New' },
    { icon: DatabaseOutline, title: 'Data', description: 'Manage datasets', count: 156, status: 'Active' },
    { icon: Security, title: 'Security', description: 'Access controls', count: 3, status: 'Warning' },
    { icon: Cog, title: 'Settings', description: 'Configure system', count: 15, status: 'Active' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'info';
      case 'Warning': return 'warning';
      default: return 'success';
    }
  };

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Card Grid Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 4: Responsive card grid (1-2-3-4 columns as screen grows)
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Card Grid */}
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={card.title}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
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
                    <SvgIcon component={card.icon} inheritViewBox />
                  </Box>
                  <Chip
                    label={card.status}
                    size="small"
                    color={getStatusColor(card.status)}
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Typography variant="h4" color="primary">
                  {card.count}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  color="primary"
                  aria-label={`View details for ${card.title}`}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
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
  {items.map((item) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
      <Card>
        <CardContent>{item.content}</CardContent>
        <CardActions>
          <Button>View</Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>

/* Responsive Behavior:
 * xs (0px+):    1 card per row
 * sm (600px+):  2 cards per row
 * md (900px+):  3 cards per row
 * lg (1200px+): 4 cards per row
 */`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
