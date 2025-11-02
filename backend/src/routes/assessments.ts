import { Router, Request, Response } from 'express';
import { Assessment } from '../models/assessment.model';
import { requireAuth, requireRole } from '../middleware/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { loadEnv } from '../setup/env';

const env = loadEnv();
const router = Router();

router.get('/presign', requireAuth, requireRole(['Coach', 'Physiotherapist']), async (req: Request, res: Response) => {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.S3_BUCKET_NAME) {
    return res.status(501).json({ error: 'S3 not configured' });
  }
  const s3 = new S3Client({ region: env.AWS_REGION, credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY } });
  const key = `assessments/${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`;
  const cmd = new PutObjectCommand({ Bucket: env.S3_BUCKET_NAME, Key: key, ContentType: 'video/mp4' });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });
  return res.json({ url, key });
});

router.post('/', requireAuth, requireRole(['Coach', 'Physiotherapist']), async (req: Request, res: Response) => {
  const payload = req.body;
  const assessment = await Assessment.create({
    athleteId: payload.athleteId,
    date: new Date(),
    hamstringStrength: payload.hamstringStrength,
    quadStrength: payload.quadStrength,
    mobility: payload.mobility,
    videoUrl: payload.videoUrl,
  });
  return res.status(201).json({ assessment });
});

export default router;