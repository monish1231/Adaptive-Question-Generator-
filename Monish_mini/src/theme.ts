import { createTheme, alpha } from '@mui/material/styles';

const indigo = '#6366F1';
const indigoDark = '#4F46E5';
const violet = '#8B5CF6';
const emerald = '#10B981';
const amber = '#F59E0B';
const rose = '#F43F5E';
const cyan = '#06B6D4';

// Dark palette: Deep obsidian space
const darkBg = '#0B0F19';
const darkPaper = '#111827';
const darkElevated = '#1E293B';

// Light palette: Clean porcelain slate
const lightBg = '#F8FAFC';
const lightPaper = '#FFFFFF';
const lightElevated = '#F1F5F9';

export const getTheme = (mode: 'dark' | 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: indigo,
        dark: indigoDark,
        light: '#818CF8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: violet,
        contrastText: '#ffffff',
      },
      success: { main: emerald },
      warning: { main: amber },
      error: { main: rose },
      info: { main: cyan },
      background: {
        default: mode === 'dark' ? darkBg : lightBg,
        paper: mode === 'dark' ? darkPaper : lightPaper,
      },
      text: {
        primary: mode === 'dark' ? '#F9FAFB' : '#0F172A',
        secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.5 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? darkBg : lightBg,
            backgroundImage:
              mode === 'dark'
                ? `radial-gradient(at 15% 15%, rgba(99, 102, 241, 0.12) 0px, transparent 40%),
                   radial-gradient(at 85% 85%, rgba(139, 92, 246, 0.08) 0px, transparent 45%)`
                : `radial-gradient(at 20% 20%, rgba(99, 102, 241, 0.06) 0px, transparent 50%),
                   radial-gradient(at 80% 80%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)`,
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '9px 20px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.25)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${indigo} 0%, ${indigoDark} 100%)`,
            border: '1px solid rgba(255,255,255,0.15)',
            '&:hover': {
              background: `linear-gradient(135deg, #7073f3 0%, ${indigoDark} 100%)`,
            },
          },
          outlined: {
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.14)',
            '&:hover': {
              borderColor: indigo,
              backgroundColor: alpha(indigo, 0.08),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'dark' ? darkPaper : lightPaper,
            borderRadius: 16,
            border:
              mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.07)'
                : '1px solid rgba(15, 23, 42, 0.07)',
            boxShadow:
              mode === 'dark'
                ? '0 4px 20px rgba(0, 0, 0, 0.35)'
                : '0 4px 24px rgba(15, 23, 42, 0.05)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.72rem',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: mode === 'dark' ? alpha('#1E293B', 0.5) : alpha('#F8FAFC', 0.8),
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.12)',
              },
              '&:hover fieldset': {
                borderColor: alpha(indigo, 0.6),
              },
              '&.Mui-focused fieldset': {
                borderColor: indigo,
                borderWidth: '1.5px',
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#0D1322' : '#FFFFFF',
            borderRight: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.06)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.06)',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: mode === 'dark' ? alpha(indigo, 0.15) : alpha(indigo, 0.1),
          },
          bar: {
            borderRadius: 6,
            background: `linear-gradient(90deg, ${indigo}, ${emerald})`,
          },
        },
      },
    },
  });

export default getTheme;
