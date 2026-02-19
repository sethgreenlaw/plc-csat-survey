/**
 * Detail Page Template
 *
 * Quick start template for detail/view pages.
 *
 * Usage:
 * 1. Replace ENTITY_NAME with your entity (e.g., "Skill", "Agent")
 * 2. Update display fields based on your schema
 * 3. Customize metadata and actions as needed
 * 4. Connect to real data or keep mock
 *
 * Key patterns:
 * - Main content + sidebar layout (8/4 split)
 * - Action buttons with confirmation dialogs
 * - Metadata display
 * - Loading and error states
 */

import { useState, useEffect, type FC } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Pencil, TrashCan, ContentCopy, Archive } from '@opengov/react-capital-assets';

// ============================================================================
// CUSTOMIZE: Entity type definition
// ============================================================================
interface EntityData {
  id: string;
  name: string;
  description: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  // Add more fields as needed
}

// ============================================================================
// CUSTOMIZE: Replace ENTITY_NAME throughout
// ============================================================================
export const ENTITY_NAME_DetailPage: FC = () => {
  const navigate = useNavigate();
  const { entityId, id } = useParams<{ entityId: string; id: string }>();
  const theme = useTheme();

  // State management
  const [data, setData] = useState<EntityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  // ============================================================================
  // CUSTOMIZE: Data loading - replace with real API call
  // ============================================================================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data - REPLACE WITH REAL DATA
        setData({
          id: id!,
          name: 'Example Item',
          description: 'This is a comprehensive description of the item that provides context and details.',
          content: `
            <h2>Overview</h2>
            <p>This is the main content of the item. It contains detailed information.</p>

            <h2>Key Features</h2>
            <ul>
              <li>Feature 1: Advanced capability</li>
              <li>Feature 2: Seamless integration</li>
              <li>Feature 3: Real-time updates</li>
            </ul>
          `,
          status: 'published',
          category: 'Category 1',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'John Doe',
          updatedBy: 'Jane Smith'
        });
        setError(null);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Action handlers
  const handleEdit = () => {
    navigate(`/entity/${entityId}/ENTITY_NAME_LOWER/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      // Simulate API call - REPLACE WITH REAL DELETE
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate(`/entity/${entityId}/ENTITY_NAME_LOWER`);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleArchive = async () => {
    try {
      // Simulate API call - REPLACE WITH REAL ARCHIVE
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(prev => prev ? { ...prev, status: 'archived' } : null);
      setArchiveDialogOpen(false);
    } catch (err) {
      console.error('Failed to archive:', err);
    }
  };

  const handleDuplicate = () => {
    navigate(`/entity/${entityId}/ENTITY_NAME_LOWER/new?duplicate=${id}`);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state - Human-centric messaging
  if (error || !data) {
    return (
      <>
        <PageHeaderComposable>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>ENTITY_NAME</PageHeaderComposable.Title>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Alert severity="error">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {error ? "Something went wrong" : "We couldn't find what you're looking for"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {error
                  ? "We're having trouble loading this page. Please try refreshing, or contact support if this continues."
                  : "This item may have been moved or deleted. Try going back to the list to find what you need."}
              </Typography>
            </Alert>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Go back
            </Button>
          </Stack>
        </Box>
      </>
    );
  }

  const statusColor = {
    published: 'success',
    draft: 'default',
    archived: 'warning'
  } as const;

  // Header actions
  const headerActions = [
    <Button
      key="edit"
      variant="contained"
      startIcon={<SvgIcon component={Pencil} inheritViewBox />}
      onClick={handleEdit}
    >
      Edit
    </Button>
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header actions={headerActions}>
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              { path: `/entity/${entityId}/ENTITY_NAME_LOWER`, title: 'ENTITY_NAME_PLURAL' },
              { title: data.name }
            ]}
          />
          <PageHeaderComposable.Title
            status={
              <Chip
                label={data.status}
                size="small"
                color={statusColor[data.status] || 'default'}
              />
            }
          >
            {data.name}
          </PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            {data.description}
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Main Content */}
          <Grid container spacing={3}>
        {/* Content Area - 8 columns */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Content Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Content
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {/* Render HTML content */}
              <Box
                dangerouslySetInnerHTML={{ __html: data.content }}
                sx={{
                  '& h2': {
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: 600,
                    mt: 3,
                    mb: 1,
                    '&:first-of-type': { mt: 0 }
                  },
                  '& p': { mb: 2, lineHeight: 1.6 },
                  '& ul': { pl: 3, mb: 2 },
                  '& li': { mb: 0.5 }
                }}
              />
            </Paper>

            {/* Additional Information Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{data.category}</Typography>
                </Box>
                {/* Add more fields as needed */}
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Sidebar - 4 columns */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Actions Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<SvgIcon component={ContentCopy} inheritViewBox />}
                  onClick={handleDuplicate}
                  aria-label={`Duplicate ${data.name}`}
                >
                  Duplicate
                </Button>
                {data.status !== 'archived' && (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<SvgIcon component={Archive} inheritViewBox />}
                    onClick={() => setArchiveDialogOpen(true)}
                    color="warning"
                    aria-label={`Archive ${data.name}`}
                  >
                    Archive
                  </Button>
                )}
                <Divider />
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<SvgIcon component={TrashCan} inheritViewBox />}
                  onClick={() => setDeleteDialogOpen(true)}
                  color="error"
                  aria-label={`Delete ${data.name}`}
                >
                  Delete
                </Button>
              </Stack>
            </Paper>

            {/* Metadata Card */}
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
                    {new Date(data.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    by {data.createdBy}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Modified
                  </Typography>
                  <Typography variant="body2">
                    {new Date(data.updatedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    by {data.updatedBy}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  >
                    {data.id}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Related Items Card */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Related Items
              </Typography>
              <List dense disablePadding>
                {['Related Item 1', 'Related Item 2', 'Related Item 3'].map((item, index) => (
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

      {/* Delete Confirmation Dialog - Human-centric messaging */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete this ENTITY_NAME?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You're about to delete "<strong>{data.name}</strong>". This action cannot be undone,
            but you can always create a new one if needed.
          </DialogContentText>
          <DialogContentText sx={{ mt: 1, fontSize: '0.875rem' }}>
            Need to keep this for reference? Consider archiving instead.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Keep it</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Archive Confirmation Dialog - Human-centric messaging */}
      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Archive this ENTITY_NAME?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "<strong>{data.name}</strong>" will be moved to your archive. You can restore it
            anytime from the Archive section if you change your mind.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleArchive} color="warning" variant="contained">
            Archive
          </Button>
        </DialogActions>
      </Dialog>
        </Stack>
      </Box>
    </>
  );
};
