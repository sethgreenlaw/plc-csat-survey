import { Routes, Route } from 'react-router';
import { Layout } from './Layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SystemSettingsPage } from './pages/SystemSettingsPage';
import { CustomerSurveySettingsPage } from './pages/CustomerSurveySettingsPage';

/**
 * Main Application Component
 *
 * Defines the routing structure for the application.
 * All routes are wrapped in the Layout component which provides
 * the application shell (navigation, header, content area).
 *
 * Route structure:
 * - / : Home page (loading skeleton for AI-generated content)
 * - /settings : System settings dashboard
 * - /settings/customer-satisfaction-survey : Customer survey URL configuration
 * - * : 404 Not Found page
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
        <Route path="settings/customer-satisfaction-survey" element={<CustomerSurveySettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
