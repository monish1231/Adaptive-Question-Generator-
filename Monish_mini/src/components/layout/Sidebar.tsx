import React from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Tooltip, Typography, alpha, Divider, Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AutoAwesome as GenerateIcon,
  Psychology as QuizIcon,
  History as HistoryIcon,
  Bookmark as SavedIcon,
  AutoStories as BrandIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuestions } from '../../context/QuestionContext';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  isMobile: boolean;
  onClose?: () => void;
  width: number;
  collapsedWidth: number;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/generate', label: 'Generate Questions', icon: GenerateIcon },
  { path: '/quiz', label: 'Adaptive Quiz', icon: QuizIcon },
  { path: '/history', label: 'History', icon: HistoryIcon },
  { path: '/saved', label: 'Saved Questions', icon: SavedIcon },
];

const SidebarContent: React.FC<{ collapsed: boolean; onClose?: () => void }> = ({ collapsed, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedQuestions, isBackendConnected } = useQuestions();

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 1 }}>
      {/* Brand Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          mb: 1,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          }}
        >
          <BrandIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.05rem',
                background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              AQG Studio
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', fontWeight: 600 }}>
              Adaptive Question AI
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, mb: 1.5 }} />

      {/* Nav items */}
      <List sx={{ px: collapsed ? 1 : 1.5, flex: 1 }}>
        {navItems.map((item, i) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          const isSavedItem = item.path === '/saved';

          const btn = (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.6 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: '12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1.5 : 2,
                  py: 1.2,
                  minHeight: 46,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.14) : 'transparent',
                  border: active
                    ? (t) => `1px solid ${alpha(t.palette.primary.main, 0.3)}`
                    : '1px solid transparent',
                  '&:hover': {
                    bgcolor: (t) => alpha(t.palette.primary.main, active ? 0.2 : 0.08),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 36,
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? 'primary.main' : 'text.primary',
                    }}
                  />
                )}
                {!collapsed && isSavedItem && savedQuestions.length > 0 && (
                  <Chip
                    label={savedQuestions.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      bgcolor: active
                        ? (t) => alpha(t.palette.primary.main, 0.25)
                        : (t) => alpha(t.palette.divider, 0.8),
                      color: active ? 'primary.main' : 'text.secondary',
                    }}
                  />
                )}
                {active && !collapsed && !isSavedItem && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#6366F1',
                      boxShadow: '0 0 8px #6366F1',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );

          return collapsed ? (
            <Tooltip key={item.path} title={item.label} placement="right">
              <span>{btn}</span>
            </Tooltip>
          ) : (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {btn}
            </motion.div>
          );
        })}
      </List>

      {/* Bottom status widget */}
      {!collapsed && (
        <Box sx={{ px: 2.5, py: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '14px',
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))'
                  : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))',
              border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: isBackendConnected ? '#10B981' : '#6366F1',
                  boxShadow: `0 0 8px ${isBackendConnected ? '#10B981' : '#6366F1'}`,
                }}
              />
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.72rem' }}>
                {isBackendConnected ? 'REST BACKEND LIVE' : 'AI ENGINE ONLINE'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.4 }}>
              Adaptive algorithm dynamically scales questions to target skill gaps.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ open, collapsed, isMobile, onClose, width, collapsedWidth }) => {
  const drawerWidth = collapsed ? collapsedWidth : width;

  return (
    <>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width,
              boxSizing: 'border-box',
            },
          }}
        >
          <SidebarContent collapsed={false} onClose={onClose} />
        </Drawer>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              overflowX: 'hidden',
              transition: (t) =>
                t.transitions.create('width', {
                  easing: t.transitions.easing.sharp,
                  duration: t.transitions.duration.enteringScreen,
                }),
            },
          }}
          open
        >
          <SidebarContent collapsed={collapsed} />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
