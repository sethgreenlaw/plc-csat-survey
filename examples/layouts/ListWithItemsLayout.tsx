import type { FC } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Account, Bell, CheckCircle, AlertCircle, Folder } from '@opengov/react-capital-assets';

/**
 * Pattern 7: List with Items Layout
 *
 * Activity feeds, notifications, and item lists.
 *
 * When to use:
 * - Activity feeds and timelines
 * - Notification lists
 * - Message lists and inboxes
 * - Audit logs and history views
 * - Any chronological or ordered list of items
 *
 * Structure:
 * - List items with avatars/icons
 * - Primary and secondary text
 * - Metadata (time, status) as secondary action
 *
 * Key patterns:
 * - ListItem with alignItems="flex-start" for multi-line content
 * - ListItemAvatar with Avatar containing icons
 * - secondaryAction for timestamps and status chips
 * - Divider component="li" between items
 * - Hover effect with bgcolor: theme.palette.action.hover
 */
export const ListWithItemsLayout: FC = () => {
  const theme = useTheme();

  const activities = [
    {
      icon: Account,
      iconColor: theme.palette.primary.main,
      primary: 'John Smith joined the team',
      secondary: 'Engineering department',
      time: '5 minutes ago',
      type: 'info'
    },
    {
      icon: CheckCircle,
      iconColor: theme.palette.success.main,
      primary: 'Project deployment completed',
      secondary: 'Production environment updated successfully',
      time: '1 hour ago',
      type: 'success'
    },
    {
      icon: AlertCircle,
      iconColor: theme.palette.warning.main,
      primary: 'Memory usage warning',
      secondary: 'Server cluster A is at 85% capacity',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      icon: Folder,
      iconColor: theme.palette.info.main,
      primary: 'New document uploaded',
      secondary: 'Q4 Financial Report.pdf',
      time: '3 hours ago',
      type: 'info'
    },
    {
      icon: Bell,
      iconColor: theme.palette.secondary.main,
      primary: 'System maintenance scheduled',
      secondary: 'Planned downtime on Saturday 2AM-4AM',
      time: 'Yesterday',
      type: 'default'
    }
  ];

  const getChipColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>List with Items Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 7: Activity feeds, notifications, and item lists
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Activity List */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }} role="region" aria-label="Recent activity feed">
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Chip label={`${activities.length} items`} size="small" aria-label={`${activities.length} activity items`} />
          </Stack>
        </Box>

        <List disablePadding>
          {activities.map((activity, index) => (
            <Box key={index}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover
                  }
                }}
                secondaryAction={
                  <Stack alignItems="flex-end" spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                    <Chip
                      label={activity.type}
                      size="small"
                      color={getChipColor(activity.type)}
                      variant="outlined"
                    />
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.action.selected }}>
                    <SvgIcon
                      component={activity.icon}
                      inheritViewBox
                      sx={{ color: activity.iconColor, fontSize: 20 }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.primary}
                  secondary={activity.secondary}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ sx: { mt: 0.5 } }}
                  sx={{ pr: 12 }}
                />
              </ListItem>
            </Box>
          ))}
        </List>
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
{`<List>
  {items.map((item, index) => (
    <Box key={index}>
      {index > 0 && <Divider component="li" />}
      <ListItem
        alignItems="flex-start"
        secondaryAction={<Typography>{item.time}</Typography>}
      >
        <ListItemAvatar>
          <Avatar>
            <SvgIcon component={item.icon} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.primary}
          secondary={item.secondary}
        />
      </ListItem>
    </Box>
  ))}
</List>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
