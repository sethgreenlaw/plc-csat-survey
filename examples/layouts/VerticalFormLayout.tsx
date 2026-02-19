import { useState, type FC } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';

/**
 * Pattern 5: Vertical Form Layout
 *
 * Standard forms with stacked fields.
 *
 * When to use:
 * - User registration and profile forms
 * - Settings pages
 * - Data entry forms
 * - Any form with multiple fields
 *
 * Structure:
 * - Form sections with headings and descriptions
 * - Stacked input fields using Stack with spacing={2.5}
 * - Section dividers between logical groups
 * - Action buttons at bottom (Cancel / Save)
 *
 * Key patterns:
 * - maxWidth: 600 constrains form width for readability
 * - Stack spacing={2.5} for field spacing within sections
 * - Stack spacing={3} for section spacing
 * - Divider between sections for visual separation
 * - justifyContent="flex-end" for action buttons
 */
export const VerticalFormLayout: FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    bio: ''
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Vertical Form Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 5: Standard forms with stacked fields
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Form */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, maxWidth: 600 }}>
        <Stack spacing={3}>
          {/* Personal Information Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Personal Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Basic details about the user
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                fullWidth
                required
              />
              <TextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                fullWidth
                required
                helperText="We'll never share your email"
              />
            </Stack>
          </Box>

          <Divider />

          {/* Work Information Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Work Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Organization and role details
            </Typography>

            <Stack spacing={2.5}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                >
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="product">Product</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                </Select>
                <FormHelperText>Select your primary department</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <MenuItem value="ic">Individual Contributor</MenuItem>
                  <MenuItem value="lead">Team Lead</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="director">Director</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Bio"
                value={formData.bio}
                onChange={handleChange('bio')}
                fullWidth
                multiline
                rows={4}
                helperText="Tell us a bit about yourself"
              />
            </Stack>
          </Box>

          <Divider />

          {/* Form Actions */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" role="group" aria-label="Form actions">
            <Button variant="outlined" color="inherit" type="button">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </Stack>
        </Stack>
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
{`<Paper sx={{ p: 3, maxWidth: 600 }}>
  <Stack spacing={3}>
    {/* Section */}
    <Box>
      <Typography variant="h6">Section Title</Typography>
      <Stack spacing={2.5}>
        <TextField label="Field 1" fullWidth />
        <TextField label="Field 2" fullWidth />
      </Stack>
    </Box>

    <Divider />

    {/* Actions */}
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained">Save</Button>
    </Stack>
  </Stack>
</Paper>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
