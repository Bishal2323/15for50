"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function loadEnv() {
    return {
        PORT: Number(process.env.PORT || 3000),
        MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acl_mvp',
        DB_NAME: process.env.DB_NAME || 'acl',
        USE_MEMORY_DB: (process.env.USE_MEMORY_DB || 'true') === 'true',
        JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
        AWS_REGION: process.env.AWS_REGION || 'us-east-1',
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'acl-monitor-files',
        SEED_DEMO: (process.env.SEED_DEMO || 'true') === 'true',
        GEMINI_API_URL: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyCnLBSZ7KioxdpLrebUpciYg_NzolWqJVk',
    };
}
//# sourceMappingURL=env.js.map