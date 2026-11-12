import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-embedded-fallback',
      configureServer(server) {
        // Embedded API handler inside Vite dev server so everything works even without starting server.js
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api')) {
            return next();
          }

          try {
            const { db } = await import('./server/db.js');
            const url = new URL(req.url, 'http://localhost:5173');
            const pathname = url.pathname;

            res.setHeader('Content-Type', 'application/json');

            // Collect body if POST
            let body = {};
            if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const str = Buffer.concat(buffers).toString();
              if (str) {
                try { body = JSON.parse(str); } catch {}
              }
            }

            if (pathname === '/api/health') {
              res.end(JSON.stringify({ status: 'ok', version: '1.2.0', mode: 'vite-embedded' }));
              return;
            }

            if (pathname === '/api/stats') {
              res.end(JSON.stringify(db.getStats()));
              return;
            }

            if (pathname === '/api/topics') {
              res.end(JSON.stringify(db.getTopics()));
              return;
            }

            if (pathname === '/api/auth/me') {
              res.end(JSON.stringify(db.getUser()));
              return;
            }

            if (pathname === '/api/auth/login' && req.method === 'POST') {
              const user = {
                id: `user-${Date.now()}`,
                name: body.name || (body.email ? body.email.split('@')[0] : 'Alex Rivera'),
                email: body.email || 'alex@aqg.ai',
                avatar: (body.name || 'Alex').charAt(0).toUpperCase(),
                role: body.role || 'Student',
                streakDays: db.getUser().streakDays || 8,
                joinedAt: new Date().toISOString(),
              };
              db.data.user = user;
              db.save();
              res.end(JSON.stringify({ success: true, user, token: 'jwt-embedded-dev' }));
              return;
            }

            if (pathname === '/api/generate' && req.method === 'POST') {
              // Quick simulation delay
              await new Promise((r) => setTimeout(r, 800));
              const questions = db.generateQuestions(body);
              res.end(JSON.stringify({ success: true, count: questions.length, questions }));
              return;
            }

            if (pathname === '/api/history' && req.method === 'GET') {
              res.end(JSON.stringify(db.getHistory()));
              return;
            }

            if (pathname.startsWith('/api/history/') && req.method === 'DELETE') {
              const id = pathname.split('/').pop();
              db.deleteHistory(id);
              res.end(JSON.stringify({ success: true }));
              return;
            }

            if (pathname === '/api/saved' && req.method === 'GET') {
              res.end(JSON.stringify(db.getSaved()));
              return;
            }

            if (pathname === '/api/saved' && req.method === 'POST') {
              const saved = db.saveQuestion(body);
              res.end(JSON.stringify({ success: true, saved }));
              return;
            }

            if (pathname.startsWith('/api/saved/') && req.method === 'DELETE') {
              const id = pathname.split('/').pop();
              db.unsaveQuestion(id);
              res.end(JSON.stringify({ success: true }));
              return;
            }

            if (pathname === '/api/quiz/finish' && req.method === 'POST') {
              const session = db.recordQuizSession(body);
              res.end(JSON.stringify({ success: true, session, streakDays: db.getUser().streakDays }));
              return;
            }

            next();
          } catch (e) {
            console.error('[Vite API Middleware Error]:', e);
            next();
          }
        });
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      // If external express server runs on 5000, Vite can also forward
    },
  },
});
