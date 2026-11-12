import React from 'react';
import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingOverlay: React.FC = () => {
  const dots = [0, 1, 2];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        gap: 3,
      }}
    >
      {/* Animated robot icon */}
      <Box sx={{ position: 'relative', width: 100, height: 100 }}>
        {/* Glow rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid rgba(99,102,241,0.3)',
            }}
            animate={{ scale: [1, 1.4 + i * 0.15], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
          />
        ))}
        {/* Core circle */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99,102,241,0.5)',
          }}
        >
          <Typography sx={{ fontSize: '2.2rem' }}>🤖</Typography>
        </motion.div>
      </Box>

      {/* Text */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Generating Questions
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            AI is crafting personalized questions
          </Typography>
          {dots.map((i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block', color: '#6366F1', fontSize: '1.2rem', lineHeight: 1 }}
              animate={{ opacity: [0, 1, 0], y: [0, -4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            >
              .
            </motion.span>
          ))}
        </Box>
      </Box>

      {/* Progress bar */}
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
          }}
        />
      </Box>

      {/* Step indicators */}
      {['Analyzing topics', 'Selecting difficulty', 'Crafting questions', 'Adding explanations'].map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.5, duration: 0.4 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.5 + 0.3 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
              {step}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default LoadingOverlay;
