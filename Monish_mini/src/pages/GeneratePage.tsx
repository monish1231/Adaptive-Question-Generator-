import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, TextField,
  Chip, ToggleButton, ToggleButtonGroup, Slider, Divider,
  alpha, InputAdornment, Alert, Tooltip, Snackbar,
} from '@mui/material';
import {
  AutoAwesome as GenerateIcon, Search as SearchIcon,
  Clear as ClearIcon, Tune as TuneIcon, Download as DownloadIcon,
  AddCircleOutline as AddTopicIcon, ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Difficulty, QuestionType, CognitiveDepth, GenerateRequest } from '../types';
import { useQuestions } from '../context/QuestionContext';
import { TOPICS } from '../data/mockQuestions';
import QuestionCard from '../components/ui/QuestionCard';
import LoadingOverlay from '../components/ui/LoadingOverlay';

const GeneratePage: React.FC = () => {
  const { generatedQuestions, isGenerating, generateWithApi, clearGenerated } = useQuestions();

  // Form state
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Python', 'GenAI']);
  const [topicSearch, setTopicSearch] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionType, setQuestionType] = useState<QuestionType>('mcq');
  const [cognitiveDepth, setCognitiveDepth] = useState<CognitiveDepth>('concept');
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredTopics = TOPICS.filter((t) =>
    t.toLowerCase().includes(topicSearch.toLowerCase())
  );

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleAddCustomTopic = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!customTopic.trim()) return;
    const clean = customTopic.trim();
    if (!selectedTopics.includes(clean)) {
      setSelectedTopics((prev) => [...prev, clean]);
    }
    setCustomTopic('');
  };

  const handleGenerate = async () => {
    if (selectedTopics.length === 0) {
      setError('Please select or enter at least one topic.');
      return;
    }
    setError('');

    const req: GenerateRequest = {
      topics: selectedTopics,
      count,
      difficulty,
      type: questionType,
      cognitiveDepth,
    };

    await generateWithApi(req);
  };

  const handleCopyAll = () => {
    const text = generatedQuestions
      .map(
        (q, i) =>
          `Q${i + 1}. [${q.topic} - ${q.difficulty.toUpperCase()}] ${q.question}\n` +
          (q.codeSnippet ? `\`\`\`\n${q.codeSnippet}\n\`\`\`\n` : '') +
          (q.options ? q.options.map((o) => `[${o.id.toUpperCase()}] ${o.text}`).join('\n') + '\n' : '') +
          `Answer: ${q.correctAnswer}\nExplanation: ${q.explanation}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setToastMsg('All questions copied to clipboard!');
  };

  const handleDownloadMarkdown = () => {
    const md =
      `# Generated Questions Set\n` +
      `**Topics:** ${selectedTopics.join(', ')} | **Difficulty:** ${difficulty} | **Type:** ${questionType}\n\n` +
      generatedQuestions
        .map(
          (q, i) =>
            `### Q${i + 1}. ${q.question}\n\n` +
            (q.codeSnippet ? `\`\`\`\n${q.codeSnippet}\n\`\`\`\n\n` : '') +
            (q.options ? q.options.map((o) => `- **[${o.id.toUpperCase()}]** ${o.text}`).join('\n') + '\n\n' : '') +
            `* **Correct Answer:** ${q.correctAnswer}\n` +
            `* **Explanation:** ${q.explanation}\n\n---`
        )
        .join('\n\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions-${selectedTopics[0] || 'set'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMsg('Markdown export downloaded!');
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left: Configuration Sidebar */}
        <Grid item xs={12} lg={4.2}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card sx={{ position: { lg: 'sticky' }, top: { lg: 84 } }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main',
                    }}
                  >
                    <TuneIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                      Generator Studio
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Configure topics & AI parameters
                    </Typography>
                  </Box>
                </Box>

                {/* Topic Search & Custom Input */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>
                  TOPICS & DOMAINS
                </Typography>

                <form onSubmit={handleAddCustomTopic}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search or add custom topic (Enter)..."
                    value={customTopic}
                    onChange={(e) => {
                      setCustomTopic(e.target.value);
                      setTopicSearch(e.target.value);
                    }}
                    sx={{ mb: 1.5 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: customTopic && (
                        <InputAdornment position="end">
                          <Tooltip title="Add as custom topic">
                            <Button size="small" type="submit" sx={{ minWidth: 'auto', p: 0.5 }}>
                              <AddTopicIcon fontSize="small" color="primary" />
                            </Button>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>

                {/* Popular Topics Chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2, maxHeight: 120, overflowY: 'auto' }}>
                  {filteredTopics.map((topic) => {
                    const active = selectedTopics.includes(topic);
                    return (
                      <Chip
                        key={topic}
                        label={topic}
                        size="small"
                        onClick={() => toggleTopic(topic)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          transition: 'all 0.15s ease',
                          bgcolor: active
                            ? (t) => alpha(t.palette.primary.main, 0.2)
                            : (t) => alpha(t.palette.divider, 0.4),
                          color: active ? 'primary.main' : 'text.secondary',
                          border: '1px solid',
                          borderColor: active ? 'primary.main' : 'transparent',
                          '&:hover': {
                            bgcolor: (t) => alpha(t.palette.primary.main, active ? 0.25 : 0.1),
                          },
                        }}
                      />
                    );
                  })}
                </Box>

                {/* Selected Topics List */}
                {selectedTopics.length > 0 && (
                  <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '10px', bgcolor: (t) => alpha(t.palette.primary.main, 0.05) }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
                        SELECTED ({selectedTopics.length})
                      </Typography>
                      <Button
                        size="small"
                        sx={{ p: 0, fontSize: '0.7rem', minWidth: 'auto', color: 'text.secondary' }}
                        onClick={() => setSelectedTopics([])}
                      >
                        Clear All
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                      {selectedTopics.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          size="small"
                          onDelete={() => toggleTopic(t)}
                          color="primary"
                          sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ mb: 2.5 }} />

                {/* Number of Questions Slider */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    QUESTION COUNT
                  </Typography>
                  <Chip
                    label={`${count} questions`}
                    size="small"
                    sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: 'primary.main', fontWeight: 800 }}
                  />
                </Box>
                <Slider
                  value={count}
                  onChange={(_, v) => setCount(v as number)}
                  min={1}
                  max={20}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                  ]}
                  sx={{ mb: 3 }}
                />

                <Divider sx={{ mb: 2.5 }} />

                {/* Difficulty Segmented Control */}
                <Typography variant="subtitle2" sx={{ mb: 1.2, fontWeight: 700, color: 'text.secondary' }}>
                  DIFFICULTY TARGET
                </Typography>
                <ToggleButtonGroup
                  value={difficulty}
                  exclusive
                  onChange={(_, v) => v && setDifficulty(v)}
                  fullWidth
                  sx={{ mb: 2.5, flexWrap: 'wrap', gap: 0.5 }}
                >
                  {[
                    { value: 'easy', label: '🟢 Easy' },
                    { value: 'medium', label: '🟡 Medium' },
                    { value: 'hard', label: '🔴 Hard' },
                    { value: 'adaptive', label: '⚡ Adaptive' },
                  ].map((d) => (
                    <ToggleButton
                      key={d.value}
                      value={d.value}
                      sx={{ flex: '1 1 45%', py: 0.8, fontSize: '0.78rem' }}
                    >
                      {d.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                <Divider sx={{ mb: 2.5 }} />

                {/* Question Type */}
                <Typography variant="subtitle2" sx={{ mb: 1.2, fontWeight: 700, color: 'text.secondary' }}>
                  QUESTION FORMAT
                </Typography>
                <ToggleButtonGroup
                  value={questionType}
                  exclusive
                  onChange={(_, v) => v && setQuestionType(v)}
                  fullWidth
                  sx={{ mb: 2.5, flexDirection: 'column', gap: 0.6 }}
                >
                  {[
                    { value: 'mcq', label: '📋 Multiple Choice (MCQ)' },
                    { value: 'truefalse', label: '✔️ True / False Statement' },
                    { value: 'fillinblank', label: '✏️ Fill in the Blank' },
                  ].map((t) => (
                    <ToggleButton
                      key={t.value}
                      value={t.value}
                      sx={{ justifyContent: 'flex-start', py: 0.9, px: 2, fontSize: '0.8rem' }}
                    >
                      {t.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                {/* Cognitive Depth */}
                <Typography variant="subtitle2" sx={{ mb: 1.2, fontWeight: 700, color: 'text.secondary' }}>
                  COGNITIVE FOCUS
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mb: 3 }}>
                  {[
                    { id: 'concept', label: '🧠 Concepts' },
                    { id: 'code', label: '💻 Code Analysis' },
                    { id: 'debug', label: '🐛 Debugging' },
                    { id: 'scenario', label: '🌐 System Scenarios' },
                  ].map((item) => (
                    <Chip
                      key={item.id}
                      label={item.label}
                      size="small"
                      onClick={() => setCognitiveDepth(item.id as CognitiveDepth)}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 600,
                        bgcolor:
                          cognitiveDepth === item.id
                            ? (t) => alpha(t.palette.primary.main, 0.2)
                            : 'transparent',
                        color: cognitiveDepth === item.id ? 'primary.main' : 'text.secondary',
                        border: '1px solid',
                        borderColor: cognitiveDepth === item.id ? 'primary.main' : 'divider',
                      }}
                    />
                  ))}
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

                {/* Generate Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  startIcon={<GenerateIcon />}
                  sx={{
                    py: 1.6,
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
                  }}
                >
                  {isGenerating ? 'AI Synthesizing Questions...' : 'Generate Questions'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right: Results Display */}
        <Grid item xs={12} lg={7.8}>
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card sx={{ minHeight: 460, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LoadingOverlay />
                </Card>
              </motion.div>
            ) : generatedQuestions.length > 0 ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Results Header Bar */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                    mb: 2.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Generated Questions
                      </Typography>
                      <Chip
                        label={`${generatedQuestions.length} Items`}
                        size="small"
                        sx={{
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                          color: 'primary.main',
                          fontWeight: 800,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Topics: {selectedTopics.join(', ')} • {difficulty.toUpperCase()} • {questionType.toUpperCase()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      startIcon={<CopyIcon />}
                      variant="outlined"
                      onClick={handleCopyAll}
                      sx={{ fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      Copy All
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      variant="outlined"
                      onClick={handleDownloadMarkdown}
                      sx={{ fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      Markdown
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<ClearIcon />}
                      onClick={clearGenerated}
                      sx={{ fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>

                {/* Question Cards List */}
                {generatedQuestions.map((q, i) => (
                  <QuestionCard key={q.id} question={q} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card sx={{ minHeight: 460, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CardContent sx={{ textAlign: 'center', py: 8, px: 3 }}>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Box
                        sx={{
                          width: 88,
                          height: 88,
                          borderRadius: '24px',
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
                          border: '1.5px solid rgba(99,102,241,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2.5,
                          fontSize: '3rem',
                        }}
                      >
                        ✨
                      </Box>
                    </motion.div>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                      AI Question Generation Studio
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mb: 3.5, maxWidth: 440, mx: 'auto', lineHeight: 1.6 }}
                    >
                      Select from curated topics or enter any custom skill. Configure question count, difficulty, and format, then hit <strong>Generate Questions</strong>.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {[
                        '⚡ Real-time Adaptive Engine',
                        '🎯 Multi-level Explanations',
                        '💾 Instant Study Deck Bookmark',
                      ].map((item) => (
                        <Chip
                          key={item}
                          label={item}
                          sx={{
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>

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

export default GeneratePage;
