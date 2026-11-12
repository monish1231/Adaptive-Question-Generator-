import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, TextField,
  Chip, InputAdornment, IconButton, Tooltip, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  BookmarkRemove as RemoveIcon,
  Style as FlashcardIcon,
  ViewList as ListIcon,
  Download as ExportIcon,
  AutoAwesome as GenerateIcon,
  NavigateNext, NavigateBefore, FlipCameraAndroid, ContentCopy,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../context/QuestionContext';
import QuestionCard from '../components/ui/QuestionCard';

const difficultyColors: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#F43F5E',
};

const SavedPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedQuestions, unsaveQuestion } = useQuestions();

  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');

  // Flashcard state
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Export dialog
  const [exportOpen, setExportOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Available topics from saved
  const topics = Array.from(new Set(savedQuestions.map((q) => q.topic)));

  // Filtered list
  const filtered = savedQuestions.filter((q) => {
    const matchSearch =
      search === '' ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase());
    const matchTopic = selectedTopic === 'all' || q.topic === selectedTopic;
    const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchSearch && matchTopic && matchDiff;
  });

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIdx((prev) => (prev + 1) % filtered.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  const getMarkdownExport = () => {
    return filtered
      .map(
        (q, i) =>
          `### Q${i + 1}. [${q.topic} - ${q.difficulty.toUpperCase()}] ${q.question}\n\n` +
          (q.codeSnippet ? `\`\`\`\n${q.codeSnippet}\n\`\`\`\n\n` : '') +
          (q.options ? q.options.map((o) => `- [${o.id.toUpperCase()}] ${o.text}`).join('\n') + '\n\n' : '') +
          `**Correct Answer:** ${q.correctAnswer}\n\n` +
          `**Explanation:** ${q.explanation}\n\n---\n`
      )
      .join('\n');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownExport());
    setToastMsg('Markdown study guide copied to clipboard!');
    setExportOpen(false);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saved-questions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMsg('JSON file downloaded!');
    setExportOpen(false);
  };

  return (
    <Box>
      {/* Header Banner */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Saved Questions Library
            </Typography>
            <Chip
              label={`${savedQuestions.length} bookmarked`}
              size="small"
              sx={{
                bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                color: 'primary.main',
                fontWeight: 700,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Review bookmarked questions, practice with interactive flashcards, or export study sheets.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant={viewMode === 'flashcard' ? 'contained' : 'outlined'}
            size="small"
            startIcon={viewMode === 'flashcard' ? <ListIcon /> : <FlashcardIcon />}
            onClick={() => {
              setViewMode((m) => (m === 'list' ? 'flashcard' : 'list'));
              setIsFlipped(false);
              setCurrentFlashcardIdx(0);
            }}
            disabled={filtered.length === 0}
            sx={{ fontWeight: 600 }}
          >
            {viewMode === 'flashcard' ? 'List View' : 'Flashcard Mode'}
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<ExportIcon />}
            onClick={() => setExportOpen(true)}
            disabled={filtered.length === 0}
            sx={{ fontWeight: 600 }}
          >
            Export Deck
          </Button>
        </Box>
      </Box>

      {/* Filters Toolbar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search saved questions or concepts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Topic Filter */}
            <Grid item xs={6} md={4}>
              <Box sx={{ display: 'flex', gap: 0.8, overflowX: 'auto', pb: 0.5 }}>
                <Chip
                  label="All Topics"
                  size="small"
                  onClick={() => setSelectedTopic('all')}
                  sx={{
                    fontWeight: 600,
                    cursor: 'pointer',
                    bgcolor: selectedTopic === 'all' ? (t) => alpha(t.palette.primary.main, 0.2) : 'transparent',
                    color: selectedTopic === 'all' ? 'primary.main' : 'text.secondary',
                    border: '1px solid',
                    borderColor: selectedTopic === 'all' ? 'primary.main' : 'divider',
                  }}
                />
                {topics.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    onClick={() => setSelectedTopic(t)}
                    sx={{
                      fontWeight: 600,
                      cursor: 'pointer',
                      bgcolor: selectedTopic === t ? (th) => alpha(th.palette.primary.main, 0.2) : 'transparent',
                      color: selectedTopic === t ? 'primary.main' : 'text.secondary',
                      border: '1px solid',
                      borderColor: selectedTopic === t ? 'primary.main' : 'divider',
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Difficulty Filter */}
            <Grid item xs={6} md={3}>
              <Box sx={{ display: 'flex', gap: 0.8, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                {['all', 'easy', 'medium', 'hard'].map((diff) => (
                  <Chip
                    key={diff}
                    label={diff === 'all' ? 'All' : diff.toUpperCase()}
                    size="small"
                    onClick={() => setSelectedDifficulty(diff)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      bgcolor:
                        selectedDifficulty === diff
                          ? diff === 'all'
                            ? (t) => alpha(t.palette.primary.main, 0.2)
                            : alpha(difficultyColors[diff] || '#6366F1', 0.2)
                          : 'transparent',
                      color:
                        selectedDifficulty === diff
                          ? diff === 'all'
                            ? 'primary.main'
                            : difficultyColors[diff] || '#6366F1'
                          : 'text.secondary',
                      border: '1px solid',
                      borderColor:
                        selectedDifficulty === diff
                          ? diff === 'all'
                            ? 'primary.main'
                            : difficultyColors[diff] || '#6366F1'
                          : 'divider',
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
              <Typography sx={{ fontSize: '4.5rem', mb: 2 }}>🔖</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {savedQuestions.length === 0 ? 'No Saved Questions Yet' : 'No Matching Questions Found'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 440, mx: 'auto' }}>
                {savedQuestions.length === 0
                  ? 'Generate custom questions on the Generate page and click the bookmark ribbon to save them here for study.'
                  : 'Try adjusting your search query or topic filter to view other saved questions.'}
              </Typography>
              {savedQuestions.length === 0 && (
                <Button
                  variant="contained"
                  startIcon={<GenerateIcon />}
                  onClick={() => navigate('/generate')}
                  sx={{ fontWeight: 700 }}
                >
                  Generate New Questions
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : viewMode === 'flashcard' ? (
        // ── Flashcard Study Mode ───────────────────────────────────────────────
        <Box sx={{ maxWidth: { xs: '100%', md: 840 }, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              Flashcard {currentFlashcardIdx + 1} of {filtered.length}
            </Typography>
            <Tooltip title="Remove from saved deck">
              <IconButton
                size="small"
                onClick={() => {
                  unsaveQuestion(filtered[currentFlashcardIdx].id);
                  if (currentFlashcardIdx >= filtered.length - 1) {
                    setCurrentFlashcardIdx(Math.max(0, filtered.length - 2));
                  }
                }}
                sx={{ color: 'error.main' }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Flashcard Card with Flip Effect */}
          <motion.div
            key={currentFlashcardIdx}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              onClick={() => setIsFlipped((f) => !f)}
              sx={{
                minHeight: 340,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: { xs: 2.5, sm: 4 },
                bgcolor: (t) =>
                  isFlipped
                    ? alpha(t.palette.secondary.main, 0.04)
                    : alpha(t.palette.primary.main, 0.03),
                border: (t) =>
                  `1.5px solid ${
                    isFlipped ? alpha(t.palette.secondary.main, 0.4) : alpha(t.palette.primary.main, 0.3)
                  }`,
                boxShadow: isFlipped
                  ? '0 12px 36px rgba(16,185,129,0.15)'
                  : '0 12px 36px rgba(99,102,241,0.15)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Card Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={filtered[currentFlashcardIdx].topic}
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  <Chip
                    label={filtered[currentFlashcardIdx].difficulty.toUpperCase()}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      bgcolor: alpha(difficultyColors[filtered[currentFlashcardIdx].difficulty] || '#6366F1', 0.15),
                      color: difficultyColors[filtered[currentFlashcardIdx].difficulty] || '#6366F1',
                    }}
                  />
                </Box>
                <Chip
                  icon={<FlipCameraAndroid sx={{ fontSize: '14px !important' }} />}
                  label={isFlipped ? 'Answer Revealed' : 'Click to Flip'}
                  size="small"
                  sx={{
                    bgcolor: (t) => alpha(isFlipped ? t.palette.success.main : t.palette.primary.main, 0.1),
                    color: isFlipped ? 'success.main' : 'primary.main',
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Card Body */}
              <Box sx={{ my: 'auto', py: 2 }}>
                {!isFlipped ? (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.5, mb: 2 }}>
                      {filtered[currentFlashcardIdx].question}
                    </Typography>

                    {filtered[currentFlashcardIdx].codeSnippet && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '8px',
                          bgcolor: (t) => (t.palette.mode === 'dark' ? '#0F172A' : '#1E293B'),
                          color: '#E2E8F0',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          overflowX: 'auto',
                          mb: 2,
                        }}
                      >
                        <pre style={{ margin: 0 }}>{filtered[currentFlashcardIdx].codeSnippet}</pre>
                      </Box>
                    )}

                    {filtered[currentFlashcardIdx].options && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                        {filtered[currentFlashcardIdx].options?.map((opt) => (
                          <Box
                            key={opt.id}
                            sx={{
                              p: 1.2,
                              borderRadius: '8px',
                              border: (t) => `1px solid ${t.palette.divider}`,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>
                              [{opt.id.toUpperCase()}]
                            </Typography>
                            <Typography variant="body2">{opt.text}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: '12px',
                        bgcolor: alpha('#10B981', 0.12),
                        border: '1px solid rgba(16,185,129,0.3)',
                        mb: 2.5,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 800, display: 'block', mb: 0.5 }}>
                        CORRECT ANSWER
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#10B981' }}>
                        {filtered[currentFlashcardIdx].options?.find(
                          (o) => o.id === filtered[currentFlashcardIdx].correctAnswer
                        )?.text || filtered[currentFlashcardIdx].correctAnswer}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
                      💡 Detailed Explanation:
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                      {filtered[currentFlashcardIdx].explanation}
                    </Typography>
                  </motion.div>
                )}
              </Box>

              {/* Navigation controls */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
                <Button
                  size="small"
                  startIcon={<NavigateBefore />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevFlashcard();
                  }}
                  disabled={filtered.length <= 1}
                >
                  Previous
                </Button>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Tap card to toggle answer
                </Typography>
                <Button
                  size="small"
                  endIcon={<NavigateNext />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextFlashcard();
                  }}
                  disabled={filtered.length <= 1}
                >
                  Next
                </Button>
              </Box>
            </Card>
          </motion.div>
        </Box>
      ) : (
        // ── List View ──────────────────────────────────────────────────────────
        <AnimatePresence>
          {filtered.map((question, idx) => (
            <QuestionCard key={question.id} question={question} index={idx} showAnswer />
          ))}
        </AnimatePresence>
      )}

      {/* Export Deck Modal */}
      <Dialog open={exportOpen} onClose={() => setExportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Export Saved Deck</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Export {filtered.length} saved question{filtered.length === 1 ? '' : 's'} as Markdown or JSON format for offline review or study tools.
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: '8px',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
              border: (t) => `1px solid ${t.palette.divider}`,
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              maxHeight: 180,
              overflowY: 'auto',
            }}
          >
            <pre style={{ margin: 0 }}>{getMarkdownExport().slice(0, 400)}...</pre>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setExportOpen(false)}>Cancel</Button>
          <Button variant="outlined" startIcon={<ContentCopy />} onClick={handleCopyMarkdown}>
            Copy Markdown
          </Button>
          <Button variant="contained" startIcon={<ExportIcon />} onClick={handleDownloadJSON}>
            Download JSON
          </Button>
        </DialogActions>
      </Dialog>

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

export default SavedPage;
