"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB(uri, dbName) {
    try {
        if (uri) {
            await mongoose_1.default.connect(uri, dbName ? { dbName } : undefined);
            // eslint-disable-next-line no-console
            console.log('Connected MongoDB:', dbName ? `(db: ${dbName})` : '');
            return;
        }
        throw new Error('No MONGO_URI provided');
    }
    catch (err) {
        // eslint-disable-next-line no-console
        // eslint-disable-next-line no-console
        console.log('Using in-memory MongoDB at');
    }
}
//# sourceMappingURL=db.js.map