import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';

// Capital Design System theme
import { theme } from './theme';

import { App } from './App';

/**
 * React Query client configuration
 * Provides data fetching, caching, and synchronization
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

/**
 * Application entry point
 *
 * Provider hierarchy:
 * 1. StrictMode - Development checks
 * 2. QueryClientProvider - Data fetching
 * 3. ThemeProvider - Capital Design System theme
 * 4. CssBaseline - CSS reset and baseline styles
 * 5. BrowserRouter - Client-side routing
 */
const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
