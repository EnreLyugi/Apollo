"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const validateEnv = () => {
    const requiredEnvVars = [
        'PORT',
        'DATABASE_URL',
        'DISCORD_TOKEN',
        'DISCORD_CLIENT_ID',
    ];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Required Environment variable ${envVar} is not defined`);
        }
    });
    console.log(`Environment variables setup!`);
};
exports.validateEnv = validateEnv;
