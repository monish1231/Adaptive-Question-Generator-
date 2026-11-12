import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: { value: number; label: string };
  index?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title, value, subtitle, icon, color, trend, index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 30px ${alpha(color, 0.2)}`,
          },
          transition: 'all 0.25s',
        }}
      >
        {/* Background accent */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: alpha(color, 0.08),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: alpha(color, 0.1),
          }}
        />

        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: alpha(color, 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
              }}
            >
              {icon}
            </Box>
            {trend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.4,
                  px: 1,
                  py: 0.3,
                  borderRadius: '6px',
                  bgcolor: trend.value >= 0 ? alpha('#10B981', 0.1) : alpha('#F43F5E', 0.1),
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    color: trend.value >= 0 ? '#10B981' : '#F43F5E',
                  }}
                >
                  {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.3, color }}>
            {value}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.3 }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
