import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Box, useTheme } from '@mui/material';
import { NavBar, type IMenuOption, type INavBarOptions } from '@opengov/components-nav-bar';
import './Layout.css';

/**
 * Custom Link component for React Router integration with NavBar
 *
 * The NavBar component expects an href prop, but React Router's Link
 * uses 'to'. This adapter bridges the two.
 */
const CustomLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentProps<typeof Link> & { href: string }, 'to'>
>((props, ref) => {
  const { href, ...otherProps } = props;
  return <Link ref={ref} to={href} {...otherProps} />;
});

CustomLinkComponent.displayName = 'CustomLinkComponent';

/**
 * Layout Component
 *
 * Application shell with OpenGov NavBar at the top.
 *
 * Pattern: Global Navigation Bar (from OpenGov Agent Studio)
 * - Sticky nav bar at top (52px height)
 * - Main content area fills remaining viewport
 * - React Router integration via custom Link component
 *
 * CDS compliance:
 * - Uses @opengov/components-nav-bar for navigation
 * - All colors from theme.palette
 * - Standard OpenGov layout structure
 */
export const Layout = () => {
  const location = useLocation();
  const theme = useTheme();

  /**
   * Check if a path is currently active
   */
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  /**
   * Navigation menu configuration
   */
  const menuOptions: IMenuOption[] = [
    {
      id: 'home',
      label: 'Home',
      url: '/',
      linkComponent: CustomLinkComponent,
      isActive: isActive('/')
    }
  ];

  /**
   * NavBar configuration
   */
  const navBarOptions: INavBarOptions = {
    appName: 'App Builder',
    menuOptions
  };

  return (
    <div className="layout">
      <nav className="nav-bar">
        <NavBar {...navBarOptions} />
      </nav>
      <main className="main">
        <Box
          className="container"
          sx={{
            bgcolor: theme.palette.background.default
          }}
        >
          <Outlet />
        </Box>
      </main>
    </div>
  );
};
