import { useState, useMemo, type FC } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { OgGridTable, type IOgGridTableProps } from '@opengov/components-og-grid-table';
import { Plus, Magnify, Download, Refresh } from '@opengov/react-capital-assets';

/**
 * Pattern 12: Data Table with Actions
 *
 * CRUD operations with data tables.
 *
 * When to use:
 * - Admin panels with data management
 * - List views with sorting/filtering
 * - Any page displaying tabular data
 * - CRUD interfaces for entities
 *
 * Structure:
 * - Page header with primary actions (Add, Export)
 * - Filter bar with search and dropdown filters
 * - Data table with columns, pagination, and row selection
 *
 * Key patterns:
 * - PageHeader actions for primary operations
 * - Horizontal filter bar above table
 * - OgGridTable from @opengov/components-og-grid-table
 * - Column definitions with flex, minWidth, cellRenderer
 * - Chip inside cellRenderer for status columns
 * - useMemo for columns and rows to prevent re-renders
 */
export const DataTableLayout: FC = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const columns: IOgGridTableProps['columnDefs'] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: (params: { value: string }) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'Active' ? 'success' : 'default'}
          variant="outlined"
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120
    }
  ], []);

  const rows = useMemo(() => [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', createdAt: 'Jan 15, 2024' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', createdAt: 'Jan 12, 2024' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive', createdAt: 'Jan 10, 2024' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active', createdAt: 'Jan 8, 2024' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active', createdAt: 'Jan 5, 2024' }
  ], []);

  const headerActions = [
    <Button
      key="export"
      variant="outlined"
      color="inherit"
      startIcon={<SvgIcon component={Download} inheritViewBox />}
    >
      Export
    </Button>,
    <Button
      key="add"
      variant="contained"
      color="primary"
      startIcon={<SvgIcon component={Plus} inheritViewBox />}
    >
      Add User
    </Button>
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header actions={headerActions}>
          <PageHeaderComposable.Title>Data Table Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 12: CRUD operations with data tables
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
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon component={Magnify} inheritViewBox sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              }
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ ml: { md: 'auto' } }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SvgIcon component={Refresh} inheritViewBox />}
              aria-label="Refresh data table"
            >
              Refresh
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Data Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }} role="region" aria-label="Users data table">
        <Box sx={{ height: 400 }}>
          <OgGridTable
            rowData={rows}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            rowSelection="multiple"
            getRowId={(params) => params.data.id}
          />
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
{`<Stack spacing={3}>
  {/* Header with Actions */}
  <PageHeaderComposable>
    <PageHeaderComposable.Header actions={[
      <Button key="export">Export</Button>,
      <Button key="add" variant="contained">Add</Button>
    ]}>
      <PageHeaderComposable.Title>Data Management</PageHeaderComposable.Title>
    </PageHeaderComposable.Header>
  </PageHeaderComposable>

  {/* Filters */}
  <Paper sx={{ p: 2 }}>
    <Stack direction="row" spacing={2}>
      <TextField placeholder="Search..." size="small" />
      <Select size="small">...</Select>
    </Stack>
  </Paper>

  {/* Table */}
  <Paper>
    <OgGridTable
      rowData={rows}
      columnDefs={columns}
      pagination={true}
    />
  </Paper>
</Stack>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
