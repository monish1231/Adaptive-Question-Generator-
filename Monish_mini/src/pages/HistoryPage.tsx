import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button, Collapse,
  IconButton, TextField, InputAdornment, Select, MenuItem,
  FormControl, InputLabel, alpha, Divider, Grid, Tooltip, Snackbar, Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon, Delete as DeleteIcon,
  Search as SearchIcon, FilterList as FilterIcon,
  Download as ExportIcon, ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestions } from '../context/QuestionContext';
import QuestionCard from '../components/ui/QuestionCard';
import { timeAgo } from '../utils/questionGenerator';
import { HistorySession } from '../types';

const difficultyColors: Record<string, string> = {
  easy: '#10B981', medium: '#F59E0B', hard: '#F43F5E', adaptive: '#6366F1',
};
const typeLabels: Record<string, string> = {
  mcq: 'MCQ', truefalse: 'True/False', fillinblank: 'Fill in Blank',
};

const SessionRow: React.FC<{
  session: HistorySession;
  onDelete: () => void;
  onNotify: (msg: string) => void;
  index: number;
}> = ({ session, onDelete, onNotify, index }) => {
  const [expanded, setExpanded] = useState(false);

  const handleCopySession = (e: React.MouseEvent) => {
    e.stopPropagation();
    const md = session.questions
      .map(
        (q, i) =>
          `Q${i + 1}. [${q.topic} - ${q.difficulty.toUpperCase()}] ${q.question}\n` +
          (q.options ? q.options.map((o) => `[${o.id.toUpperCase()}] ${o.text}`).join('\n') + '\n' : '') +
          `Answer: ${q.correctAnswer}\nExplanation: ${q.explanation}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(md);
    onNotify('Session questions copied to clipboard!');
  };

  const handleDownloadSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    const md =
      `# Questions Session - ${session.topics.join(', ')}\n` +
      `Date: ${session.generatedAt} | Difficulty: ${session.difficulty} | Format: ${session.type}\n\n` +
      session.questions
        .map(
          (q, i) =>
            `### Q${i + 1}. ${q.question}\n\n` +
            (q.codeSnippet ? `\`\`\`\n${q.codeSnippet}\n\`\`\`\n\n` : '') +
            (q.options ? q.options.map((o) => `- [${o.id.toUpperCase()}] ${o.text}`).join('\n') + '\n\n' : '') +
            `* **Answer:** ${q.correctAnswer}\n` +
            `* **Explanation:** ${q.explanation}\n\n---`
        )
        .join('\n\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${session.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Session markdown downloaded!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        sx={{
          mb: 2.2,
          '&:hover': { borderColor: alpha('#6366F1', 0.5) },
          transition: 'all 0.2s ease',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: { xs: 2, sm: 3 },
              py: 2,
              flexWrap: 'wrap',
              cursor: 'pointer',
              '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.03) },
            }}
            onClick={() => setExpanded((v) => !v)}
          >
            {/* Session icon */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
              }}
            >
              <Typography sx={{ fontSize: '1.25rem' }}>🤖</Typography>
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 0.6 }}>
                {session.topics.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    sx={{ fontSize: '0.7rem', fontWeight: 700, height: 22 }}
                  />
                ))}
                <Chip
                  label={session.difficulty.toUpperCase()}
                  size="small"
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    height: 22,
                    bgcolor: alpha(difficultyColors[session.difficulty] || '#6366F1', 0.15),
                    color: difficultyColors[session.difficulty] || '#6366F1',
                  }}
                />
                <Chip
                  label={typeLabels[session.type]}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.68rem', height: 22 }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {session.questions.length} questions • Synthesized {timeAgo(session.generatedAt)}
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Tooltip title="Copy session questions">
                <IconButton size="small" onClick={handleCopySession} sx={{ color: 'text.secondary' }}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Markdown">
                <IconButton size="small" onClick={handleDownloadSession} sx={{ color: 'text.secondary' }}>
                  <ExportIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete session">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  sx={{ color: 'error.main', '&:hover': { bgcolor: alpha('#F43F5E', 0.1) } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton
                size="small"
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                  color: 'text.secondary',
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Expanded questions list */}
          <Collapse in={expanded}>
            <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2.5 }}>
              <Divider sx={{ mb: 2.5 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 2 }}>
                SESSION QUESTIONS ({session.questions.length})
              </Typography>
              {session.questions.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} showAnswer />
              ))}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HistoryPage: React.FC = () => {
  const { history, deleteHistory } = useQuestions();
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filtered = history.filter((s) => {
    const matchSearch =
      search === '' ||
      s.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = filterDifficulty === 'all' || s.difficulty === filterDifficulty;
    const matchType = filterType === 'all' || s.type === filterType;
    return matchSearch && matchDiff && matchType;
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
          Generation History Archive
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {history.length} saved sessions • {history.reduce((acc, s) => acc + s.questions.length, 0)} total generated questions
        </Typography>
      </Box>

      {/* Filters Toolbar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search history by topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={filterDifficulty}
                  label="Difficulty"
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <MenuItem value="all">All Difficulties</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                  <MenuItem value="adaptive">Adaptive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Formats</MenuItem>
                  <MenuItem value="mcq">MCQ</MenuItem>
                  <MenuItem value="truefalse">True/False</MenuItem>
                  <MenuItem value="fillinblank">Fill in Blank</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Chip
                icon={<FilterIcon sx={{ fontSize: '14px !important' }} />}
                label={filtered.length}
                size="small"
                sx={{
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 700,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Session list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: '4.5rem', mb: 2 }}>📭</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No generation sessions found
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {history.length === 0
                  ? 'Generate some questions to record your first history session.'
                  : 'Try clearing your search query or filters.'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {filtered.map((session, i) => (
            <SessionRow
              key={session.id}
              session={session}
              index={i}
              onNotify={(msg) => setToastMsg(msg)}
              onDelete={() => deleteHistory(session.id)}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMsg)}
        autoHideDuration={3000}
        onClose={() => setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: '10px' }} onClose={() => setToastMsg(null)}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HistoryPage;
