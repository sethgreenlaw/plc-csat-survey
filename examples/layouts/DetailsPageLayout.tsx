import type { FC } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Pencil, Email, Phone, MapMaker, Calendar, Account as AccountIcon } from '@opengov/react-capital-assets';

/**
 * Pattern 11: Details Page with Sections
 *
 * Profile or entity details pages.
 *
 * When to use:
 * - User profiles
 * - Product details
 * - Entity views (customers, orders, etc.)
 * - Any page showing detailed information about a single item
 *
 * Structure:
 * - Main content (8 columns): Profile header, detail sections
 * - Sidebar (4 columns): Quick actions, related items
 * - Profile header with avatar, name, role, status
 * - Multiple detail sections with icons
 *
 * Key patterns:
 * - Avatar with large size (100x100) for profile
 * - Stack direction={{ xs: 'column', sm: 'row' }} for responsive header
 * - Grid container inside sections for detail items
 * - Icon boxes with theme.palette.action.selected background
 * - Quick action buttons in sidebar
 */
export const DetailsPageLayout: FC = () => {
  const theme = useTheme();

  const user = {
    name: 'Jane Smith',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'January 15, 2022',
    status: 'Active'
  };

  const detailItems = [
    { icon: Email, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone },
    { icon: MapMaker, label: 'Location', value: user.location },
    { icon: Calendar, label: 'Join Date', value: user.joinDate },
    { icon: AccountIcon, label: 'Department', value: user.department }
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Details Page Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 11: Profile or entity details with sections
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Profile Header */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ xs: 'center', sm: 'flex-start' }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: theme.palette.primary.main,
                    fontSize: 40
                  }}
                >
                  JS
                </Avatar>
                <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', sm: 'flex-start' }}
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {user.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {user.role}
                      </Typography>
                      <Chip label={user.status} size="small" color="success" />
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<SvgIcon component={Pencil} inheritViewBox />}
                      aria-label={`Edit ${user.name}'s profile`}
                    >
                      Edit Profile
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Contact Information */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                {detailItems.map((item) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: theme.palette.action.selected,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <SvgIcon
                          component={item.icon}
                          inheritViewBox
                          sx={{ fontSize: 20, color: theme.palette.primary.main }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body2">{item.value}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Activity Section */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Activity
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
                  Activity timeline would render here
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Quick Actions */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" component="h3" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1} role="group" aria-label="Quick actions">
                <Button variant="outlined" fullWidth size="small" aria-label={`Send message to ${user.name}`}>
                  Send Message
                </Button>
                <Button variant="outlined" fullWidth size="small" aria-label={`Schedule meeting with ${user.name}`}>
                  Schedule Meeting
                </Button>
                <Button variant="outlined" fullWidth size="small" color="error" aria-label={`Deactivate ${user.name}'s account`}>
                  Deactivate Account
                </Button>
              </Stack>
            </Paper>

            {/* Team Members */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Team Members
              </Typography>
              <List dense disablePadding>
                {['Alice Johnson', 'Bob Williams', 'Carol Davis'].map((name, index) => (
                  <Box key={name}>
                    {index > 0 && <Divider />}
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText primary={name} secondary="Engineer" />
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
{`<Grid container spacing={3}>
  {/* Main Content */}
  <Grid size={{ xs: 12, md: 8 }}>
    <Stack spacing={3}>
      {/* Profile Header with Avatar */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={3}>
          <Avatar sx={{ width: 100, height: 100 }}>JS</Avatar>
          <Box>
            <Typography variant="h5">Name</Typography>
            <Typography color="text.secondary">Role</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Detail Sections */}
      <Paper sx={{ p: 3 }}>Section 1</Paper>
      <Paper sx={{ p: 3 }}>Section 2</Paper>
    </Stack>
  </Grid>

  {/* Sidebar */}
  <Grid size={{ xs: 12, md: 4 }}>
    <Paper sx={{ p: 3 }}>Actions & Related</Paper>
  </Grid>
</Grid>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
