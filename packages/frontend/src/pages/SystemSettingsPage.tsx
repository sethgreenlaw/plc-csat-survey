import { type FC } from 'react';
import { Link } from 'react-router';
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
import {
  Home,
  Account,
  Folder,
  CheckCircle,
  Pencil,
  ChartLine,
  Email,
  Calendar,
  Information,
  CurrencyUsd,
  MapMaker,
  AlertCircle,
  Download,
  Magnify,
  Star,
  Cog
} from '@opengov/react-capital-assets';

interface SettingsCard {
  id: string;
  icon: typeof Home;
  title: string;
  description: string;
  path: string;
}

interface SettingsSection {
  title: string;
  cards: SettingsCard[];
}

/**
 * System Settings Page
 *
 * Dashboard-style settings page with card-based navigation to various
 * configuration sections. Matches the PLC System Settings UI pattern.
 */
export const SystemSettingsPage: FC = () => {
  const theme = useTheme();

  const sections: SettingsSection[] = [
    {
      title: 'Configuration',
      cards: [
        {
          id: 'organization',
          icon: Home,
          title: 'Organization',
          description: 'Name, logo, departments',
          path: '/settings/organization'
        },
        {
          id: 'users',
          icon: Account,
          title: 'Users',
          description: 'Manage users',
          path: '/settings/users'
        },
        {
          id: 'groups',
          icon: Account,
          title: 'Groups',
          description: 'Manage groups, members',
          path: '/settings/groups'
        },
        {
          id: 'record-types',
          icon: Folder,
          title: 'Record Types',
          description: 'See all record types',
          path: '/settings/record-types'
        },
        {
          id: 'inspection-settings',
          icon: CheckCircle,
          title: 'Inspection Settings',
          description: 'Manage inspection settings',
          path: '/settings/inspection-settings'
        },
        {
          id: 'department-form-fields',
          icon: Pencil,
          title: 'Department Form Fields',
          description: 'Group fields to report on together',
          path: '/settings/department-form-fields'
        },
        {
          id: 'reporting',
          icon: ChartLine,
          title: 'Reporting',
          description: 'Sync data to OpenGov Reporting',
          path: '/settings/reporting'
        },
        {
          id: 'communications-center',
          icon: Email,
          title: 'Communications Center',
          description: 'Configure campaign settings',
          path: '/settings/communications-center'
        },
        {
          id: 'schedule-settings',
          icon: Calendar,
          title: 'Schedule Settings',
          description: 'Configure inspection appointments',
          path: '/settings/schedule-settings'
        },
        {
          id: 'comment-library',
          icon: Information,
          title: 'Comment Library',
          description: 'Manage standard comments',
          path: '/settings/comment-library'
        },
        {
          id: 'customer-satisfaction-survey',
          icon: Star,
          title: 'Customer Satisfaction Survey',
          description: 'Configure survey links for emails',
          path: '/settings/customer-satisfaction-survey'
        }
      ]
    },
    {
      title: 'Extensions',
      cards: [
        {
          id: 'payments',
          icon: CurrencyUsd,
          title: 'Payments',
          description: 'Configure payment methods',
          path: '/settings/payments'
        },
        {
          id: 'master-address-table',
          icon: MapMaker,
          title: 'Master Address Table',
          description: 'View Job status',
          path: '/settings/master-address-table'
        },
        {
          id: 'gis-layer',
          icon: MapMaker,
          title: 'GIS Layer',
          description: 'View GIS Layer Integration',
          path: '/settings/gis-layer'
        },
        {
          id: 'flags',
          icon: AlertCircle,
          title: 'Flags',
          description: 'View Flags Migration',
          path: '/settings/flags'
        }
      ]
    },
    {
      title: 'Administrative',
      cards: [
        {
          id: 'activity-log',
          icon: Folder,
          title: 'Activity Log',
          description: 'See system-wide activity',
          path: '/settings/activity-log'
        },
        {
          id: 'export-log',
          icon: Download,
          title: 'Export Log',
          description: 'See system-wide exports',
          path: '/settings/export-log'
        },
        {
          id: 'my-apps',
          icon: Cog,
          title: 'My Apps',
          description: 'View and manage apps for your community',
          path: '/settings/my-apps'
        }
      ]
    },
    {
      title: 'Public Portal',
      cards: [
        {
          id: 'content',
          icon: Folder,
          title: 'Content',
          description: 'Page content, order, visibility',
          path: '/settings/content'
        },
        {
          id: 'project-templates',
          icon: Folder,
          title: 'Project Templates',
          description: 'Add, configure, reorder',
          path: '/settings/project-templates'
        },
        {
          id: 'public-search',
          icon: Magnify,
          title: 'Public Search',
          description: 'Configure public records',
          path: '/settings/public-search'
        }
      ]
    }
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>System Settings</PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={4}>
          {sections.map((section) => (
            <Box key={section.title}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  mb: 2
                }}
              >
                {section.title}
              </Typography>

              <Grid container spacing={2}>
                {section.cards.map((card) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.id}>
                    <Paper
                      component={Link}
                      to={card.path}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        textDecoration: 'none',
                        color: 'inherit',
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          bgcolor: theme.palette.action.hover,
                          boxShadow: theme.shadows[2]
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <SvgIcon component={card.icon} inheritViewBox sx={{ fontSize: 20 }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 0.25
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {card.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};
