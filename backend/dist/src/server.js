"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./setup/db");
const env_1 = require("./setup/env");
const auth_1 = __importDefault(require("./routes/auth"));
const reports_1 = __importDefault(require("./routes/reports"));
const assessments_1 = __importDefault(require("./routes/assessments"));
const risk_1 = __importDefault(require("./routes/risk"));
const users_1 = __importDefault(require("./routes/users"));
const coach_1 = __importDefault(require("./routes/coach"));
const env = (0, env_1.loadEnv)();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '2mb' }));
app.use((0, morgan_1.default)('dev'));
app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
const api = express_1.default.Router();
api.get('/', (_req, res) => res.json({ status: 'ok' }));
api.get('/health', (_req, res) => res.json({ status: 'healthy' }));
api.use('/auth', auth_1.default);
api.use('/users', users_1.default);
api.use('/daily-reports', reports_1.default);
api.use('/assessments', assessments_1.default);
api.use('/risk', risk_1.default);
api.use('/coach', coach_1.default);
app.use('/api/v1', api);
async function start() {
    (0, db_1.connectDB)(env.MONGO_URI, env.DB_NAME)
        .then(() => {
        console.log('DB successful');
    })
        .catch((err) => { console.error('DB connection error:', err); });
    app.listen(env.PORT, () => {
        console.log(`Express server running on http://localhost:${env.PORT}/api/v1`);
    });
}
start().catch((err) => {
    console.error('Failed to start server', err);
});
//# sourceMappingURL=server.js.map