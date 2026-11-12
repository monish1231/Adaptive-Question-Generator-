import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Divider, Chip, alpha, CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon,
  Visibility, VisibilityOff, AutoStories as BrandIcon,
  School, Code, CastForEducation,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const demoAccounts = [
  { role: 'Student', email: 'alex.rivera@edu.ai', name: 'Alex Rivera', icon: <School fontSize="small" /> },
  { role: 'Engineer', email: 'sarah.dev@tech.io', name: 'Sarah Chen', icon: <Code fontSize="small" /> },
  { role: 'Educator', email: 'dr.marcus@mit.edu', name: 'Dr. Marcus Vance', icon: <CastForEducation fontSize="small" /> },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState('alex.rivera@edu.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Rivera');
  const [role, setRole] = useState('Senior Learner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setName(acc.name);
    setRole(acc.role);
    setPassword('demoPass2026!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide valid credentials');
      return;
    }
    setLoading(true);
    setError('');

    await new Promise((r) => setTimeout(r, 900));

    login(email, name);
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
        background: (t) =>
          t.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #070A12 0%, #0D1322 50%, #111827 100%)'
            : 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #F8FAFC 100%)',
      }}
    >
      {/* Ambient background glow spheres */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: 650,
          height: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 2 }}
      >
        {/* Brand Header */}
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 30px rgba(99,102,241,0.45)',
            }}
          >
            <BrandIcon sx={{ color: '#ffffff', fontSize: 34 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
            Adaptive Question AI
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Modern AI education platform & adaptive skill benchmark
          </Typography>
        </Box>

        <Card
          sx={{
            backdropFilter: 'blur(20px)',
            bgcolor: (t) =>
              t.palette.mode === 'dark' ? alpha('#111827', 0.85) : alpha('#FFFFFF', 0.9),
            border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.25)}`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            borderRadius: '20px',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Quick Demo Selector */}
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, display: 'block', mb: 1 }}>
              ONE-CLICK DEMO PROFILES
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {demoAccounts.map((acc) => (
                <Chip
                  key={acc.role}
                  icon={acc.icon}
                  label={acc.role}
                  size="small"
                  onClick={() => handleSelectDemo(acc)}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    bgcolor:
                      email === acc.email
                        ? (t) => alpha(t.palette.primary.main, 0.2)
                        : (t) => alpha(t.palette.divider, 0.4),
                    color: email === acc.email ? 'primary.main' : 'text.secondary',
                    border: '1px solid',
                    borderColor: email === acc.email ? 'primary.main' : 'transparent',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>

            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 19 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary', fontSize: 19 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword((v) => !v)}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && (
                  <Typography variant="caption" sx={{ color: 'error.main', textAlign: 'center', fontWeight: 600 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.6,
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={18} sx={{ color: '#fff' }} />
                      Authenticating...
                    </Box>
                  ) : (
                    'Enter Platform →'
                  )}
                </Button>

                <Divider sx={{ my: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Full-Stack AI Education Environment
                  </Typography>
                </Divider>

                <Box
                  sx={{
                    p: 1.8,
                    borderRadius: '12px',
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                    border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.15)}`,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.5 }}>
                    Connected to local Express REST server on <code>/api</code>.
                    All generated questions and progress persist to database.
                  </Typography>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
