"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDemo = seedDemo;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
async function seedDemo() {
    const coachEmail = 'demo@coach.local';
    const athleteEmail = 'athlete@demo.local';
    const coach = await user_model_1.User.findOne({ email: coachEmail });
    if (!coach) {
        await user_model_1.User.create({
            email: coachEmail,
            role: 'Coach',
            teamId: undefined,
            passwordHash: await bcryptjs_1.default.hash('demo', 10),
        });
        // eslint-disable-next-line no-console
        console.log('Seeded demo coach');
    }
    const athlete = await user_model_1.User.findOne({ email: athleteEmail });
    if (!athlete) {
        await user_model_1.User.create({
            email: athleteEmail,
            role: 'Athlete',
            teamId: undefined,
            passwordHash: await bcryptjs_1.default.hash('demo', 10),
        });
        // eslint-disable-next-line no-console
        console.log('Seeded demo athlete');
    }
}
//# sourceMappingURL=seed.js.map