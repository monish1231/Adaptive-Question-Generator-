import { db } from './db.js';

const PORT = process.env.PORT || 5000;

// Try loading express and cors dynamically
let express;
let cors;
try {
  express = (await import('express')).default;
  cors = (await import('cors')).default;
} catch {
  // Fallback will use native node:http
}

if (express) {
  // ─── Express Implementation ──────────────────────────────────────────────
  const app = express();

  if (cors) {
    app.use(cors({ origin: true, credentials: true }));
  } else {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') return res.sendStatus(204);
      next();
    });
  }

  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      version: '1.2.0',
      service: 'Adaptive Question Generator Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Auth endpoints
  app.post('/api/auth/login', (req, res) => {
    const { email, name, role } = req.body || {};
    const defaultName = name || (email ? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Learner');
    const user = {
      id: `user-${Date.now()}`,
      name: defaultName,
      email: email || 'student@aqg.ai',
      avatar: defaultName.charAt(0).toUpperCase(),
      role: role || 'Student',
      streakDays: db.getUser().streakDays || 8,
      joinedAt: new Date().toISOString(),
    };
    db.data.user = user;
    db.save();
    res.json({ success: true, user, token: `mock-token-${Date.now()}` });
  });

  app.get('/api/auth/me', (req, res) => {
    res.json(db.getUser());
  });

  // Stats
  app.get('/api/stats', (req, res) => {
    res.json(db.getStats());
  });

  // Topics
  app.get('/api/topics', (req, res) => {
    res.json(db.getTopics());
  });

  // Questions generation
  app.post('/api/generate', async (req, res) => {
    const { topics = [], count = 5, difficulty = 'medium', type = 'mcq' } = req.body || {};
    
    // Simulate AI generation processing delay for realism
    await new Promise((r) => setTimeout(r, 1200));

    const questions = db.generateQuestions({ topics, count, difficulty, type });
    res.json({
      success: true,
      count: questions.length,
      topics,
      difficulty,
      type,
      questions,
    });
  });

  // History
  app.get('/api/history', (req, res) => {
    res.json(db.getHistory());
  });

  app.delete('/api/history/:id', (req, res) => {
    const { id } = req.params;
    db.deleteHistory(id);
    res.json({ success: true, message: `Session ${id} deleted` });
  });

  // Saved Questions
  app.get('/api/saved', (req, res) => {
    res.json(db.getSaved());
  });

  app.post('/api/saved', (req, res) => {
    const question = req.body;
    const saved = db.saveQuestion(question);
    res.json({ success: true, saved });
  });

  app.delete('/api/saved/:id', (req, res) => {
    const { id } = req.params;
    db.unsaveQuestion(id);
    res.json({ success: true, message: `Question ${id} removed from saved` });
  });

  // Quiz endpoints
  app.post('/api/quiz/start', (req, res) => {
    const { topic = 'Python', count = 10 } = req.body || {};
    const questions = db.generateQuestions({
      topics: [topic],
      count,
      difficulty: 'adaptive',
      type: 'mcq',
    });
    res.json({
      sessionId: `quiz-run-${Date.now()}`,
      topic,
      totalQuestions: questions.length,
      questions,
    });
  });

  app.post('/api/quiz/submit', (req, res) => {
    const { questionId, selectedAnswer, correctAnswer, currentDifficulty } = req.body;
    const isCorrect = selectedAnswer === correctAnswer;

    const diffLevels = ['easy', 'medium', 'hard'];
    let nextDifficulty = currentDifficulty || 'medium';
    const currIdx = diffLevels.indexOf(currentDifficulty);

    if (isCorrect && currIdx < 2) {
      nextDifficulty = diffLevels[currIdx + 1];
    } else if (!isCorrect && currIdx > 0) {
      nextDifficulty = diffLevels[currIdx - 1];
    }

    res.json({
      isCorrect,
      correctAnswer,
      nextDifficulty,
      adaptiveShift: isCorrect ? '+1 (Level Up)' : '-1 (Consolidate)',
    });
  });

  app.post('/api/quiz/finish', (req, res) => {
    const { topic, score, totalQuestions, correctCount } = req.body;
    const session = db.recordQuizSession({ topic, score, totalQuestions, correctCount });
    res.json({
      success: true,
      session,
      streakDays: db.getUser().streakDays,
    });
  });

  app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 [BACKEND] Adaptive Question Generator Server`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(`=================================================\n`);
  });
} else {
  // ─── Native Node.js HTTP Fallback ─────────────────────────────────────────
  const http = await import('node:http');

  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;

    const sendJson = (data, status = 200) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    let body = {};
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString();
      try {
        if (rawBody) body = JSON.parse(rawBody);
      } catch {}
    }

    console.log(`[Native API] ${req.method} ${pathname}`);

    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson({ status: 'ok', version: '1.2.0', engine: 'Node HTTP Native' });
    }
    if (pathname === '/api/stats' && req.method === 'GET') {
      return sendJson(db.getStats());
    }
    if (pathname === '/api/topics' && req.method === 'GET') {
      return sendJson(db.getTopics());
    }
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      return sendJson(db.getUser());
    }
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const user = {
        id: `user-${Date.now()}`,
        name: body.name || 'Alex Rivera',
        email: body.email || 'alex@aqg.ai',
        avatar: (body.name || 'Alex').charAt(0),
        role: body.role || 'Student',
        streakDays: db.getUser().streakDays || 8,
        joinedAt: new Date().toISOString(),
      };
      db.data.user = user;
      db.save();
      return sendJson({ success: true, user, token: `mock-token-${Date.now()}` });
    }
    if (pathname === '/api/generate' && req.method === 'POST') {
      const questions = db.generateQuestions(body);
      return sendJson({ success: true, count: questions.length, questions });
    }
    if (pathname === '/api/history' && req.method === 'GET') {
      return sendJson(db.getHistory());
    }
    if (pathname.startsWith('/api/history/') && req.method === 'DELETE') {
      const id = pathname.split('/').pop();
      db.deleteHistory(id);
      return sendJson({ success: true });
    }
    if (pathname === '/api/saved' && req.method === 'GET') {
      return sendJson(db.getSaved());
    }
    if (pathname === '/api/saved' && req.method === 'POST') {
      const saved = db.saveQuestion(body);
      return sendJson({ success: true, saved });
    }
    if (pathname.startsWith('/api/saved/') && req.method === 'DELETE') {
      const id = pathname.split('/').pop();
      db.unsaveQuestion(id);
      return sendJson({ success: true });
    }
    if (pathname === '/api/quiz/finish' && req.method === 'POST') {
      const session = db.recordQuizSession(body);
      return sendJson({ success: true, session });
    }

    sendJson({ error: 'Not Found', path: pathname }, 404);
  });

  server.listen(PORT, () => {
    console.log(`[Native HTTP Backend] Running on http://localhost:${PORT}`);
  });
}
