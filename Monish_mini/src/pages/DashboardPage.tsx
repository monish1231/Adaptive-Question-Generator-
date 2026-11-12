import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  List, ListItem, ListItemText, Divider, alpha, LinearProgress, Chip,
} from '@mui/material';
import {
  AutoAwesome as GenerateIcon,
  Psychology as QuizIcon,
  TrendingUp, Bolt, EmojiEvents, LocalFireDepartment,
  BookmarkBorder,
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useQuestions } from '../context/QuestionContext';
import { DashboardStats } from '../types';
import { mockStats } from '../data/mockStats';
import { api } from '../services/api';
import StatsCard from '../components/ui/StatsCard';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, themeMode } = useApp();
  const { savedQuestions, isBackendConnected } = useQuestions();

  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await api.getStats();
        if (mounted && data) {
          setStats(data);
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard stats, using mock:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  const gridColor = themeMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';
  const axisColor = themeMode === 'dark' ? '#64748B' : '#94A3B8';

  return (
    <Box>
      {/* Welcome Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box
          sx={{
            mb: 3.5,
            p: { xs: 3, sm: 4 },
            borderRadius: '20px',
            background:
              themeMode === 'dark'
                ? 'linear-gradient(135deg, #4338CA 0%, #312E81 50%, #1E1B4B 100%)'
                : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(79, 70, 229, 0.25)',
          }}
        >
          {/* Subtle Glowing Background Rings */}
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.08)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -40,
              right: 120,
              width: 160,
              height: 160,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={isBackendConnected ? '🟢 AI ENGINE ONLINE' : '⚡ EMBEDDED SYSTEM'}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.18)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                }}
              />
              <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600 }}>
                • Daily Goal Progress: 80%
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
            </Typography>

            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 540, lineHeight: 1.6 }}>
              You're currently on an active <strong>{user?.streakDays || stats.streakDays}-day streak</strong>. Ready to generate adaptive questions or benchmark your skills today?
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<GenerateIcon />}
                onClick={() => navigate('/generate')}
                sx={{
                  bgcolor: '#ffffff',
                  color: '#3730A3',
                  fontWeight: 800,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  '&:hover': { bgcolor: '#F8FAFC' },
                }}
              >
                Generate Questions
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<QuizIcon />}
                onClick={() => navigate('/quiz')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#ffffff',
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: '#ffffff',
                    bgcolor: 'rgba(255,255,255,0.12)',
                  },
                }}
              >
                Start Adaptive Quiz
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* 4 Metric Stats Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {[
          {
            title: 'Questions Synthesized',
            value: stats.totalGenerated,
            subtitle: 'Across all topics',
            icon: <GenerateIcon />,
            color: '#6366F1',
            trend: { value: 14, label: 'vs last week' },
          },
          {
            title: 'Quiz Sessions',
            value: stats.totalSessions,
            subtitle: 'Evaluated & tracked',
            icon: <QuizIcon />,
            color: '#10B981',
            trend: { value: 9, label: 'vs last week' },
          },
          {
            title: 'Average Mastery Score',
            value: `${stats.averageScore}%`,
            subtitle: 'Adaptive accuracy',
            icon: <TrendingUp />,
            color: '#F59E0B',
            trend: { value: 6, label: 'vs last week' },
          },
          {
            title: 'Saved Flashcards',
            value: savedQuestions.length,
            subtitle: 'Study library deck',
            icon: <BookmarkBorder />,
            color: '#8B5CF6',
          },
        ].map((s, i) => (
          <Grid item xs={12} sm={6} lg={3} key={s.title}>
            <StatsCard {...s} index={i} />
          </Grid>
        ))}
      </Grid>

      {/* Analytics Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* Weekly Activity Area Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Weekly Engagement Velocity
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Questions generated vs quiz sessions completed
                    </Typography>
                  </Box>
                  <Chip
                    label="Last 7 Days"
                    size="small"
                    sx={{
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 700,
                    }}
                  />
                </Box>

                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={stats.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="qGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RTooltip
                      contentStyle={{
                        background: themeMode === 'dark' ? '#111827' : '#ffffff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="questions"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fill="url(#qGrad)"
                      name="Questions"
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      fill="url(#sGrad)"
                      name="Sessions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Difficulty Distribution Donut */}
        <Grid item xs={12} sm={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Difficulty Calibration
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                  Percentage breakdown across practice questions
                </Typography>

                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.difficultyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats.difficultyDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => <span style={{ fontSize: 12, color: axisColor, fontWeight: 600 }}>{value}</span>}
                    />
                    <RTooltip
                      contentStyle={{
                        background: themeMode === 'dark' ? '#111827' : '#ffffff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v) => [`${v}%`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Bottom Insights Row */}
      <Grid container spacing={2.5}>
        {/* Topic Mastery Progress */}
        <Grid item xs={12} md={5}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <EmojiEvents sx={{ color: '#F59E0B', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Topic Mastery Distribution
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {stats.topicDistribution.map((t, i) => (
                    <Box key={t.topic}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {t.topic}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {t.count} questions
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(t.count / (stats.topicDistribution[0]?.count || 1)) * 100}
                        sx={{
                          height: 7,
                          borderRadius: 4,
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, #6366F1, #8B5CF6)`,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Live Activity Feed */}
        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Bolt sx={{ color: '#6366F1', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Recent Activity Timeline
                  </Typography>
                </Box>

                <List dense sx={{ p: 0 }}>
                  {stats.recentActivity.map((a, i) => (
                    <React.Fragment key={a.id}>
                      <ListItem
                        sx={{
                          px: 1,
                          py: 1.4,
                          borderRadius: '10px',
                          '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.05) },
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '12px',
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            mr: 2,
                            flexShrink: 0,
                          }}
                        >
                          {a.icon}
                        </Box>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {a.description}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {a.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {i < stats.recentActivity.length - 1 && <Divider sx={{ opacity: 0.4 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
