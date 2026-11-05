import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { requestId } from './middlewares/requestId';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';

import authRoutes from './modules/auth/auth.routes';
import jobsRoutes from './modules/jobs/jobs.routes';
import applicationsRoutes from './modules/applications/applications.routes';

const app = express();

app.use(requestId);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
      },
    },
  })
);

const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '100kb' }));

if (env.NODE_ENV !== 'test') {
  morgan.token('id', (req: express.Request) => req.id);
  app.use(morgan('[:id] :method :url :status :response-time ms'));
}

app.get('/api/health', (_req, res) => {
  sendSuccess(res, { status: 'ok' });
});

const candidatePaths = [
  path.resolve(__dirname, '../openapi.yaml'),
  path.resolve(process.cwd(), 'openapi.yaml'),
  path.resolve(process.cwd(), 'be/openapi.yaml'),
  path.resolve(__dirname, 'openapi.yaml'),
  path.resolve(__dirname, '../../openapi.yaml'),
];

const openapiPath = candidatePaths.find((p) => fs.existsSync(p));

if (openapiPath) {
  try {
    const swaggerDocument = YAML.load(openapiPath);

    app.get('/api/docs/openapi.json', (_req, res) => {
      res.json(swaggerDocument);
    });

    app.get('/docs', (_req, res) => {
      res.redirect('/api/docs/');
    });

    app.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        customSiteTitle: 'Indokerja Job Application API - Documentation',
      })
    );
  } catch (error) {
    if (env.NODE_ENV !== 'test') {
      console.warn('Gagal memuat openapi.yaml:', error);
    }
  }
} else {
  if (env.NODE_ENV !== 'test') {
    console.warn('File openapi.yaml tidak ditemukan di lokasi pencarian.');
  }
}

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
