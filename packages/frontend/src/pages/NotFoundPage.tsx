import { Box, SvgIcon } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { Result } from '@opengov/components-result';
import { Home } from '@opengov/react-capital-assets';
import type { FC } from 'react';

/**
 * Not Found Page
 *
 * Displayed when a route doesn't match any defined paths.
 *
 * OpenGov Components Used:
 * - Result from @opengov/components-result
 * - Icons from @opengov/react-capital-assets
 *
 * Layout pattern used:
 * - Centered content (Pattern 9: Centered Content)
 */
export const NotFoundPage: FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}
      >
        <Result
          status="error"
          title="Page Not Found"
          subTitle="The page you're looking for doesn't exist or has been moved to a new location."
          actionButtons={[
            {
              label: 'Go Home',
              variant: 'contained',
              color: 'primary',
              size: 'large',
              startIcon: <SvgIcon component={Home} inheritViewBox />,
              component: RouterLink,
              to: '/'
            } as any
          ]}
        />
      </Box>
    </Box>
  );
};
