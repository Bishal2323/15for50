import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './setup/db';
import { loadEnv } from './setup/env';
import authRouter from './routes/auth';
import reportsRouter from './routes/reports';
import assessmentsRouter from './routes/assessments';
import riskRouter from './routes/risk';
import usersRouter from './routes/users';
import coachRouter from './routes/coach';
import adminRouter from './routes/admin';
import notificationsRouter from './routes/notifications';
import messagesRouter from './routes/messages';
import patientsRouter from './routes/patients';
import physioRouter from './routes/physio';
import riskFactorRouter from './routes/riskFactor';
import { seedDemo } from './setup/seed';

const env = loadEnv();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.get('/health', (_req: Request, res: Response) => res.json({ status: 'healthy' }));

const api = express.Router();
api.get('/', (_req: Request, res: Response) => res.json({ status: 'ok' }));
api.get('/health', (_req: Request, res: Response) => res.json({ status: 'healthy' }));
api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/reports', reportsRouter);
api.use('/assessments', assessmentsRouter);
api.use('/risk', riskRouter);
api.use('/coach', coachRouter);
api.use('/admin', adminRouter);
api.use('/notifications', notificationsRouter);
api.use('/messages', messagesRouter);
api.use('/patients', patientsRouter);
api.use('/physio', physioRouter);
api.use('/risk-factors', riskFactorRouter);

app.use('/api/v1', api);

async function start() {
  connectDB(env.MONGO_URI, env.DB_NAME)
    .then(async () => {
      console.log('DB successful');
      if (env.SEED_DEMO) {
        try {
          await seedDemo();
        } catch (e) {
          console.error('Seeding failed:', e);
        }
      }
    })
    .catch((err: unknown) => { console.error('DB connection error:', err); });

  app.listen(env.PORT, () => {
    console.log(`Express server running on http://localhost:${env.PORT}/api/v1`);
  });
}

start().catch((err: unknown) => {
  console.error('Failed to start server', err);
});
