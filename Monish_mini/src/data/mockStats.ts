import { DashboardStats } from '../types';

export const mockStats: DashboardStats = {
  totalGenerated: 247,
  totalSessions: 34,
  averageScore: 78,
  streakDays: 7,
  weeklyActivity: [
    { day: 'Mon', questions: 18, sessions: 3 },
    { day: 'Tue', questions: 32, sessions: 5 },
    { day: 'Wed', questions: 12, sessions: 2 },
    { day: 'Thu', questions: 45, sessions: 7 },
    { day: 'Fri', questions: 28, sessions: 4 },
    { day: 'Sat', questions: 52, sessions: 8 },
    { day: 'Sun', questions: 60, sessions: 5 },
  ],
  difficultyDistribution: [
    { name: 'Easy', value: 35, color: '#10B981' },
    { name: 'Medium', value: 45, color: '#F59E0B' },
    { name: 'Hard', value: 20, color: '#F43F5E' },
  ],
  topicDistribution: [
    { topic: 'Python', count: 68 },
    { topic: 'Machine Learning', count: 52 },
    { topic: 'GenAI', count: 47 },
    { topic: 'React', count: 41 },
    { topic: 'DSA', count: 39 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'generate',
      description: 'Generated 10 Python questions (Medium)',
      time: '2 hours ago',
      icon: '🤖',
    },
    {
      id: '2',
      type: 'quiz',
      description: 'Completed GenAI Adaptive Quiz — Score: 85%',
      time: '5 hours ago',
      icon: '🎯',
    },
    {
      id: '3',
      type: 'save',
      description: 'Saved 3 Machine Learning questions',
      time: 'Yesterday',
      icon: '🔖',
    },
    {
      id: '4',
      type: 'generate',
      description: 'Generated 5 React questions (Easy)',
      time: 'Yesterday',
      icon: '🤖',
    },
    {
      id: '5',
      type: 'quiz',
      description: 'Completed DSA Quiz — Score: 70%',
      time: '2 days ago',
      icon: '🎯',
    },
  ],
};
