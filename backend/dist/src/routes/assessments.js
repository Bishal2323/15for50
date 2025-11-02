"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessment_model_1 = require("../models/assessment.model");
const auth_1 = require("../middleware/auth");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_1 = require("../setup/env");
const env = (0, env_1.loadEnv)();
const router = (0, express_1.Router)();
router.get('/presign', auth_1.requireAuth, (0, auth_1.requireRole)(['Coach', 'Physiotherapist']), async (req, res) => {
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.S3_BUCKET_NAME) {
        return res.status(501).json({ error: 'S3 not configured' });
    }
    const s3 = new client_s3_1.S3Client({ region: env.AWS_REGION, credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY } });
    const key = `assessments/${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`;
    const cmd = new client_s3_1.PutObjectCommand({ Bucket: env.S3_BUCKET_NAME, Key: key, ContentType: 'video/mp4' });
    const url = await (0, s3_request_presigner_1.getSignedUrl)(s3, cmd, { expiresIn: 300 });
    return res.json({ url, key });
});
router.post('/', auth_1.requireAuth, (0, auth_1.requireRole)(['Coach', 'Physiotherapist']), async (req, res) => {
    const payload = req.body;
    const assessment = await assessment_model_1.Assessment.create({
        athleteId: payload.athleteId,
        date: new Date(),
        hamstringStrength: payload.hamstringStrength,
        quadStrength: payload.quadStrength,
        mobility: payload.mobility,
        videoUrl: payload.videoUrl,
    });
    return res.status(201).json({ assessment });
});
exports.default = router;
//# sourceMappingURL=assessments.js.map