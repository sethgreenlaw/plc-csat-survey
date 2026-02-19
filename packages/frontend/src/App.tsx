import { Routes, Route } from 'react-router';
import { Layout } from './Layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Main Application Component
 *
 * Defines the routing structure for the application.
 * All routes are wrapped in the Layout component which provides
 * the application shell (navigation, header, content area).
 *
 * Route structure:
 * - / : Home page (loading skeleton for AI-generated content)
 * - * : 404 Not Found page
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
