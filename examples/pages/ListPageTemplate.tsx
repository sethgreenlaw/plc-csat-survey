/**
 * List Page Template
 *
 * Quick start template for list/grid views.
 *
 * Usage:
 * 1. Replace ENTITY_NAME with your entity (e.g., "Skills", "Agents")
 * 2. Update columns array with your schema fields
 * 3. Connect to real data or keep mock
 * 4. Customize filters as needed
 *
 * Key patterns:
 * - OgGridTable for data display
 * - Search + status filters
 * - Empty state handling
 * - Row click navigation
 */

import { useState, useEffect, useMemo, type FC } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  TextField,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  InputAdornment,
  Paper,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { OgGridTable, type IOgGridTableProps } from '@opengov/components-og-grid-table';
import { Plus, Magnify } from '@opengov/react-capital-assets';

// ============================================================================
// CUSTOMIZE: Entity type definition
// ============================================================================
interface EntityData {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  // Add more fields as needed
}

// ============================================================================
// CUSTOMIZE: Replace ENTITY_NAME throughout
// ============================================================================
export const ENTITY_NAME_ListPage: FC = () => {
  const navigate = useNavigate();
  const { entityId } = useParams<{ entityId: string }>();
  const theme = useTheme();

  // State management
  const [data, setData] = useState<EntityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // ============================================================================
  // CUSTOMIZE: Column definitions
  // ============================================================================
  const columns: IOgGridTableProps['columnDefs'] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 300
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: (params: { value: string }) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'published' ? 'success' : params.value === 'archived' ? 'warning' : 'default'}
          variant="outlined"
        />
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      width: 150,
      valueFormatter: (params: { value: string }) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString();
      }
    }
  ], []);

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
        const mockData: EntityData[] = Array.from({ length: 20 }, (_, i) => ({
          id: `item_${i + 1}`,
          name: `Item ${i + 1}`,
          description: `Description for item ${i + 1}. This is a sample description.`,
          status: i % 4 === 0 ? 'draft' : i % 4 === 1 ? 'archived' : 'published',
          updatedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        }));

        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [entityId]);

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Calculate counts for filters
  const counts = useMemo(() => ({
    all: data.length,
    published: data.filter(d => d.status === 'published').length,
    draft: data.filter(d => d.status === 'draft').length,
    archived: data.filter(d => d.status === 'archived').length
  }), [data]);

  // Navigation handlers
  const handleRowClick = (params: { data: EntityData }) => {
    navigate(`/entity/${entityId}/ENTITY_NAME_LOWER/${params.data.id}`);
  };

  const handleCreate = () => {
    navigate(`/entity/${entityId}/ENTITY_NAME_LOWER/new`);
  };

  // Header actions
  const headerActions = [
    <Button
      key="create"
      variant="contained"
      color="primary"
      startIcon={<SvgIcon component={Plus} inheritViewBox />}
      onClick={handleCreate}
    >
      Create ENTITY_NAME
    </Button>
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header actions={headerActions}>
          <PageHeaderComposable.Title>ENTITY_NAME_PLURAL</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Manage your ENTITY_NAME_LOWER items
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Filters */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
        >
          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      component={Magnify}
                      inheritViewBox
                      sx={{ fontSize: 20, color: theme.palette.text.secondary }}
                    />
                  </InputAdornment>
                )
              }
            }}
          />

          {/* Status Filters */}
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, value) => value && setStatusFilter(value)}
            size="small"
          >
            <ToggleButton value="all">All ({counts.all})</ToggleButton>
            <ToggleButton value="published">Published ({counts.published})</ToggleButton>
            <ToggleButton value="draft">Draft ({counts.draft})</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      {/* Data Table */}
      {filteredData.length > 0 ? (
        <Paper variant="outlined" sx={{ borderRadius: 2 }} role="region" aria-label="Data table">
          <Box sx={{ height: 500 }}>
            <OgGridTable
              rowData={filteredData}
              columnDefs={columns}
              pagination={true}
              paginationPageSize={10}
              onRowClicked={handleRowClick}
              getRowId={(params) => params.data.id}
              loading={loading}
            />
          </Box>
        </Paper>
      ) : !loading ? (
        /* Empty State - Human-centric messaging */
        <Paper
          variant="outlined"
          sx={{
            p: 6,
            borderRadius: 2,
            textAlign: 'center'
          }}
          role="status"
          aria-live="polite"
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {searchQuery || statusFilter !== 'all'
              ? "We couldn't find any matches"
              : 'No ENTITY_NAME_LOWER yet'
            }
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || statusFilter !== 'all'
              ? 'Try broadening your search or adjusting filters. You can also browse all items.'
              : "You're all set to get started! Create your first ENTITY_NAME_LOWER to begin."
            }
          </Typography>
          {!searchQuery && statusFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<SvgIcon component={Plus} inheritViewBox />}
              onClick={handleCreate}
            >
              Create Your First ENTITY_NAME
            </Button>
          )}
          {(searchQuery || statusFilter !== 'all') && (
            <Button
              variant="outlined"
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
            >
              Clear Filters
            </Button>
          )}
        </Paper>
      ) : null}
        </Stack>
      </Box>
    </>
  );
};
