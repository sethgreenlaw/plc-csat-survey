import { useState, type FC } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';

/**
 * Pattern 8: Tabbed Layout
 *
 * Multi-section pages with tab navigation.
 *
 * When to use:
 * - Settings pages with multiple categories
 * - Profile pages with different sections
 * - Configuration panels
 * - Any page with related but separate content sections
 *
 * Structure:
 * - Tab bar at the top for section navigation
 * - Content panels that switch based on selected tab
 * - Each panel renders independently when selected
 *
 * Key patterns:
 * - Tabs with value/onChange for controlled component
 * - TabPanel helper component with role="tabpanel"
 * - Proper aria attributes for accessibility
 * - hidden prop on TabPanel for conditional rendering
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const TabbedLayout: FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Tabbed Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 8: Multi-section pages with tab navigation
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Tabbed Content */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Settings navigation tabs"
            sx={{ px: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="General" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Profile" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Security" id="tab-2" aria-controls="tabpanel-2" />
            <Tab label="Notifications" id="tab-3" aria-controls="tabpanel-3" />
          </Tabs>
        </Box>

        <Box sx={{ px: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              General Settings
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Configure general application preferences like language, timezone, and display options.
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
                General settings form would go here
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Profile Settings
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Update your personal information and profile picture.
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
                Profile form would go here
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Security Settings
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Manage your password, two-factor authentication, and security preferences.
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
                Security settings would go here
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Notification Preferences
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Control how and when you receive notifications.
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
                Notification preferences would go here
              </Typography>
            </Box>
          </TabPanel>
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
{`const [tabValue, setTabValue] = useState(0);

<Paper>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
      <Tab label="Tab 1" />
      <Tab label="Tab 2" />
      <Tab label="Tab 3" />
    </Tabs>
  </Box>

  <TabPanel value={tabValue} index={0}>
    Content for Tab 1
  </TabPanel>
  <TabPanel value={tabValue} index={1}>
    Content for Tab 2
  </TabPanel>
  <TabPanel value={tabValue} index={2}>
    Content for Tab 3
  </TabPanel>
</Paper>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
