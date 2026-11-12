import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useApp } from '../../context/AppContext';

const SIDEBAR_WIDTH = 250;
const SIDEBAR_COLLAPSED = 72;

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, setSidebar } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setSidebar(!sidebarOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar (Permanent on desktop in flex flow, temporary drawer on mobile) */}
      <Sidebar
        open={isMobile ? mobileOpen : sidebarOpen}
        collapsed={!sidebarOpen && !isMobile}
        isMobile={isMobile}
        onClose={() => (isMobile ? setMobileOpen(false) : undefined)}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED}
      />

      {/* Main content area sits directly next to docked sidebar in flex flow (no duplicate ml) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
        }}
      >
        <TopNavbar onMenuClick={handleDrawerToggle} />

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 3.5 },
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
