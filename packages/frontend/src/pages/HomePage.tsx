import { Box, Card, CardContent, Grid, Skeleton, Stack } from '@mui/material';
import type { FC } from 'react';

/**
 * Home Page
 *
 * Displays a loading skeleton representing content being generated
 * by AI Coding Agents in the web-based app builder.
 */
export const HomePage: FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
      {/* Header skeleton */}
      <Box>
        <Skeleton variant="text" width={280} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>

      {/* Feature cards skeleton */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="rounded"
                  width={56}
                  height={56}
                  sx={{ mb: 2, borderRadius: 2 }}
                />
                <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="70%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Content section skeleton */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={item}>
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="80%" height={20} />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* List section skeleton */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
        <Grid container spacing={1}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
              <Skeleton variant="text" width="70%" height={20} sx={{ py: 0.5 }} />
            </Grid>
          ))}
        </Grid>
      </Card>
      </Stack>
    </Box>
  );
};
