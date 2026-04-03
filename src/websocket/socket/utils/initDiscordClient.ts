import client from "../../client";
import * as clientEvents from "../../client/events"

export const initDiscordClient = async () => {
    return new Promise((resolve, reject) => {
        // If client is already ready, just return
        if (client.isReady() && client.user) {
            resolve('Bot is already connected');
            return;
        }

        // Otherwise, wait for ready event
        const timeout = setTimeout(() => {
            reject('Timeout waiting for bot to be ready');
        }, 10000); // 10 seconds timeout

        client.once('ready', () => {
            clearTimeout(timeout);
            resolve('Bot is ready');
        });

        client.on('interactionCreate', clientEvents.onInteractionCreate);

        // Each service has its own DISCORD_TOKEN configured
        const token = process.env.DISCORD_TOKEN;
        if (!token) {
            console.error('Token not found');
            reject('Token not found');
            return;
        }

        client.login(token).catch((error) => {
            console.error('Error logging in:', error);
            reject('Failed to connect bot');
        });
    });
}