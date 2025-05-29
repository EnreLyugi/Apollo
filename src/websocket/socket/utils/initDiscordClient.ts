import client from "../../client";
import * as clientEvents from "../../client/events"

export const initDiscordClient = async () => {
    return new Promise((resolve, reject) => {
        // Se o client já estiver pronto, apenas retorna
        if (client.isReady() && client.user) {
            resolve('Bot já está conectado.');
            return;
        }

        // Caso contrário, espera o evento ready
        const timeout = setTimeout(() => {
            reject('Timeout ao esperar o bot ficar pronto');
        }, 10000); // 10 segundos de timeout

        client.once('ready', () => {
            clearTimeout(timeout);
            resolve('Bot pronto');
        });

        client.on('interactionCreate', clientEvents.onInteractionCreate);

        // Cada serviço já tem seu próprio DISCORD_TOKEN configurado
        const token = process.env.DISCORD_TOKEN;
        if (!token) {
            console.error('Token não encontrado');
            reject('Token não encontrado');
            return;
        }

        client.login(token).catch((error) => {
            console.error('Erro ao fazer login no bot:', error);
            reject('Erro ao conectar o bot');
        });
    });
}