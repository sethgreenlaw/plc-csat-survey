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
  Chip,
  SvgIcon,
  InputAdornment,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Magnify, Filter, Close } from '@opengov/react-capital-assets';

/**
 * Pattern 6: Horizontal Form Layout
 *
 * Inline filters and search controls.
 *
 * When to use:
 * - Search bars above data tables
 * - Filter panels for list views
 * - Quick action toolbars
 * - Any inline filtering interface
 *
 * Structure:
 * - Horizontal row of inputs on desktop
 * - Stacks vertically on mobile
 * - Active filters display below
 *
 * Key patterns:
 * - direction={{ xs: 'column', md: 'row' }} for responsive layout
 * - alignItems={{ xs: 'stretch', md: 'center' }} for alignment
 * - size="small" for compact form controls
 * - ml: { md: 'auto' } to push actions to the right
 * - Chip with onDelete for active filter tags
 */
export const HorizontalFormLayout: FC = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['Active', 'Engineering']);

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Horizontal Form Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 6: Inline filters and search controls
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Search and Filters */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          {/* Filter Row */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            {/* Search Input */}
            <TextField
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 250, flexGrow: { xs: 1, md: 0 } }}
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

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            {/* Category Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="engineering">Engineering</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="product">Product</MenuItem>
              </Select>
            </FormControl>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SvgIcon component={Filter} inheritViewBox />}
              >
                More Filters
              </Button>
              <Button variant="contained" size="small">
                Apply
              </Button>
            </Stack>
          </Stack>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {activeFilters.map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  size="small"
                  onDelete={() => removeFilter(filter)}
                  deleteIcon={<SvgIcon component={Close} inheritViewBox sx={{ fontSize: 16 }} />}
                />
              ))}
              <Button
                size="small"
                color="inherit"
                onClick={() => setActiveFilters([])}
                aria-label="Clear all filters"
              >
                Clear all
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Results Area */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            p: 6,
            bgcolor: theme.palette.action.hover,
            borderRadius: 1,
            textAlign: 'center'
          }}
        >
          <Typography color="text.secondary">
            Results would display here based on filters
          </Typography>
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
{`<Stack
  direction={{ xs: 'column', md: 'row' }}
  spacing={2}
  alignItems={{ xs: 'stretch', md: 'center' }}
>
  <TextField placeholder="Search..." size="small" />

  <FormControl size="small" sx={{ minWidth: 150 }}>
    <InputLabel>Status</InputLabel>
    <Select value={status} label="Status">
      <MenuItem value="">All</MenuItem>
      <MenuItem value="active">Active</MenuItem>
    </Select>
  </FormControl>

  <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
    <Button variant="outlined" size="small">Filters</Button>
    <Button variant="contained" size="small">Apply</Button>
  </Stack>
</Stack>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
