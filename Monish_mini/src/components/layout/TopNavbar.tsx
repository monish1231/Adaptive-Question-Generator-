import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Box, Avatar,
  Menu, MenuItem, Divider, Chip, Tooltip, alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LightMode, DarkMode,
  NotificationsNone as BellIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
  Bookmark as BookmarkIcon,
  Circle,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useQuestions } from '../../context/QuestionContext';

interface TopNavbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string; category: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview & Learning Analytics', category: 'Analytics' },
  '/generate': { title: 'Generate Questions', subtitle: 'AI Adaptive Question Synthesis', category: 'Studio' },
  '/quiz': { title: 'Adaptive Quiz', subtitle: 'Real-time Dynamic Difficulty Evaluation', category: 'Practice' },
  '/history': { title: 'Generation History', subtitle: 'Previous sessions & exported sets', category: 'Archive' },
  '/saved': { title: 'Saved Questions Library', subtitle: 'Flashcards & Bookmarked Study Decks', category: 'Library' },
};

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, themeMode, toggleTheme, logout } = useApp();
  const { savedQuestions, isBackendConnected } = useQuestions();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const pageInfo = pageTitles[location.pathname] || {
    title: 'Adaptive Question Generator',
    subtitle: 'AI Education System',
    category: 'System',
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      sx={{
        bgcolor: (t) =>
          t.palette.mode === 'dark'
            ? alpha('#0B0F19', 0.8)
            : alpha('#FFFFFF', 0.85),
        backdropFilter: 'blur(16px)',
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ gap: 2, py: 0.8, minHeight: { xs: 60, sm: 68 } }}>
        {/* Mobile menu toggle */}
        <IconButton
          onClick={onMenuClick}
          edge="start"
          sx={{
            color: 'text.secondary',
            bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
            '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title & Breadcrumb */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: { xs: 'none', sm: 'inline-block' },
              }}
            >
              {pageInfo.category} /
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {pageInfo.title}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' },
              fontSize: '0.75rem',
            }}
          >
            {pageInfo.subtitle}
          </Typography>
        </Box>

        {/* Backend Status Indicator Pill */}
        <Tooltip title={isBackendConnected ? 'Backend REST API connected (Node.js)' : 'Embedded Dev API active'}>
          <Chip
            icon={
              <Circle
                sx={{
                  fontSize: '8px !important',
                  color: isBackendConnected ? '#10B981' : '#6366F1',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.4 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.4 },
                  },
                }}
              />
            }
            label={isBackendConnected ? 'API Live' : 'AI Engine Ready'}
            size="small"
            sx={{
              display: { xs: 'none', md: 'flex' },
              bgcolor: (t) =>
                alpha(isBackendConnected ? '#10B981' : t.palette.primary.main, 0.1),
              color: isBackendConnected ? '#10B981' : 'primary.main',
              fontWeight: 700,
              fontSize: '0.7rem',
              border: (t) =>
                `1px solid ${alpha(isBackendConnected ? '#10B981' : t.palette.primary.main, 0.25)}`,
            }}
          />
        </Tooltip>

        {/* Saved Count Quick Link */}
        <Tooltip title="View saved bookmarks">
          <Chip
            icon={<BookmarkIcon sx={{ fontSize: '14px !important', color: 'primary.main' }} />}
            label={savedQuestions.length}
            size="small"
            onClick={() => navigate('/saved')}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              cursor: 'pointer',
              fontWeight: 700,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
            }}
          />
        </Tooltip>

        {/* Streak chip */}
        <Chip
          label={`🔥 ${user?.streakDays || 8}d Streak`}
          size="small"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            bgcolor: alpha('#F59E0B', 0.12),
            color: '#F59E0B',
            fontWeight: 700,
            fontSize: '0.72rem',
            border: '1px solid rgba(245,158,11,0.25)',
          }}
        />

        {/* Theme toggle */}
        <Tooltip title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: 'text.secondary',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
            }}
          >
            {themeMode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            sx={{
              color: 'text.secondary',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
              '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) },
            }}
          >
            <BellIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* User Avatar Menu */}
        <Box>
          <Tooltip title="Account profile">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.3 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                }}
              >
                {user?.avatar || 'A'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: '16px',
                border: (t) => `1px solid ${t.palette.divider}`,
                boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
              },
            }}
          >
            <Box sx={{ px: 2.5, py: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                {user?.name || 'Alex Rivera'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {user?.email || 'alex@aqg.ai'}
              </Typography>
              <Chip
                label={user?.role || 'Senior Learner'}
                size="small"
                sx={{
                  mt: 1,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                  color: 'primary.main',
                }}
              />
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/saved'); }} sx={{ gap: 1.5, py: 1.2 }}>
              <BookmarkIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">Saved Questions ({savedQuestions.length})</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, py: 1.2 }}>
              <ProfileIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">Account Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2, color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
