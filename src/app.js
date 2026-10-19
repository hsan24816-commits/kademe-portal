'use strict';
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const auth = require('./auth');
const { errorHandler, HttpError } = require('./http');

function createApp(pool) {
  const app = express();
  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        // style attributes carry progress-bar widths and avatar colours
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: auth.httpsOnly() ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    strictTransportSecurity: auth.httpsOnly(),
    // These two only work on https origins and log console warnings over plain http.
    crossOriginOpenerPolicy: auth.httpsOnly(),
    originAgentCluster: auth.httpsOnly(),
  }));

  app.get('/healthz', async (req, res) => {
    try { await pool.query('SELECT 1'); res.json({ ok: true }); } catch { res.status(503).json({ ok: false }); }
  });

  const api = express.Router();
  api.use(express.json({ limit: '100kb' }));
  api.use(auth.csrfGuard);
  api.use(auth.sessionMiddleware(pool));
  api.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

  api.get('/config', (req, res) => {
    res.json({
      orgName: process.env.ORG_NAME || 'Kademe',
      demo: process.env.DEMO_MODE === '1',
    });
  });
  api.use(require('./routes/auth')(pool));
  api.use(auth.requireUser);
  api.use(require('./routes/bootstrap')(pool));
  api.use(require('./routes/projects')(pool));
  api.use(require('./routes/meetings')(pool));
  api.use(require('./routes/lobby')(pool));
  api.use(require('./routes/misc')(pool));
  api.use(require('./routes/users')(pool));
  api.use((req, res, next) => next(new HttpError(404, 'Bulunamadı.')));
  api.use(errorHandler);
  app.use('/api', api);

  const pub = path.join(__dirname, '..', 'public');
  app.use(express.static(pub, { index: false, maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0 }));
  app.get('*', (req, res) => res.sendFile(path.join(pub, 'index.html')));
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
