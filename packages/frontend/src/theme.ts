import { capitalMuiTheme } from '@opengov/capital-mui-theme';

/**
 * OpenGov Capital Design System Theme
 *
 * This module exports the official Capital MUI Theme from @opengov/capital-mui-theme.
 * The theme provides:
 *
 * - Color palette: theme.palette.primary, secondary, error, warning, info, success
 * - Typography: theme.typography with Inter font family
 * - Spacing: theme.spacing() using 8px base unit
 * - Breakpoints: xs (0), sm (600), md (900), lg (1200), xl (1536)
 * - Component overrides: Pre-configured MUI component styles
 *
 * Usage patterns:
 *
 * 1. MUI component props (string enums):
 *    <Button color="primary" variant="contained" />
 *    <Alert severity="error" />
 *
 * 2. Custom styling via sx prop (theme callback):
 *    <Box sx={{ bgcolor: (theme) => theme.palette.primary.main }} />
 *    <Box sx={{ p: (theme) => theme.spacing(2) }} />
 *
 * 3. Never hardcode values:
 *    ❌ <Box sx={{ bgcolor: '#4B3FFF', padding: '16px' }} />
 *    ✅ <Box sx={{ bgcolor: (theme) => theme.palette.primary.main, p: 2 }} />
 */
export const theme = capitalMuiTheme;

/**
 * Re-export theme type for TypeScript consumers
 */
export type AppTheme = typeof capitalMuiTheme;
