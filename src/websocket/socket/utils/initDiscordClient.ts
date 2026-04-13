import client from '../../client';

/** Espera o bot já iniciado pela app principal; não chama login() de novo. */
export const initDiscordClient = async (): Promise<string> => {
    if (client.isReady() && client.user) {
        return 'Bot is already connected';
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for bot to be ready'));
        }, 10_000);

        client.once('clientReady', () => {
            clearTimeout(timeout);
            resolve('Bot is ready');
        });
    });
};
