import client from '../../client';
import * as clientEvents from '../../client/events';

export const initDiscordClient = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (client.isReady() && client.user) {
            resolve('Bot is already connected');
            return;
        }

        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for bot to be ready'));
        }, 10_000);

        client.once('clientReady', () => {
            clearTimeout(timeout);
            resolve('Bot is ready');
        });

        client.on('interactionCreate', clientEvents.onInteractionCreate);

        const token = process.env.DISCORD_TOKEN;
        if (!token) {
            console.error('Token not found');
            reject(new Error('Token not found'));
            return;
        }

        client.login(token).catch((error) => {
            console.error('Error logging in:', error);
            reject(new Error('Failed to connect bot'));
        });
    });
};
