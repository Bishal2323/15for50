"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDemo = seedDemo;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
async function seedDemo() {
    const coachEmail = 'male@coach.local';
    const athleteEmail = 'male@athlete.local';
    const femaleAthlete = 'female@athlete.local';
    const adminEmail = 'bishal@admin.local';
    const coach = await user_model_1.User.findOne({ email: coachEmail });
    if (!coach) {
        await user_model_1.User.create({
            name: 'Demo Coach',
            email: coachEmail,
            role: 'Coach',
            gender: 'male',
            teamId: undefined,
            passwordHash: await bcryptjs_1.default.hash('demo', 10),
        });
        // eslint-disable-next-line no-console
        console.log('Seeded demo coach');
    }
    const athlete = await user_model_1.User.findOne({ email: athleteEmail });
    if (!athlete) {
        await user_model_1.User.create({
            name: 'Male Athlete',
            email: athleteEmail,
            role: 'Athlete',
            gender: 'male',
            teamId: undefined,
            passwordHash: await bcryptjs_1.default.hash('demo', 10),
        });
        await user_model_1.User.create({
            name: 'Female Athlete',
            email: femaleAthlete,
            role: 'Athlete',
            gender: 'female',
            teamId: undefined,
            passwordHash: await bcryptjs_1.default.hash('demo', 10),
        });
        // eslint-disable-next-line no-console
        console.log('Seeded demo athlete');
    }
    const admin = await user_model_1.User.findOne({ email: adminEmail });
    if (!admin) {
        await user_model_1.User.create({
            name: 'Admin User',
            email: adminEmail,
            role: 'Admin',
            gender: 'male',
            teamId: undefined,
            passwordHash: await bcryptjs_1.default.hash('admin', 10),
        });
        // eslint-disable-next-line no-console
        console.log('Seeded admin user: bishal@admin.com');
    }
}
//# sourceMappingURL=seed.js.map