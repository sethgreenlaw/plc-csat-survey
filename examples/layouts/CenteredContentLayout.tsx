import type { FC } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Link,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';

/**
 * Pattern 9: Centered Content Layout
 *
 * Login pages, 404 pages, and focused content.
 *
 * When to use:
 * - Authentication pages (login, register, forgot password)
 * - Error pages (404, 500, maintenance)
 * - Single-focus content (confirmations, success messages)
 * - Landing pages with centered call-to-action
 *
 * Structure:
 * - Vertically and horizontally centered container
 * - Fixed max-width for content (typically 400px)
 * - Clean, focused presentation without distractions
 *
 * Key patterns:
 * - display: 'flex' with alignItems/justifyContent: 'center'
 * - minHeight: '100vh' for full viewport centering (or specific height)
 * - maxWidth: 400 constrains content width
 * - Stack alignItems="center" for centered form elements
 */
export const CenteredContentLayout: FC = () => {
  const theme = useTheme();

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Centered Content Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 9: Login pages, 404 pages, and focused content
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Example: Login Form */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Login Page
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            bgcolor: theme.palette.action.hover,
            borderRadius: 1
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 400,
              bgcolor: theme.palette.background.paper,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Stack spacing={3} alignItems="center" component="form" role="form" aria-label="Sign in form">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h4" sx={{ color: theme.palette.primary.contrastText, fontWeight: 700 }}>
                  O
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to your account
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ width: '100%' }}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  size="small"
                />
                <Button variant="contained" color="primary" fullWidth type="submit">
                  Sign In
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="#" underline="hover">
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Paper>

      {/* Example: 404 Page */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: 404 Page
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            bgcolor: theme.palette.action.hover,
            borderRadius: 1,
            textAlign: 'center',
            p: 4
          }}
        >
          <Typography variant="h1" sx={{ fontWeight: 700, color: theme.palette.text.secondary, mb: 2 }}>
            404
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Page Not Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            The page you're looking for doesn't exist.
          </Typography>
          <Button variant="contained" color="primary">
            Go Home
          </Button>
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
{`<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'  // or specific height
  }}
>
  <Paper sx={{ p: 4, maxWidth: 400 }}>
    <Stack spacing={3} alignItems="center">
      {/* Logo */}
      <Box sx={{ width: 64, height: 64, bgcolor: 'primary.main' }} />

      {/* Title */}
      <Typography variant="h5">Welcome</Typography>

      {/* Form */}
      <TextField label="Email" fullWidth />
      <Button variant="contained" fullWidth>Sign In</Button>
    </Stack>
  </Paper>
</Box>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
