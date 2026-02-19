/**
 * Form Page Template (Create/Edit)
 *
 * Quick start template for form views.
 *
 * Usage:
 * 1. Replace ENTITY_NAME with your entity (e.g., "Skill", "Agent")
 * 2. Update form fields based on your schema
 * 3. Implement validation rules
 * 4. Connect to real save API or keep mock
 *
 * Key patterns:
 * - Form + sidebar settings layout
 * - Field validation with error display
 * - Unsaved changes warning
 * - Loading states during save
 */

import { useState, useEffect, type FC } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  TextField,
  Stack,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormHelperText,
  Grid,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';

// ============================================================================
// CUSTOMIZE: Form data type definition
// ============================================================================
interface FormData {
  name: string;
  description: string;
  content: string;
  status: 'draft' | 'published';
  category: string;
  // Add more fields as needed
}

// ============================================================================
// CUSTOMIZE: Replace ENTITY_NAME throughout
// ============================================================================
export const ENTITY_NAME_FormPage: FC = () => {
  const navigate = useNavigate();
  const { entityId, id } = useParams<{ entityId: string; id?: string }>();
  const theme = useTheme();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    content: '',
    status: 'draft',
    category: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // ============================================================================
  // CUSTOMIZE: Data loading for edit mode - replace with real API call
  // ============================================================================
  useEffect(() => {
    if (isEditMode) {
      const loadExistingData = async () => {
        setLoading(true);
        try {
          // Simulate API call - REPLACE WITH REAL DATA
          await new Promise(resolve => setTimeout(resolve, 500));

          setFormData({
            name: 'Example Item',
            description: 'This is an example description',
            content: 'This is the main content of the item.',
            status: 'published',
            category: 'category1'
          });
        } catch (err) {
          console.error('Failed to load data:', err);
        } finally {
          setLoading(false);
        }
      };

      loadExistingData();
    }
  }, [id, isEditMode]);

  // Handle field changes
  const handleFieldChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setHasUnsavedChanges(true);

    // Clear field error on change
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // ============================================================================
  // CUSTOMIZE: Validation rules - Human-centric error messages
  // ============================================================================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please give this ENTITY_NAME_LOWER a name';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'A brief description helps others understand what this is';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Simulate API call - REPLACE WITH REAL SAVE
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to detail page after save
      const savedId = id || 'new_item_123';
      navigate(`/entity/${entityId}/ENTITY_NAME_LOWER/${savedId}`);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    if (isEditMode) {
      navigate(`/entity/${entityId}/ENTITY_NAME_LOWER/${id}`);
    } else {
      navigate(`/entity/${entityId}/ENTITY_NAME_LOWER`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              { path: `/entity/${entityId}/ENTITY_NAME_LOWER`, title: 'ENTITY_NAME_PLURAL' },
              { title: isEditMode ? 'Edit' : 'Create' }
            ]}
          />
          <PageHeaderComposable.Title
            status={
              <Chip
                label={formData.status}
                size="small"
                color={formData.status === 'published' ? 'success' : 'default'}
              />
            }
          >
            {isEditMode ? 'Edit ENTITY_NAME' : 'Create New ENTITY_NAME'}
          </PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Form Content */}
          <Grid container spacing={3}>
        {/* Main Form Area - 8 columns */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Basic Information Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Basic Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Core details about this ENTITY_NAME_LOWER
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={handleFieldChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  fullWidth
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={handleFieldChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={3}
                  required
                  fullWidth
                />

                <FormControl error={!!errors.category} required fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category')({ target: { value: e.target.value } })}
                    label="Category"
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    <MenuItem value="category1">Category 1</MenuItem>
                    <MenuItem value="category2">Category 2</MenuItem>
                    <MenuItem value="category3">Category 3</MenuItem>
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>
              </Stack>
            </Paper>

            {/* Content Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Content
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Main content for this ENTITY_NAME_LOWER
              </Typography>
              <TextField
                label="Content"
                value={formData.content}
                onChange={handleFieldChange('content')}
                multiline
                rows={8}
                fullWidth
                placeholder="Enter the main content..."
              />
            </Paper>
          </Stack>
        </Grid>

        {/* Sidebar - 4 columns */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Settings Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Settings
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status')({ target: { value: e.target.value } })}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Metadata Card (Edit mode only) */}
            {isEditMode && (
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Metadata
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Modified
                    </Typography>
                    <Typography variant="body2">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          position: 'sticky',
          bottom: 0,
          bgcolor: theme.palette.background.paper,
          zIndex: theme.zIndex.appBar - 1
        }}
        role="toolbar"
        aria-label="Form actions"
      >
        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
          <Button variant="outlined" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" aria-label="Saving" />
            ) : (
              isEditMode ? 'Save Changes' : 'Create'
            )}
          </Button>
        </Stack>
      </Paper>

      {/* Discard Changes Dialog - Human-centric messaging */}
      <Dialog open={showDiscardDialog} onClose={() => setShowDiscardDialog(false)}>
        <DialogTitle>You have unsaved changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to save your work before leaving? Any unsaved changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={navigateBack} color="error">
            Leave without saving
          </Button>
          <Button onClick={() => setShowDiscardDialog(false)} variant="contained">
            Keep editing
          </Button>
        </DialogActions>
      </Dialog>
        </Stack>
      </Box>
    </>
  );
};
